import {Alert, Platform} from 'react-native'
import PushNotification from 'react-native-push-notification'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame} from '../redux/GameSlice'
import store from '../redux/store'
import {selectGameSettings} from '../redux/selectors'

const CHANNEL_DAILY_CHALLENGE = 'challenge'

class NotificationPayload {
  /**
   * @param {{
   *  mathAttackType: string,
   *  mathAttackTypeValue: string,
   *  mathAttackTitle: string,
   *  mathAttackBody: string
   * }} obj
   */
  constructor(obj) {
    this.type = obj.mathAttackType
    this.typeValue = obj.mathAttackTypeValue
    this.title = obj.mathAttackTitle
    this.body = obj.mathAttackBody
  }

  /**
   * @returns {{mathAttackTypeValue: string, mathAttackTitle: string, mathAttackType: string, mathAttackBody: string}}
   */
  toUserInfoObject() {
    return {
      mathAttackType: this.type,
      mathAttackTypeValue: this.typeValue,
      mathAttackTitle: this.title,
      mathAttackBody: this.body,
      userInfoObject: true,
    }
  }

  /**
   * @returns {string}
   */
  toScene() {
    return this.type
  }

  /**
   * @returns {DailyChallengeParam}
   */
  toSceneParams() {
    return JSON.parse(this.typeValue)
  }
}

class NotificationHelper {
  constructor() {
    if (NotificationHelper._INSTANCE) {
      throw new Error('Notification Helper is a Singleton')
    }
  }

  configure() {
    PushNotification.configure({
      onNotification: this.onNotification.bind(this),
      popInitialNotification: false,
      requestPermissions: Platform.OS === 'ios',
    })

    if (Platform.OS === 'android') {
      PushNotification.createChannel({
        channelId: CHANNEL_DAILY_CHALLENGE,
        channelName: 'Daily Challenge',
        channelDescription: 'A reminder to train your brain',
      })
    }
  }

  /**
   * @return {Promise<null|NotificationPayload>}
   */
  async handleInitialNotification() {
    return new Promise((resolve, reject) => {
      // see if we opened the app with a notification
      PushNotification.popInitialNotification((notification) => {
        if (notification) {
          // PushNotification.clearAllNotifications()
          let payload = this.__getPayloadFromNotification(notification)
          if (payload) {
            this.__handleNotification(payload, true, notification)
          }
        }

        resolve(null)
      })
    })
  }

  /**
   * @param {*} notification
   * @returns {Promise<void>}
   */
  async onNotification(notification) {
    let payload = this.__getPayloadFromNotification(notification)

    if (!payload) {
      // can't do anything without this...
      return
    }

    this.__handleNotification(payload, notification.userInteraction, notification)

    // https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish('UIBackgroundFetchResultNoData')
  }

  /**
   * @param {string} id
   * @param {string} title
   * @param {string} message
   * @param {Date} date
   * @param {string?} mathAttackType
   * @param {string?} mathAttackTypeValue
   */
  scheduleLocalNotification(id, title, message, date, mathAttackType, mathAttackTypeValue) {
    // mathAttackType and mathAttackTypeValue are used for routing purposes after clicking the notification
    // userInfoObject is set to true in order to notify the PushNotificationsHelper that the notification
    // is a local notification
    const payload = new NotificationPayload({
      mathAttackType: mathAttackType,
      mathAttackTypeValue: mathAttackTypeValue,
      mathAttackTitle: title,
      mathAttackBody: message,
    })

    PushNotification.localNotificationSchedule({
      channelId: CHANNEL_DAILY_CHALLENGE,
      id: id,
      title: title,
      message: message,
      date: date,
      allowWhileIdle: true,
      userInfo: payload.toUserInfoObject(),
    })
  }

  /**
   * @returns {Promise<*>}
   */
  async getScheduled() {
    return new Promise((resolve) => PushNotification.getScheduledLocalNotifications((nots) => resolve(nots)))
  }

  /**
   * @returns {Promise<*>}
   */
  async requestPermissions() {
    try {
      await PushNotification.checkPermissions()
    } catch (err) {
      console.error(err)
      Alert.alert(
        'Permission needed',
        'The Daily Challenge requires notification permissions. Please ensure this permissions is granted in your app settings',
      )
    }
  }

  /**
   * @param {string} id
   */
  cancelScheduledLocalNotification(id) {
    // PushNotification.cancelLocalNotification does not work, so we are forced to use the deprecated cancelLocalNotifications method
    // https://github.com/zo0r/react-native-push-notification/issues/2143
    PushNotification.cancelLocalNotification({id})
  }

  // ----------------------------------------------------------------------------------------------------------------

  /**
   * @param {NotificationPayload} payload
   * @param {boolean} userClicked
   * @param {Notification} notification
   * @private
   */
  __handleNotification(payload, userClicked, notification) {
    // if the user clicked the notification, then we navigate the app
    if (payload && userClicked) {
      store.dispatch(startNewGame(payload.toScene(), selectGameSettings(store.getState())))
      store.dispatch(goToScene(payload.toScene(), payload.toSceneParams()))
    } else {
      // here's where we could show a local notification - if we wanted to interrupt the user,
      // but we don't since we only send them as training reminders. So if the app's already open then you're good
    }
  }

  /**
   * @param {*} notification
   * @return {null|NotificationPayload}
   * @private
   */
  __getPayloadFromNotification(notification) {
    // if it has a userInfo object it's a local notification, we can create the payload directly
    if (notification.userInfo) {
      return new NotificationPayload(notification.userInfo)
    }

    if (notification.data) {
      // if this data is already a formatted userInfoObject, we can create the payload directly
      if (notification.data.userInfoObject) {
        return new NotificationPayload(notification.data)
      }

      // the remote payload to Android
      if (notification.data['pinpoint.jsonBody'] && typeof notification.data['pinpoint.jsonBody'] === 'string') {
        return new NotificationPayload(JSON.parse(notification.data['pinpoint.jsonBody']))
      }

      // the remote payload to iOS
      if (notification.data.data && notification.data.data.jsonBody) {
        return new NotificationPayload(notification.data.data.jsonBody)
      }
    }

    return null
  }

  // ------------------------------------------------------------------------------------------------------
  /**
   * @returns {NotificationHelper}
   * @constructor
   */
  static Instance() {
    if (!NotificationHelper._INSTANCE) {
      NotificationHelper._INSTANCE = new NotificationHelper()
    }

    return NotificationHelper._INSTANCE
  }
}

export default NotificationHelper
