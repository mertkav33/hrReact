import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const ProtectedRoute = ({ children }) => {
  const [userChecked, setUserChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("FIREBASE USER:", currentUser);
      setUser(currentUser);
      setUserChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (!userChecked) {
    // Auth henüz kontrol edilmedi
    return <div>Loading...</div>;
  }

  // Kullanıcı yoksa giriş sayfasına yönlendir
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Kullanıcı varsa çocuk bileşeni render et
  return children;
};

export default ProtectedRoute;
