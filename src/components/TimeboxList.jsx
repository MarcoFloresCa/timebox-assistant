import { useState, useEffect } from "react";
import { getTimeboxes, deleteTimebox } from "../services/firebase";

export default function TimeboxList({ uid, refreshTrigger }) {
  const [timeboxes, setTimeboxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeboxes() {
      setLoading(true);
      try {
        const data = await getTimeboxes(uid);
        setTimeboxes(data);
      } catch (error) {
        console.error("Error fetching timeboxes:", error);
      } finally {
        setLoading(false);
      }
    }

    if (uid) {
      fetchTimeboxes();
    }
  }, [uid, refreshTrigger]);

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este timebox?")) return;
    try {
      await deleteTimebox(uid, id);
      setTimeboxes((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting timebox:", error);
      alert("Error al eliminar");
    }
  };

  if (loading) return <div className="text-center text-gray-400">Cargando timeboxes...</div>;

  if (timeboxes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No tienes timeboxes creados. ¡Crea uno para empezar!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {timeboxes.map((timebox) => (
        <div
          key={timebox.id}
          className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm hover:border-slate-600 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-white">{timebox.title}</h3>
            <button
              onClick={() => handleDelete(timebox.id)}
              className="text-slate-400 hover:text-red-400 transition-colors"
              title="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-slate-400 text-sm mb-3">
            ⏱️ {timebox.duration} minutos
          </p>
          {timebox.description && (
            <p className="text-slate-500 text-sm mb-3 line-clamp-2">
              {timebox.description}
            </p>
          )}
          <div className="text-xs text-slate-600">
            Creado: {timebox.createdAt?.toDate
              ? timebox.createdAt.toDate().toLocaleDateString()
              : "—"
            }
          </div>
        </div>
      ))}
    </div>
  );
}
