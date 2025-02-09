import { useState, useEffect } from "react";
import API_URL from "../utils/ConfigAPI";
import CharacterForm from "../components/characterForm/CharacterForm";
import CharacterItem from "../components/characterItem/Charactertem";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${API_URL}/characters`);
      const data = await response.json();

      if (response.ok) {
        setCharacters(data.characters);
        //console.log(data.characters);
      } else {
        setError(
          data.error || "Erreur lors de la récupération des personnages."
        );
      }
    } catch (err) {
      setError("Impossible de récupérer les personnages.");
    }
  };

  const handleAddCharacter = async (characterData) => {
    try {
      const response = await fetch(`${API_URL}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(characterData),
      });

      if (response.ok) {
        fetchCharacters();
      } else {
        setError("Erreur lors de l'ajout du personnage.");
      }
    } catch (err) {
      setError("Impossible d'ajouter le personnage.");
    }
  };

  const handleDeleteCharacter = async (id) => {
    try {
      const response = await fetch(`${API_URL}/characters/${id}`, { method: "DELETE" });

      if (response.ok) {
        fetchCharacters();
      } else {
        setError("Erreur lors de la suppression du personnage.");
      }
    } catch (err) {
      setError("Impossible de supprimer le personnage.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-6 py-6">
      {/* Liste des personnages */}
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4">Mes Personnages</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {characters && characters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {characters.map((character) => (
              <CharacterItem key={character.id} character={character} onDelete={handleDeleteCharacter} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">
            Aucun personnage a encore été créé.
          </p>
        )}
      </div>

      {/* Formulaire d'ajout de personnage */}
      <div className="lg:w-1/3 p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
        <h3 className="text-xl font-bold mb-4">Ajouter un personnage</h3>
        <CharacterForm onSubmit={handleAddCharacter} />
      </div>
    </div>
  );
};

export default Characters;
