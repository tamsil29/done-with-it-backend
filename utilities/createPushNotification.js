const { sendNotification } = require("./pushNotifications");

async function sendPushNotificationOfChat(token, from, message, data){
    sendNotification(token, {
        title: `New message from ${from}`,
        body: message,
        data: { type: 'chat', ...data } ,
      });
}

module.exports = {sendPushNotificationOfChat}