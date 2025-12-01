// src/services/firebase.js

// Core
import { initializeApp } from "firebase/app";

// Auth
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Firestore
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// Tu config REAL de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtqYQ_C61sOeqslGsL77rCbbusnVhGDWA",
  authDomain: "timebox-assistant-ed497.firebaseapp.com",
  projectId: "timebox-assistant-ed497",
  storageBucket: "timebox-assistant-ed497.firebasestorage.app",
  messagingSenderId: "1012032243840",
  appId: "1:1012032243840:web:fb6e0386300dd2f7633e65",
  measurementId: "G-67DVBFD1JV"
};


// Inicializar app
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Exportar herramientas listas para usar
export {
  app,
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
};

export async function saveUser(user) {
  const ref = doc(db, "users", user.uid);
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    // Si ya existe, solo actualizamos lastLogin y datos básicos por si cambiaron
    await setDoc(ref, {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    }, { merge: true });
  } else {
    // Si es nuevo, creamos todo
    await setDoc(ref, {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }
}
