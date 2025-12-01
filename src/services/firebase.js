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
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  orderBy,
} from "firebase/firestore";

// Tu config REAL de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtqYQ_C61sOeqslGsL77rCbbusnVhGDWA",
  authDomain: "timebox-assistant-ed497.web.app",
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
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  orderBy,
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

// --- Timeboxes ---
export async function createTimebox(uid, data) {
  const ref = collection(db, "users", uid, "timeboxes");
  return await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getTimeboxes(uid) {
  const ref = collection(db, "users", uid, "timeboxes");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateTimebox(uid, id, data) {
  const ref = doc(db, "users", uid, "timeboxes", id);
  await updateDoc(ref, data);
}

export async function deleteTimebox(uid, id) {
  const ref = doc(db, "users", uid, "timeboxes", id);
  await deleteDoc(ref);
}

// --- Tasks ---
export async function createTask(uid, data) {
  const ref = collection(db, "users", uid, "tasks");
  return await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// --- Daily Stats ---
export async function updateDailyStats(uid, sessionDuration) {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local timezone safe
  const ref = doc(db, "users", uid, "daily_stats", today);

  await setDoc(
    ref,
    {
      totalTime: increment(sessionDuration),
      sessionsCount: increment(1),
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );
}
