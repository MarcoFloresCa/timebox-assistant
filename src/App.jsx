import { useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  saveUser,
} from "./services/firebase";
import TimeboxList from "./components/TimeboxList";
import CreateTimebox from "./components/CreateTimebox";

export default function App() {
  const [user, setUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span>⏱️</span> Timebox Assistant
          </h1>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto p-4 md:p-6">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-2">Bienvenido</h2>
              <p className="text-slate-400 mb-6">
                Organiza tu tiempo eficazmente con Timeboxing.
              </p>
              <button
                onClick={loginGoogle}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02]"
              >
                Iniciar sesión con Google
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Actions Bar */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mis Timeboxes</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
              >
                <span>+</span> Crear Timebox
              </button>
            </div>

            {/* List */}
            <TimeboxList uid={user.uid} refreshTrigger={refreshTrigger} />
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && user && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <CreateTimebox
            uid={user.uid}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateModal(false)}
          />
        </div>
      )}
    </div>
  );
}
