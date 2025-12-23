importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDfGsUhSN1N5bxtTEnJHzL83ixHAcn4KSg",
  authDomain:"coinp2p-a3cbf.firebaseapp.com",
  projectId: "coinp2p-a3cbf",
  messagingSenderId: "357380116630",
  appId: "1:357380116630:web:9b80fb8e4b35839e0432b7",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
