import { useEffect, useState } from "react";
import TeamsForm from "../components/teamForm/TeamForm";
import API_URL from "../utils/ConfigAPI";
import CustomButton from "../components/customButton/CustomButton";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/teams`);
      const data = await response.json();
      console.log(data.teams);
      if (data.success) {
        setTeams(data.teams);
      } else {
        console.error("Erreur de récupération des équipes :", data.error);
      }
    } catch (err) {
      console.error("Impossible de récupérer les équipes :", err);
    }
  };

  const handleSubmit = async (teamData) => {
    const url = selectedTeam ? `${API_URL}/teams/${selectedTeam.id}` : `${API_URL}/teams`;
    const method = selectedTeam ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchTeams();
        setSelectedTeam(null);
      } else {
        console.error("Erreur lors de l'enregistrement :", data.error);
      }
    } catch (err) {
      console.error("Impossible d'enregistrer l'équipe :", err);
    }
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/teams/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) {
        fetchTeams();
      } else {
        console.error("Erreur lors de la suppression :", data.error);
      }
    } catch (err) {
      console.error("Impossible de supprimer l'équipe :", err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des Équipes</h1>
      <TeamsForm onSubmit={handleSubmit} defaultValues={selectedTeam} />
      <ul className="mt-6">
        {teams.map((team) => (
          <li key={team.id} className="flex justify-between p-4 border-b">
            <span>{team.name} - Niveau: {team.level} - Note: {team.rating}</span>
            <div>
              <CustomButton onClick={() => handleEdit(team)} className="bg-yellow-500 mr-2">Modifier</CustomButton>
              <CustomButton onClick={() => handleDelete(team.id)} className="bg-red-500">Supprimer</CustomButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
