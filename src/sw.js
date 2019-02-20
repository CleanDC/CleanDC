import messaging from '../utils/Fcm'

messaging.setBackgroundMessageHandler(function (payload) {
  self.registration.hideNotification()
})
async function fcm () {
  const token = await messaging.getToken()
  console.log(token)
}

fcm()
