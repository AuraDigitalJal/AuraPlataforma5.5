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
                return ((a+c)//2,(b+d)//2, n.attrib.get("text") or n.attrib.get("content-desc"))
    return None
def tap(label, name, required=True):
    root=hierarchy("before-"+name)
    match=find(root,label)
    if match:
        adb("shell","input","tap",str(match[0]),str(match[1]))
        time.sleep(3)
        screenshot(name)
        nextroot=hierarchy("after-"+name)
        step("tocar "+label,True,f"({match[0]}, {match[1]})")
        return nextroot
    step("tocar "+label,not required,"No encontrado en jerarquía de accesibilidad")
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
        root=tap("Colores y estilo","03-colores")
        hasColors=find(root,"Elige los colores") is not None or find(root,"Apariencia") is not None
        step("acceso a menú de colores",hasColors,"Título de sección localizado" if hasColors else "Pantalla de colores no identificada")
        root=tap("Fotos y música","04-fotos-musica")
        hasPhotos=find(root,"Fotografías") is not None or find(root,"Foto de portada") is not None
        step("acceso a fotografías y música",hasPhotos)
        if hasPhotos:
            root=tap("Elegir archivo","05-selector-archivos",required=False)
            chooser=find(root,"Recientes") if root is not None else None
            picker=find(root,"Fotos") if root is not None else None
            ui=adb("shell","dumpsys","activity","activities",check=False).stdout
            opened="documentsui" in ui.lower() or chooser is not None or picker is not None
            step("selector nativo de archivos",opened,"Comprobación del diálogo de Android")
            adb("shell","input","keyevent","4",check=False)
            time.sleep(2)
        root=tap("Datos y textos","06-editor-textos")
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
