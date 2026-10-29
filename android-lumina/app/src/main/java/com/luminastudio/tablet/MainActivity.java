package com.luminastudio.tablet;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DownloadManager;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Message;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public final class MainActivity extends Activity {
    private static final String HOME =
            "https://auradigitaljal.com/AuraPlataforma5.5/preview/lumina-v4?v=lumina-direct-menu-v4-20261028";
    private static final String HOST = "auradigitaljal.com";
    private static final int REQUEST_FILES = 5210;
    private static final long MAX_DOWNLOAD_BYTES = 450L * 1024 * 1024;
    private WebView webView;
    private ValueCallback<Uri[]> pendingFiles;
    private final Map<String, DownloadTransfer> downloads = new HashMap<>();
    private String downloadHook = "";

    private static class DownloadTransfer {
        String id;
        String name;
        Uri uri;
        File file;
        OutputStream stream;
        long expected;
        long received;
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(107, 70, 92));
        getWindow().setNavigationBarColor(Color.rgb(251, 249, 248));
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        try (InputStream in = getAssets().open("download-bridge.js")) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192]; int n;
            while ((n = in.read(buffer)) != -1) out.write(buffer, 0, n);
            downloadHook = out.toString(StandardCharsets.UTF_8.name());
        } catch (Exception ignored) { downloadHook = ""; }
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(251, 249, 248));
        setContentView(webView);
        configure(webView, true);
        webView.loadUrl(HOME);
    }

    private void configure(WebView view, boolean primary) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        if (Build.VERSION.SDK_INT >= 26) settings.setSafeBrowsingEnabled(true);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(view, true);
        view.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                return openExternal(req.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView v, String url) {
                return openExternal(Uri.parse(url));
            }
            @Override public void onPageFinished(WebView v, String url) {
                if(primary && isTrustedUrl(Uri.parse(url)) && !downloadHook.isEmpty()) {
                    v.evaluateJavascript(downloadHook, null);
                }
            }
            @Override public void onReceivedError(WebView v, WebResourceRequest req, WebResourceError error) {
                if(primary && req.isForMainFrame()) {
                    Toast.makeText(MainActivity.this, "No hay conexión. Conecta la tablet e intenta de nuevo.", Toast.LENGTH_LONG).show();
                }
            }
        });
        view.setWebChromeClient(new BrowserChrome(primary));
        view.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            if (url.startsWith("blob:") || url.startsWith("data:")) {
                Toast.makeText(this, "Preparando archivo. Si no se descarga, genera el ZIP otra vez.", Toast.LENGTH_LONG).show();
            } else {
                downloadHttp(url, userAgent, contentDisposition, mimeType);
            }
        });
        if(primary && WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            Set<String> allowed = new HashSet<>();
            allowed.add("https://" + HOST);
            WebViewCompat.addWebMessageListener(view, "LuminaAndroid", allowed,
                    (page, message, origin, isMainFrame, reply) -> {
                        if (!isMainFrame || !"https".equalsIgnoreCase(origin.getScheme()) ||
                            !HOST.equalsIgnoreCase(origin.getHost()) ||
                            message.getType() != WebMessageCompat.TYPE_STRING) return;
                        receiveDownloadCommand(message.getData());
                    });
        }
    }

    private boolean isTrustedUrl(Uri uri) {
        return "https".equalsIgnoreCase(uri.getScheme()) && HOST.equalsIgnoreCase(uri.getHost());
    }

    private boolean openExternal(Uri uri) {
        String scheme = uri.getScheme();
        if (isTrustedUrl(uri)) return false;
        if ("about".equals(scheme) || "blob".equals(scheme) || "data".equals(scheme) ||
                "javascript".equals(scheme)) return false;
        if (scheme != null && (scheme.equals("http") || scheme.equals("https") ||
                scheme.equals("geo") || scheme.equals("mailto") || scheme.equals("tel"))) {
            try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
            catch (Exception err) { Toast.makeText(this, "No hay aplicación para abrir este enlace.", Toast.LENGTH_SHORT).show(); }
            return true;
        }
        return false;
    }

    private final class BrowserChrome extends WebChromeClient {
        private final boolean supportsPopups;
        BrowserChrome(boolean supportsPopups) { this.supportsPopups = supportsPopups; }
        @Override public boolean onShowFileChooser(WebView web, ValueCallback<Uri[]> callback,
                                                     FileChooserParams params) {
            if (pendingFiles != null) pendingFiles.onReceiveValue(null);
            pendingFiles = callback;
            try {
                Intent chooserIntent = params.createIntent();
                chooserIntent.addCategory(Intent.CATEGORY_OPENABLE);
                chooserIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE);
                startActivityForResult(Intent.createChooser(chooserIntent, "Selecciona fotos, música o archivos"), REQUEST_FILES);
                return true;
            } catch (Exception error) {
                pendingFiles = null;
                callback.onReceiveValue(null);
                Toast.makeText(MainActivity.this, "No se pudo abrir el selector de archivos.", Toast.LENGTH_LONG).show();
                return true;
            }
        }
        @Override public boolean onJsAlert(WebView v, String url, String message, JsResult result) {
            new AlertDialog.Builder(MainActivity.this).setMessage(message)
                .setPositiveButton("Aceptar", (d, w) -> result.confirm()).setCancelable(false).show();
            return true;
        }
        @Override public boolean onJsConfirm(WebView v, String url, String message, JsResult result) {
            new AlertDialog.Builder(MainActivity.this).setMessage(message)
                .setPositiveButton("Continuar", (d, w) -> result.confirm())
                .setNegativeButton("Cancelar", (d, w) -> result.cancel()).setCancelable(false).show();
            return true;
        }
        @Override public boolean onCreateWindow(WebView view, boolean dialog,
                                                boolean userGesture, Message resultMsg) {
            if (!supportsPopups) return false;
            LinearLayout container = new LinearLayout(MainActivity.this);
            container.setOrientation(LinearLayout.VERTICAL);
            container.setBackgroundColor(Color.WHITE);
            Button close = new Button(MainActivity.this);
            close.setText("✕   Cerrar vista previa");
            close.setAllCaps(false);
            close.setOnClickListener(v -> {
                Dialog active = (Dialog) container.getTag();
                if (active != null) active.dismiss();
            });
            container.addView(close, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 54));
            WebView popup = new WebView(MainActivity.this);
            container.addView(popup, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));
            configure(popup, false);
            Dialog window = new Dialog(MainActivity.this, android.R.style.Theme_Material_Light_NoActionBar_Fullscreen);
            container.setTag(window);
            window.setContentView(container);
            window.setOnDismissListener(d -> {
                try { popup.stopLoading(); popup.destroy(); } catch (Exception ignored) {}
            });
            window.show();
            if (window.getWindow() != null) window.getWindow().setLayout(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
            WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
            transport.setWebView(popup);
            resultMsg.sendToTarget();
            return true;
        }
        @Override public void onCloseWindow(WebView popup) {
            if (popup != null && popup.getParent() instanceof LinearLayout) {
                LinearLayout root = (LinearLayout) popup.getParent();
                Dialog active = (Dialog) root.getTag();
                if (active != null) active.dismiss();
            }
        }
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQUEST_FILES || pendingFiles == null) return;
        Uri[] results = null;
        if (resultCode == RESULT_OK && data != null) {
            if (data.getClipData() != null) {
                int count = data.getClipData().getItemCount();
                results = new Uri[count];
                for (int i = 0; i < count; i++) results[i] = data.getClipData().getItemAt(i).getUri();
            } else if (data.getData() != null) results = new Uri[]{ data.getData() };
        }
        pendingFiles.onReceiveValue(results);
        pendingFiles = null;
    }

    private void downloadHttp(String address, String agent, String disposition, String mime) {
        try {
            Uri url = Uri.parse(address);
            if (!isTrustedUrl(url)) { openExternal(url); return; }
            String name = android.webkit.URLUtil.guessFileName(address, disposition, mime);
            DownloadManager.Request request = new DownloadManager.Request(url);
            request.setTitle(name);
            request.setMimeType(mime);
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            String cookie = CookieManager.getInstance().getCookie(address);
            if (cookie != null) request.addRequestHeader("Cookie", cookie);
            if (agent != null) request.addRequestHeader("User-Agent", agent);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
            DownloadManager manager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            manager.enqueue(request);
            Toast.makeText(this, "Descargando " + name, Toast.LENGTH_SHORT).show();
        } catch (Exception e) { Toast.makeText(this, "No se pudo iniciar la descarga.", Toast.LENGTH_LONG).show(); }
    }

    private static String cleanName(String value) {
        String sanitized = (value == null ? "" : value).replaceAll("[^a-zA-Z0-9._ -]", "_");
        sanitized = sanitized.replaceAll("^\\.+", "");
        if (sanitized.isEmpty()) sanitized = "Lumina-invitacion.zip";
        if (sanitized.length() > 100) sanitized = sanitized.substring(sanitized.length() - 100);
        return sanitized;
    }

    private synchronized void receiveDownloadCommand(String json) {
        try {
            JSONObject data = new JSONObject(json);
            String kind = data.optString("kind","");
            String id = data.optString("id", "");
            if (id.length() < 4 || id.length() > 80) return;
            if (kind.equals("begin")) {
                long size = data.optLong("size", -1);
                if (size < 1 || size > MAX_DOWNLOAD_BYTES) {
                    Toast.makeText(this, "El archivo excede el límite de 450 MB.", Toast.LENGTH_LONG).show();
                    return;
                }
                if (downloads.containsKey(id)) return;
                DownloadTransfer transfer = new DownloadTransfer();
                transfer.id = id; transfer.name = cleanName(data.optString("name", "Lumina-invitacion.zip"));
                transfer.expected = size;
                String mime = transfer.name.endsWith(".json") ? "application/json" : "application/zip";
                if (Build.VERSION.SDK_INT >= 29) {
                    ContentValues attrs = new ContentValues();
                    attrs.put(MediaStore.MediaColumns.DISPLAY_NAME, transfer.name);
                    attrs.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                    attrs.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/LuminaStudio");
                    attrs.put(MediaStore.MediaColumns.IS_PENDING, 1);
                    transfer.uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, attrs);
                    if (transfer.uri == null) throw new IllegalStateException("No se pudo crear archivo de destino.");
                    transfer.stream = getContentResolver().openOutputStream(transfer.uri, "w");
                } else {
                    File folder = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                    if (folder == null) throw new IllegalStateException("No se pudo abrir la carpeta de archivos.");
                    if (!folder.exists() && !folder.mkdirs()) throw new IllegalStateException("Carpeta inaccesible.");
                    transfer.file = new File(folder, transfer.name);
                    transfer.stream = new FileOutputStream(transfer.file);
                }
                if (transfer.stream == null) throw new IllegalStateException("No se pudo escribir el archivo.");
                downloads.put(id, transfer);
            } else if (kind.equals("chunk")) {
                DownloadTransfer t = downloads.get(id);
                if (t == null) return;
                byte[] bytes = Base64.decode(data.optString("base64", ""), Base64.DEFAULT);
                if (bytes.length > 64 * 1024 || t.received + bytes.length > t.expected) {
                    cancelDownload(id);
                    return;
                }
                t.stream.write(bytes);
                t.received += bytes.length;
            } else if (kind.equals("end")) {
                DownloadTransfer t = downloads.remove(id);
                if (t == null) return;
                t.stream.close();
                if (t.expected != t.received) {
                    deletePartial(t);
                    Toast.makeText(this, "Descarga incompleta. Inténtalo otra vez.", Toast.LENGTH_LONG).show();
                    return;
                }
                if (Build.VERSION.SDK_INT >= 29 && t.uri != null) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.IS_PENDING, 0);
                    getContentResolver().update(t.uri, values, null, null);
                }
                Toast.makeText(this, "Guardado: Descargas / LuminaStudio / " + t.name, Toast.LENGTH_LONG).show();
            } else if (kind.equals("error")) {
                cancelDownload(id);
                Toast.makeText(this, "No se pudo generar la descarga. Prueba otra vez.", Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            Toast.makeText(this, "Error al guardar el archivo.", Toast.LENGTH_LONG).show();
        }
    }

    private synchronized void cancelDownload(String id) {
        DownloadTransfer t = downloads.remove(id);
        if (t == null) return;
        try { t.stream.close(); } catch (Exception ignored) {}
        deletePartial(t);
    }
    private void deletePartial(DownloadTransfer t) {
        try {
            if (t.uri != null) getContentResolver().delete(t.uri, null, null);
            if (t.file != null) t.file.delete();
        } catch (Exception ignored) {}
    }
    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else new AlertDialog.Builder(this).setMessage("¿Cerrar Lúmina? Asegúrate de haber guardado tu trabajo.")
            .setNegativeButton("Cancelar", null).setPositiveButton("Salir", (d,w)->finish()).show();
    }
    @Override protected void onDestroy() {
        for (String id : new HashSet<>(downloads.keySet())) cancelDownload(id);
        if (pendingFiles != null) { pendingFiles.onReceiveValue(null); pendingFiles=null; }
        if (webView != null) { webView.stopLoading(); webView.destroy(); }
        super.onDestroy();
    }
}