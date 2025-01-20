import admin from "../services/firebase/firebase-admin.js";

export const authenticateToken = async (req, res, next) => {
  // check if authorization exists and starts with 'Bearer'
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(401).send("Unauthorized: Token not provided");
  }
  const idToken = req.headers.authorization.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};
