import admin from "firebase-admin";
import firebaseAccocunt from "../../firebaseService.json" assert { type:"json"};

//allows your server to verify ID tokens and manage authentication-related tasks
if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAccocunt),
    });
  }
  
  export default admin;
  
