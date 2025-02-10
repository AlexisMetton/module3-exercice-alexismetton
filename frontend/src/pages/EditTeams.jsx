import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/ConfigAPI";
import TeamsForm from "../components/teamForm/TeamForm";

const EditTeams = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`${API_URL}/teams/${id}`);
      const data = await response.json();

      if (response.ok) {
        setTeam(data.team);
        console.log(data.team);
      } else {
        setError(data.error || "Erreur lors de la récupération de l'équipe.");
      }
    } catch (err) {
      setError("Impossible de récupérer l'équipe.");
    }
  };

  const handleUpdateTeam = async (updatedTeam) => {
    try {
      const response = await fetch(`${API_URL}/teams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTeam),
      });

      if (response.ok) {
        navigate("/teams");
      } else {
        setError("Erreur lors de la mise à jour de l'équipe.");
      }
    } catch (err) {
      setError("Impossible de mettre à jour l'équipe.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Modifier l'équipe</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {team ? (
        <TeamsForm onSubmit={handleUpdateTeam} defaultValues={{
            ...team, 
        charactersIds: team.characters.map(character => character.id), // 🔥 Préremplir les personnages sélectionnés
          }}  />
      ) : (
        <p className="text-gray-500 text-center text-lg">Chargement de l'équipe...</p>
      )}
    </div>
  );
};

export default EditTeams;
