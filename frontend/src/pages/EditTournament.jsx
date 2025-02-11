import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/ConfigAPI";
import TournamentForm from "../components/tournamentForm/TournamentForm";

const EditTournament = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTournament();
  }, [id]);

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  const fetchTournament = async () => {
    try {
      const response = await fetch(`${API_URL}/tournaments/${id}`);
      const data = await response.json();

      if (response.ok) {
        const formattedTournament = {
            ...data.tournament,
            start_date: formatDateForInput(data.tournament.start_date),
            end_date: formatDateForInput(data.tournament.end_date),
          };

        setTournament(formattedTournament);
      } else {
        setError(data.error || "Erreur lors de la récupération du tournoi.");
      }
    } catch (err) {
      setError("Impossible de récupérer le tournoi.");
    }
  };

  const handleUpdateTournament = async (updatedTournament) => {
    console.log(updatedTournament);
    try {
      const response = await fetch(`${API_URL}/tournaments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTournament),
      });

      if (response.ok) {
        navigate("/tournaments"); // Redirection après mise à jour réussie
      } else {
        setError("Erreur lors de la mise à jour du tournoi.");
      }
    } catch (err) {
      setError("Impossible de mettre à jour le tournoi.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Modifier le tournoi</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {tournament ? (
        <TournamentForm onSubmit={(data) => handleUpdateTournament(data)} defaultValues={tournament} />
      ) : (
        <p className="text-gray-500 text-center text-lg">Chargement du tournoi...</p>
      )}
    </div>
  );
};

export default EditTournament;
