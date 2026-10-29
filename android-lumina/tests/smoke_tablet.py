#!/usr/bin/env python3
"""Evidencia de prueba Android real para la APK Lúmina. No modifica datos de usuario."""
from pathlib import Path
import subprocess, time, xml.etree.ElementTree as ET, json, re, sys, os

OUT=Path("android-lumina/test-evidence")
OUT.mkdir(parents=True, exist_ok=True)
REPORT={"device":{},"checks":[],"screenshots":[]}
def adb(*args, check=True, timeout=60):
    return subprocess.run(["adb",*args], text=True, capture_output=True, timeout=timeout, check=check)
def step(name, ok, detail=""):
    REPORT["checks"].append({"test":name,"passed":bool(ok),"detail":detail})
    print(("PASS" if ok else "FAIL"),name,detail,flush=True)
def screenshot(name):
    p=OUT/(name+".png")
    with open(p,"wb") as f:
        run=subprocess.run(["adb","exec-out","screencap","-p"],stdout=f,stderr=subprocess.PIPE,timeout=30)
    if run.returncode==0 and p.stat().st_size>4000:REPORT["screenshots"].append(str(p))
    else:step("captura "+name,False,run.stderr.decode(errors="replace")[:150])
def hierarchy(name):
    remote="/sdcard/window.xml"
    run=adb("shell","uiautomator","dump",remote,check=False,timeout=35)
    if run.returncode!=0:
        print("UIAutomator dump:",run.stderr[:400],flush=True)
        return None
    local=OUT/(name+".xml")
    run=adb("pull",remote,str(local),check=False)
    try:return ET.parse(local).getroot()
    except Exception as e:
        print("UIAutomator parse:",e,flush=True)
        return None
def find(root,label):
    if root is None:return None
    for n in root.iter("node"):
        texts=[n.attrib.get("text",""),n.attrib.get("content-desc","")]
        if any(label.lower() in x.lower() for x in texts):
            m=re.match(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]",n.attrib.get("bounds",""))
            if m:
                a,b,c,d=map(int,m.groups())
                if c<=a or d<=b or a<0 or b<0:
                    continue
                return ((a+c)//2,(b+d)//2, n.attrib.get("text") or n.attrib.get("content-desc"))
    return None
def tap(label, name, required=True, direction="up"):
    root=hierarchy("before-"+name)
    match=find(root,label)
    # La vista WebView tiene desplazamiento interno: no pulsar nodos [0,0][0,0].
    for attempt in range(6):
        if match:break
        if direction=="down":
            adb("shell","input","swipe","330","660","330","300","380",check=False)
        else:
            adb("shell","input","swipe","330","300","330","660","380",check=False)
        time.sleep(1)
        root=hierarchy("scroll-"+name+"-"+str(attempt))
        match=find(root,label)
    if match:
        adb("shell","input","tap",str(match[0]),str(match[1]))
        time.sleep(3)
        screenshot(name)
        nextroot=hierarchy("after-"+name)
        step("tocar "+label,True,f"({match[0]}, {match[1]})")
        return nextroot
    step("tocar "+label,not required,"No visible ni después de desplazar la pantalla")
    return None

try:
    dev=adb("shell","getprop","ro.build.version.release").stdout.strip()
    REPORT["device"]["android"]=dev
    REPORT["device"]["screen"]=adb("shell","wm","size").stdout.strip()
    print("Dispositivo:",REPORT["device"],flush=True)
    apk=os.environ.get("LUMINA_APK","Lumina-Studio-Tablet-beta.apk")
    install=adb("install","-r",apk,check=False,timeout=120)
    step("instalación APK",install.returncode==0,install.stdout[-350:]+install.stderr[-200:])
    if install.returncode!=0:raise RuntimeError("No se instaló la APK")
    adb("shell","am","force-stop","com.luminastudio.tablet",check=False)
    launch=adb("shell","am","start","-n","com.luminastudio.tablet/.MainActivity",check=False)
    step("iniciar actividad Android",launch.returncode==0,launch.stdout[-250:])
    time.sleep(12)
    screenshot("01-apertura")
    root=hierarchy("01-apertura")
    menu=find(root,"Diseños")
    for _ in range(8):
        if menu:break
        time.sleep(4)
        root=hierarchy("01-esperando-web")
        menu=find(root,"Diseños")
    screenshot("02-app-cargada")
    step("cargar navegación real Lúmina",menu is not None, "Menú Diseños presente en WebView" if menu else "No visible en el árbol de accesibilidad")
    foreground=adb("shell","dumpsys","activity","activities",check=False).stdout
    step("actividad en primer plano", "com.luminastudio.tablet" in foreground, "Paquete detectado")
    if menu:
        # Misma distribución que Aura Pro: teléfono y editor visibles simultáneamente.
        # No existen botones Editar/Vista previa que deban activarse.
        root=hierarchy("02b-editor-y-telefono")
        editor_visible=find(root,"Diseños") is not None
        preview_visible=find(root,"Vista móvil") is not None or find(root,"PREVIEW") is not None
        step("editor y vista previa simultáneos",editor_visible and preview_visible,
             "El editor y el teléfono aparecen juntos, como en Aura Pro.")
        screenshot("02b-editor-y-telefono")
        root=tap("Colores y estilo","03-colores")
        hasColors=find(root,"Elige los colores") is not None or find(root,"Apariencia") is not None
        step("acceso a menú de colores",hasColors,"Título de sección localizado" if hasColors else "Pantalla de colores no identificada")
        root=tap("Fotos y música","04-fotos-musica")
        hasPhotos=find(root,"Fotografías") is not None or find(root,"Foto de portada") is not None
        step("acceso a fotografías y música",hasPhotos)
        if hasPhotos:
            root=tap("Elegir archivo","05-selector-archivos",required=True,direction="down")
            nodes=list(root.iter("node")) if root is not None else []
            packages={n.attrib.get("package","") for n in nodes}
            labels=[n.attrib.get("text","") for n in nodes if n.attrib.get("text","")]
            opened=any("documentsui" in p.lower() or "permissioncontroller" in p.lower() or "providers.media.module" in p.lower() for p in packages) or any(x in labels for x in ["Recientes","Browse","Examinar","Browse files","Archivos","No photos or videos","Photos","Albums"])
            step("selector nativo de archivos",opened,"Paquetes: "+", ".join(sorted(packages))[:150])
            if opened:
                adb("shell","input","keyevent","4",check=False)
                time.sleep(2)
        root=tap("Datos y textos","06-editor-textos",direction="up")
        step("acceso a edición de textos",find(root,"Información y textos") is not None or find(root,"Selecciona el texto") is not None)
        root=tap("Entrega","07-entrega")
        step("acceso a entrega",find(root,"Preparar invitación") is not None or find(root,"Generar ZIP") is not None)
    try:
        adb("logcat","-d","-t","1500",check=False,timeout=40)
        with open(OUT/"android-logcat.txt","w") as log:
            log.write(adb("logcat","-d","-t","2000",check=False,timeout=45).stdout[-100000:])
    except Exception as e:print("Logcat falló",e)
finally:
    (OUT/"report.json").write_text(json.dumps(REPORT,ensure_ascii=False,indent=2),encoding="utf-8")
    print("Reporte",json.dumps(REPORT,ensure_ascii=False)[:4000],flush=True)
if any(not x["passed"] for x in REPORT["checks"]):sys.exit(1)
