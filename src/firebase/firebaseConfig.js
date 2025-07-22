import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore import

const firebaseConfig = {
  apiKey: "AIzaSyDxfm1_kKHE2iEtbWzCm5ZdiLlpLP-UQ94",
  authDomain: "hrapp-d4b7e.firebaseapp.com",
  projectId: "hrapp-d4b7e",
  storageBucket: "hrapp-d4b7e.appspot.com",
  messagingSenderId: "15012753075",
  appId: "1:15012753075:web:b5ed8280f8b1507615cac6",
  measurementId: "G-DSLKFK281F",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Burası eksikti
