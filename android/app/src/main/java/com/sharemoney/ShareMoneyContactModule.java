package com.sharemoney;

import android.content.ContentResolver;
import android.content.Context;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.os.Build;
import android.os.Handler;
import android.os.Process;
import android.provider.ContactsContract;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class ShareMoneyContactModule extends ReactContextBaseJavaModule {
    private final String GRANTED = "granted";
    private final String DENIED = "denied";
    private final String BLOCKED = "blocked";
    private final String regExp = "[-()\\sA-Za-z]";

    ShareMoneyContactModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "ShareMoneyContactModule";
    }

    private boolean checkPermission() {
        Context context = getReactApplicationContext().getBaseContext();
        final String permission = android.Manifest.permission.READ_CONTACTS;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return (context.checkPermission(permission, Process.myPid(), Process.myUid())
                    == PackageManager.PERMISSION_GRANTED);

        }

        return context.checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED;
    }

    @ReactMethod
    public void checkPermissions(final String name, final Promise promise) {
        Log.d("[SHARE_MONEY]", name);
        promise.resolve(checkPermission());

    }

    @ReactMethod
    public void loadContacts(final int offset, final Promise promise) {
        Log.d("[SHARE_MONEY]", "Loading Contacts");
        Context context = getReactApplicationContext().getBaseContext();
        Handler handler = new Handler(context.getMainLooper());
        ShareMoneyContactModule m = this;

        handler.post(() -> m.loadContactsLocal(offset, promise, context));

    }


    private boolean isSame(final String previous, final String current) {
        // Prevent duplicate numbers from appearing
        String replacedPrevious = previous.replaceAll(regExp, "");
        String replacedCurrent = current.replaceAll(regExp, "");
        replacedPrevious = replacedPrevious.startsWith("+234") ? '0' + replacedPrevious.substring(4)
                : replacedPrevious;
        replacedCurrent = replacedCurrent.startsWith("+234") ? '0' + replacedCurrent.substring(4)
                : replacedCurrent;
        return replacedPrevious.equals(replacedCurrent);
    }

    public void loadContactsLocal (final int offset, final Promise promise, final Context context) {
        WritableArray promiseArray = Arguments.createArray();
        if (checkPermission()) {
            ContentResolver cr = context.getContentResolver();
            Cursor cur = cr.query(ContactsContract.Contacts.CONTENT_URI,
                    null, null, null, null);
            if ((cur != null ? cur.getCount() : 0) > 0) {
                 cur.moveToPosition(offset);
                while (cur != null && cur.moveToNext() && promiseArray.size() < 1000) {
                    int index = cur.getColumnIndex(ContactsContract.Contacts._ID);
                    if(index < 0) {
                        continue;
                    }
                    String id = cur.getString(index);
                    index = cur.getColumnIndex(
                            ContactsContract.Contacts.DISPLAY_NAME);
                    if(index < 0) {
                        continue;
                    }
                    WritableMap map = Arguments.createMap();
                    String name = cur.getString(index);
                    WritableArray numbers = Arguments.createArray();
                    index = cur.getColumnIndex(ContactsContract.Contacts.HAS_PHONE_NUMBER);
                    if(index < 0) {
                        continue;
                    }
                    if (cur.getInt(index) > 0) {
                        Cursor pCur = cr.query(
                                ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                                null,
                                ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = ?",
                                new String[]{id}, null);
                        String previous = "000000000000";
                        while (pCur.moveToNext()) {
                            int innerIndex = pCur.getColumnIndex(
                                    ContactsContract.CommonDataKinds.Phone.NUMBER);
                            if(innerIndex < 0) {
                                continue;
                            }
                            String phoneNo = pCur.getString(innerIndex);

                            if (!isSame(previous, phoneNo)) {
                                numbers.pushString(phoneNo);
                                previous = phoneNo;
                            }
                        }
                        pCur.close();
                        map.putString("name", name);
                        map.putArray("phoneNumbers", numbers);
                        promiseArray.pushMap(map);
                    }
                }
            }
            if (cur != null) {
                cur.close();
            }
            Log.d("[FINOVO]", String.valueOf(promiseArray.size()));
            promise.resolve(promiseArray);
        } else {
            promise.reject("event_failure", "Permission not granted");
        }

    }
}
