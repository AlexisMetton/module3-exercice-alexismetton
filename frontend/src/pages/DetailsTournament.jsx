import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../utils/ConfigAPI";
import AddTeamForm from "../components/addTeamForm/AddTeamForm";
import AddDungeonTimeForm from "../components/addDungeonTimeForm/AddDungeonTimeForm";
import CustomButton from "../components/customButton/CustomButton";

const DetailsTournament = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [cashPrize, setCashPrize] = useState(0);
  const [dungeonTimes, setDungeonTimes] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTournamentDetails();
  }, []);

  const fetchTournamentDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/tournaments/details/${id}`);
      const data = await response.json();
      if (response.ok) {
        setTournament(data.tournament);
        setTeams(data.teams);
        setRanking(data.ranking);
        console.log(data.ranking);
        setCashPrize(data.cashPrize);
        formatDungeonTimes();
      } else {
        setError("Erreur lors de la récupération du tournoi.");
      }
    } catch (err) {
      setError("Impossible de récupérer les détails du tournoi.");
    }
  };

  const handleRemoveTeam = async (teamId) => {
    try {
      const response = await fetch(
        `${API_URL}/tournaments/${id}/teams/${teamId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchTournamentDetails();
      } else {
        console.error("Erreur lors de la suppression de l'équipe.");
      }
    } catch (err) {
      console.error("Impossible de supprimer l'équipe.");
    }
  };

  const formatDungeonTimes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/tournaments/${id}/dungeon-times`
      );
      const data = await response.json();
      if (response.ok) {
        const formattedTimes = {};
        data.dungeonTimes.forEach(
          ({ dungeon_name, team_name, completion_time, valid }) => {
            if (!formattedTimes[dungeon_name])
              formattedTimes[dungeon_name] = [];
            formattedTimes[dungeon_name].push({
              team_name,
              completion_time,
              valid,
            });
          }
        );

        Object.keys(formattedTimes).forEach((dungeon) => {
          formattedTimes[dungeon].sort(
            (a, b) => a.completion_time - b.completion_time
          );
        });

        setDungeonTimes(formattedTimes);

        //console.log(formattedTimes)
      }
    } catch (err) {
      console.error("Erreur lors du chargement des temps de donjon.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        {tournament?.name}
      </h1>
      <p className="text-lg text-center">
        📅 {tournament?.start_date} - {tournament?.end_date}
      </p>
      <p className="text-lg text-center text-yellow-600 font-bold">
        💰 Cash Prize : {cashPrize} pièces d'or
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">🏆 Classement des Équipes</h3>
          <ul className="space-y-2">
            {ranking.length > 0 ? (
              ranking.map((team, index) => (
                <li
                  key={index}
                  className="bg-white p-3 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold">
                      {index + 1}. {team.team_name}
                    </span>
                    <p className="text-sm text-gray-600">
                      🏰 {team.dungeon_name} | ⏱ {team.best_time} min
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      team.time_advance >= 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {team.time_advance >= 0
                      ? `+${team.time_advance} min`
                      : `${team.time_advance} min`}
                  </span>
                </li>
              ))
            ) : (
              <p>Aucun classement disponible.</p>
            )}
          </ul>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">📌 Équipes inscrites</h3>
          <ul>
            {teams.map((team) => (
              <li
                key={team.id}
                className="bg-white p-3 rounded-lg shadow-md mb-2 flex justify-between items-center"
              >
                <span>{team.name}</span>
                <CustomButton
                  onClick={() => handleRemoveTeam(team.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg cusor-pointer"
                >
                  🗑
                </CustomButton>
              </li>
            ))}
          </ul>
          <AddTeamForm tournamentId={id} onTeamAdded={fetchTournamentDetails} />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">📜 Historique des Temps</h3>
        {Object.keys(dungeonTimes).length > 0 ? (
          Object.keys(dungeonTimes).map((dungeon, index) => (
            <div key={index} className="mb-6">
              <h4 className="text-lg font-semibold">{dungeon}</h4>
              <ul className="space-y-2">
                {dungeonTimes[dungeon].map(
                  ({ team_name, completion_time, valid }, idx) => (
                    <li
                      key={idx}
                      className={`p-3 rounded-lg shadow-md ${
                        valid ? "bg-green-200" : "bg-red-200"
                      }`}
                    >
                      {team_name} - ⏱️ {completion_time} min{" "}
                      {valid ? "✅" : "❌"}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>Aucun temps enregistré.</p>
        )}
      </div>

      <div className="mt-6">
        <AddDungeonTimeForm
          tournamentId={id}
          onTimeAdded={fetchTournamentDetails}
        />
      </div>
    </div>
  );
};

export default DetailsTournament;
