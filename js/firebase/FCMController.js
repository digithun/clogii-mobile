import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import { Platform } from 'react-native';

const FCMEVENT = {
  ONTOKEN: 0x1,
  ONNOTI: 0x2,
  ONTRAY: 0x3,
};


const serverKey = 'AIzaSyC_lLQIWmCJxb4n1P8oXf2-YoN6DM5hZHc';

class FCMController {

  static badge = 0;
  static _instance;
  static CALLBACK_MAPS = {};
  static instance() {
    if (!FCMController.__instance) FCMController.__instance = new FCMController();
    return FCMController.__instance;
  }

  constructor() {
    //this.componentDidMount();
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      FCM.requestPermissions(); // for iOS
      FCM.getBadgeNumber().then((number) => {
        FCMController.badge = number;
      });
    }

    FCM.getFCMToken().then((token) => {
      console.log('FCM.getToken', token);
      FCMController.instance().callListener(FCMEVENT.ONTOKEN, token);
    });

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      console.log('notif = ', notif);

      // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
      if (!notif.local_notification && notif.fcm) {
        // this is a local notification
        console.log('ONNOTI');
        FCMController.instance().callListener(FCMEVENT.ONNOTI, notif);
        FCMController.instance().showNotification(notif, false);

        //FCMController.badge += 1;
        //setBadger(FCMController.badge);
      }
      if (notif.opened_from_tray) {
        console.log('ONTRAY');
        FCMController.instance().callListener(FCMEVENT.ONTRAY, notif);
        // app is open/resumed because user clicked banner
        //if (FCMController.badge > 0) FCMController.badge -= 1;
        //setBadger(FCMController.badge);
      }

      if (Platform.OS === 'ios') {
        // optional
        // iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        // This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        // notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData); // other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All); // other types available: WillPresentNotificationResult.None
            break;
        }
      }
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      // console.log(token);
      // fcm token may not be available on first load, catch it here
      FCMController.instance().callListener(FCMEVENT.ONTOKEN, token);
    });

    return this;
  }

  addListener(event, callback) {
    if (!FCMController.CALLBACK_MAPS.hasOwnProperty(event)) FCMController.CALLBACK_MAPS[event] = [];

    FCMController.CALLBACK_MAPS[event].push(callback);

    return this;
  }

  removeListener(event, callback) {
    if (!FCMController.CALLBACK_MAPS.hasOwnProperty(event)) { FCMController.CALLBACK_MAPS[event] = []; return this; }

    const idx = FCMController.CALLBACK_MAPS[event].indexOf(callback);
    if (idx > -1) FCMController.CALLBACK_MAPS[event].splice(idx, 1);

    return this;
  }

  callListener(event, val) {
    if (FCMController.CALLBACK_MAPS.hasOwnProperty(event)) {
      FCMController.CALLBACK_MAPS[event].forEach((callbacks) => {
        callbacks(val);
      });
    }

    return this;
  }

  showNotification(rawNoti, showInForeground) {
    /*
     const fcm =
      {"body":"We are sorry to see you go","title":"Subscription"};
    */
    // console.log('noti=', rawNoti);
    if (!rawNoti.fcm) return this;

    let _title = rawNoti.title || rawNoti.fcm.title || '';
    let _body = rawNoti.body || rawNoti.fcm.body || '';

    const defaultNoti = {
      title: _title,                             // as FCM payload
      body: _body,                               // as FCM payload (required)
      sound: 'default',                                           // as FCM payload
      priority: rawNoti.priority || 'min',                                           // as FCM payload
      click_action: rawNoti.fcm.action || 'default',              // as FCM payload
      icon: rawNoti.fcm.icon || 'ic_launcher',                    // as FCM payload, you can relace this with custom icon you put in mipmap
      // my_custom_data: 'my_custom_field_value',                 // extra data you want to throw
      show_in_foreground: true,                       // notification when app is in foreground (local & remote)
    };

    if (showInForeground) {
      delete defaultNoti.title;
    }

    const notiAndroid = {
      // number: 10,                                         // Android only
      ticker: _title,                    // Android only
      auto_cancel: true,                                  // Android only (default true)
      large_icon: 'ic_launcher',                          // Android only
      // big_text: 'Show when notification is expanded',     // Android only
      // sub_text: 'This is a subText',                      // Android only
      //   color: 'red',                                       // Android only
      vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
      //   tag: 'some_tag',                                    // Android only
      group: 'digithun',                                     // Android only
      lights: true,                                       // Android only, LED blinking (default false)
    };

    let mergedNoti;

    if (Platform.OS === 'android') {
      mergedNoti = Object.assign(defaultNoti, notiAndroid);
    } else {
      mergedNoti = defaultNoti;
    }

    FCM.presentLocalNotification(mergedNoti);

    return this;
  }

  setBadger(badge) {
    if (Platform.OS === 'ios') FCM.setBadgeNumber(badge);

    return this;
  }

  /*
  * Will remove all notification in the tray
  */
  clearNoti() {
    FCM.removeAllDeliveredNotifications();
    return this;
  }

  /*
  * Will not be active when in background
  */
  componentWillUnmount() {
    // stop listening for events
    this.notificationListener.remove();
    this.refreshTokenListener.remove();

    return this;
  }

  sub(topicString) {
    FCM.subscribeToTopic('/topics/' + topicString);
    return this;
  }
  unSub(topicString) {
    FCM.unsubscribeFromTopic('/topics/' + topicString);
    return this;
  }

  pub(topicString, message, action, dataObject) {

    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key='+serverKey
      },
      body: JSON.stringify({
        to: "/topics/" + topicString,
        notification: {
          title: "Clogii",
          body: message,
          click_action: "fcm.ACTION." + action
        },
        data: {
          message
        }
      })
    }).then((callback) => {
      console.log('fcm send', callback);
    });
  }

}

export { FCMController, FCMEVENT };
