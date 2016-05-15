package com.example.rumo.anti_fall;

import android.os.Handler;
import android.os.StrictMode;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;


public class MyActivity extends ActionBarActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my);
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();

        StrictMode.setThreadPolicy(policy);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_my, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
    public void login(final View view){
        final Handler h = new Handler();
        final int delay = 1000; //milliseconds

        h.postDelayed(new Runnable(){
            public void run(){
                //do something
                sendMessage(view);
                h.postDelayed(this, delay);
            }
        }, delay);
    }

    public void sendMessage(View view) {
        Log.v("sM method ","Dela");
        EditText editText = (EditText) findViewById(R.id.edit_message);
        String message = "";
        if(editText!=null) {
             message = editText.getText().toString();
            Log.v("sM method ", message);
        }
        JSONObject res = null;
        try{
            res = getJSONObjectFromURL("http://fallalert-pes1.rhcloud.com/" + message);

            // Parse your json here

        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        if(res!=null) {
            Log.v("poop", res.toString());
            String ime = null;
            String status = null;
            try {
               ime =  (res.getJSONObject("Oseba")).getString("Ime");
                status = (res.getJSONObject("Oseba")).getString("Status");
            } catch (JSONException e) {
                e.printStackTrace();
            }
            // String id = res.getString(TAG_ID);
            Log.v("poop", ime + " " + status);
            TextView stanje_b = (TextView) findViewById(R.id.stanje);

            if(status.equals("true")){

                stanje_b.setText("Zgodila se je nezgoda");
            }
            else{
                stanje_b.setText("Vse je OK");
            }
        }

    }

    public static JSONObject getJSONObjectFromURL(String urlString) throws IOException, JSONException {

        HttpURLConnection urlConnection = null;

        URL url = new URL(urlString);

        urlConnection = (HttpURLConnection) url.openConnection();

        urlConnection.setRequestMethod("GET");
        urlConnection.setReadTimeout(10000 /* milliseconds */);
        urlConnection.setConnectTimeout(15000 /* milliseconds */);

        urlConnection.setDoOutput(true);

        urlConnection.connect();

        BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()));

        char[] buffer = new char[1024];

        String jsonString = new String();

        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            sb.append(line+"\n");
        }
        br.close();

        jsonString = sb.toString();

        System.out.println("JSON: " + jsonString);

        return new JSONObject(jsonString);
    }
}