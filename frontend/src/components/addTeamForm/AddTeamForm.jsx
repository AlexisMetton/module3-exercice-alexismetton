import { useState, useEffect } from "react";
import API_URL from "../../utils/ConfigAPI";
import CustomButton from "../customButton/CustomButton";

const AddTeamForm = ({ tournamentId, onTeamAdded }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/teams`);
      const data = await response.json();
      if (response.ok) {
        setTeams(data.teams);
      } else {
        setError("Erreur de récupération des équipes.");
      }
    } catch (err) {
      setError("Impossible de récupérer les équipes.");
    }
  };

  const handleAddTeam = async () => {
    if (!selectedTeam) {
      setError("Veuillez sélectionner une équipe.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tournaments/${tournamentId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parties_id: selectedTeam }),
      });

      if (response.ok) {
        setSuccess("Équipe ajoutée avec succès !");
        setError(null);
        onTeamAdded();
      } else {
        setError("Erreur lors de l'ajout de l'équipe.");
      }
    } catch (err) {
      setError("Impossible d'ajouter l'équipe.");
    }
  };

  return (
<div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold text-center mb-4">🏆 Ajouter une équipe</h3>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded-md mb-2">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-2 rounded-md mb-2">{success}</p>}

      <div className="flex flex-col space-y-3">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">🔍 Sélectionnez une équipe</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>

        <CustomButton onClick={handleAddTeam} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md">
          ➕ Ajouter l'équipe
        </CustomButton>
      </div>
    </div>
  );
};

export default AddTeamForm;
