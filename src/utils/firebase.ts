import admin from "firebase-admin";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local (see .env.example).`
    );
  }
  return value;
}

function getPrivateKey(): string {
  const privateKey = getRequiredEnv("FIREBASE_PRIVATE_KEY")
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "")
    .trim();

  if (!privateKey.includes("BEGIN PRIVATE KEY") || !privateKey.includes("END PRIVATE KEY")) {
    throw new Error(
      'FIREBASE_PRIVATE_KEY must be a full PEM in one quoted value, for example FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
    );
  }

  return privateKey;
}

function initFirebase() {
  if (admin.apps.length) {
    return admin.app();
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: getRequiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: getPrivateKey(),
    }),
  });
}

export function getDb() {
  initFirebase();
  return admin.firestore();
}

export default admin;
