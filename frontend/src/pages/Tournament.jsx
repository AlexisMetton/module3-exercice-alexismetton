import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../utils/ConfigAPI";
import TournamentForm from "../components/tournamentForm/TournamentForm";
import TournamentItem from "../components/tournamentItem/TournamentItem";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`${API_URL}/tournaments`);
      const data = await response.json();
      if (response.ok) {
        setTournaments(data.tournaments);
      } else {
        setError(data.error || "Erreur lors de la récupération des tournois.");
      }
    } catch (err) {
      setError("Impossible de récupérer les tournois.");
    }
  };

  const handleAddTournament = async (formattedData)  => {
    try {
        const response = await fetch(`${API_URL}/tournaments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
            fetchTournaments();
        } else {
          console.error("Erreur lors de la création du tournoi :", result.error);
        }
      } catch (err) {
        console.error("Impossible de créer le tournoi :", err);
      }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tournaments/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchTournaments();
      } else {
        setError("Erreur lors de la suppression du tournoi.");
      }
    } catch (err) {
      setError("Impossible de supprimer le tournoi.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-6 py-6">
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4">Tournois</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {tournaments.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tournaments.map((tournament) => (
              <li key={tournament.id}>
                <TournamentItem
                  tournament={tournament}
                  onDelete={handleDelete}
                  onEdit={() => navigate(`/edit/tournament/${tournament.id}`)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">Aucun tournoi disponible.</p>
        )}
      </div>

      <div className="lg:w-1/3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Créer un tournoi</h3>
        <TournamentForm onSubmit={(data) => handleAddTournament(data)} />
      </div>
    </div>
  );
};

export default Tournaments;
