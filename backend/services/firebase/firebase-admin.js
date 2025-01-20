import admin from "firebase-admin";
import { firebaseCredentials } from "../../firebaseService.js";

//allows your server to verify ID tokens and manage authentication-related tasks
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });
}

export default admin;
