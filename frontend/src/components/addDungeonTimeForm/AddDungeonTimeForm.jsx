import { useState, useEffect } from "react";
import API_URL from "../../utils/ConfigAPI";
import CustomButton from "../customButton/CustomButton";

const AddDungeonTimeForm = ({ tournamentId, onTimeAdded }) => {
  const [parties, setParties] = useState([]);
  const [dungeons, setDungeons] = useState([]);
  const [partiesId, setPartiesId] = useState("");
  const [dungeonId, setDungeonId] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchParties();
    fetchDungeons();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch(`${API_URL}/tournaments/${tournamentId}/parties`);
      const data = await response.json();
      if (response.ok) {
        setParties(data.parties);
      } else {
        setError("Erreur de récupération des équipes.");
      }
    } catch (err) {
      setError("Impossible de récupérer les équipes.");
    }
  };

  const fetchDungeons = async () => {
    try {
      const response = await fetch(`${API_URL}/dungeons`);
      const data = await response.json();
      if (response.ok) {
        setDungeons(data.dungeons);
      } else {
        setError("Erreur de récupération des donjons.");
      }
    } catch (err) {
      setError("Impossible de récupérer les donjons.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!partiesId || !dungeonId || !completionTime) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tournaments/${tournamentId}/dungeon-times`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parties_id: partiesId, dungeon_id: dungeonId, completion_time: completionTime }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Temps ajouté avec succès !");
        setError(null);
        onTimeAdded();
        setPartiesId("");
        setDungeonId("");
        setCompletionTime("");
      } else {
        setError(data.error || "Erreur lors de l'ajout du temps.");
      }
    } catch (err) {
      setError("Impossible d'ajouter le temps.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">⏳ Ajouter un temps</h3>

      {loading ? (
        <p className="text-center text-gray-500">Chargement des données...</p>
      ) : (
        <>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-3">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-3">{success}</p>}

          {/* Sélection de l'équipe */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">🏆 Sélectionnez une équipe :</label>
            <select
              value={partiesId}
              onChange={(e) => setPartiesId(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Choisir une équipe --</option>
              {parties.map((party) => (
                <option key={party.id} value={party.id}>{party.name}</option>
              ))}
            </select>
          </div>

          {/* Sélection du donjon */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">🛡 Sélectionnez un donjon :</label>
            <select
              value={dungeonId}
              onChange={(e) => setDungeonId(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Choisir un donjon --</option>
              {dungeons.map((dungeon) => (
                <option key={dungeon.id} value={dungeon.id}>{dungeon.name}</option>
              ))}
            </select>
          </div>

          {/* Temps réalisé */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">⏱ Temps réalisé (minutes) :</label>
            <input
              type="number"
              placeholder="Entrez le temps en minutes"
              value={completionTime}
              onChange={(e) => setCompletionTime(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Bouton de validation */}
          <CustomButton 
            onClick={handleSubmit} 
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md"
            disabled={!partiesId || !dungeonId || !completionTime}
          >
            Valider
          </CustomButton>
        </>
      )}
    </div>
  );
};

export default AddDungeonTimeForm;
