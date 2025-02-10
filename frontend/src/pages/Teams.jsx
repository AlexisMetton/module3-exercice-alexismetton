import { useEffect, useState } from "react";
import API_URL from "../utils/ConfigAPI";
import TeamsForm from "../components/teamForm/TeamForm";
import TeamItem from "../components/teamItem/TeamItem";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/teams`);
      const data = await response.json();
      console.log("Données récupérées :", data);
      if (response.ok) {
        setTeams(data.teams);
      } else {
        setError(data.error || "Erreur lors de la récupération des équipes.");
      }
    } catch (err) {
      setError("Impossible de récupérer les équipes.");
    }
  };

  const handleAddTeam = async (teamData) => {
    try {
      const response = await fetch(`${API_URL}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        fetchTeams();
        setFormKey((prevKey) => prevKey + 1);
      } else {
        setError("Erreur lors de l'ajout de l'équipe.");
      }
    } catch (err) {
      setError("Impossible d'ajouter l'équipe.");
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      const response = await fetch(`${API_URL}/teams/${id}`, { method: "DELETE" });

      if (response.ok) {
        fetchTeams();
        setFormKey((prevKey) => prevKey + 1);
      } else {
        setError("Erreur lors de la suppression de l'équipe.");
      }
    } catch (err) {
      setError("Impossible de supprimer l'équipe.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-6 py-6">
      {/* Liste des équipes */}
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4">Mes Équipes</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {teams && teams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamItem key={team.id} team={team} onDelete={handleDeleteTeam} onEdit={() => navigate(`/edit/teams/${team.id}`)} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">
            Aucune équipe n'a encore été créée.
          </p>
        )}
      </div>

      {/* Formulaire d'ajout d'équipe */}
      <div className="lg:w-1/3 p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
        <h3 className="text-xl font-bold mb-4">Créer une équipe</h3>
        <TeamsForm key={formKey} onSubmit={handleAddTeam} />
      </div>
    </div>
  );
};

export default Teams;
