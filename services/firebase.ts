
import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdQ8pdqrMK6SOTRZO5U5lyqMbOOXwsgt8",
  authDomain: "datahubafrica-3b9e2.firebaseapp.com",
  projectId: "datahubafrica-3b9e2",
  storageBucket: "datahubafrica-3b9e2.firebasestorage.app",
  messagingSenderId: "468664998940",
  appId: "1:468664998940:web:17b546b96154ce85c753d9",
  measurementId: "G-L5WKTWFKTX"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});
export const db = getFirestore(app);
