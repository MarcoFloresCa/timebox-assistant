import { useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  saveUser,
} from "./services/firebase";

export default function App() {
  const [user, setUser] = useState(null);

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      await saveUser(result.user);
    } catch (e) {
      console.error(e);
      alert("Error al iniciar sesión");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="p-6 rounded-xl bg-slate-900 shadow-xl space-y-4 w-full max-w-sm border border-slate-700">
        <h1 className="text-xl font-bold text-center">Timebox Assistant ⏱️</h1>

        {!user ? (
          <button
            onClick={loginGoogle}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium"
          >
            Iniciar sesión con Google
          </button>
        ) : (
          <>
            <p className="text-sm">
              Bienvenido:  
              <br />
              <span className="font-semibold">{user.email}</span>
            </p>

            <button
              onClick={logout}
              className="w-full py-2 bg-red-500 hover:bg-red-400 rounded-lg font-medium"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
