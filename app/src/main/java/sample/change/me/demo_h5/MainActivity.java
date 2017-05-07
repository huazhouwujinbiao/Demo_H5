package sample.change.me.demo_h5;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Window;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebStorage;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class MainActivity extends Activity {
    private static final String TAG = "MainActivity";
    private static  String WEB_URL="file:///android_asset/index.html";
    private WebView webview;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webview = (WebView) findViewById(R.id.webview);
        webview.setWebChromeClient(new MyChromeViewClient());
        webview.setWebViewClient(new MyWebViewClinet());
        //设置不用系统浏览器打开,直接显示在当前Webview
        webview.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
            @Override
            public void onReceivedError(WebView view, int errorCode,
                                        String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
            }
        });

        initWebViewSettings();
        initData();

    }


    private void initWebViewSettings() {
        WebSettings settings = webview.getSettings();

        //设置与Js交互的权限
        settings.setJavaScriptEnabled(true);
        //设置数据库可用
        settings.setDatabaseEnabled(true);
        String dbPath = this.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        settings.setDatabasePath(dbPath);

        settings.setDomStorageEnabled(true);

    }

    private void initData() {
        webview.loadUrl(WEB_URL);
    }



    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        //判断是否可以返回操作
        if (webview.canGoBack() && event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
            webview.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    class MyChromeViewClient extends WebChromeClient {

        @Override
        public void onExceededDatabaseQuota(String url, String databaseIdentifier, long currentQuota, long estimatedSize, long totalUsedQuota, WebStorage.QuotaUpdater quotaUpdater)
        {
//          quotaUpdater.updateQuota(estimatedSize * 2);
            quotaUpdater.updateQuota(5*1024*1024);
        }
        @Override
        public void onCloseWindow(WebView window) {
            MainActivity.this.finish();
            super.onCloseWindow(window);
        }

        public void onProgressChanged(WebView view, final int progress) {

        }

        @Override
        public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {

            new AlertDialog.Builder(MainActivity.this).setTitle("提示信息").setMessage(message)
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {

                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            result.confirm();
                        }
                    }).setCancelable(false).create().show();
            return true;
        }

        @Override
        public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {

            new AlertDialog.Builder(MainActivity.this).setTitle("提示信息").setMessage(message)
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {

                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            result.confirm();
                        }
                    }).setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    result.cancel();
                }
            }).setCancelable(false).create().show();
            return true;

        }
    }

    class MyWebViewClinet extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {

            return true;
        }

    }

}