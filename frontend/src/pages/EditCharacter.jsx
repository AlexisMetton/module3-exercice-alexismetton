import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../utils/ConfigAPI";
import CharacterForm from "../components/characterForm/CharacterForm";

const EditCharacter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCharacter();
  }, []);

  const fetchCharacter = async () => {
    try {
      const response = await fetch(`${API_URL}/characters/${id}`);
      const data = await response.json();

      if (response.ok) {
        setCharacter(data.character);
      } else {
        setError(data.error || "Erreur lors de la récupération du personnage.");
      }
    } catch (err) {
      setError("Impossible de récupérer le personnage.");
    }
  };

  const handleUpdateCharacter = async (updatedData) => {
    try {
      const response = await fetch(`${API_URL}/characters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        navigate("/characters"); // Redirection après modification
      } else {
        setError("Erreur lors de la mise à jour du personnage.");
      }
    } catch (err) {
      setError("Impossible de modifier le personnage.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Modifier le personnage</h2>
      {error && <p className="text-red-500">{error}</p>}

      {character ? (
        <CharacterForm onSubmit={handleUpdateCharacter} defaultValues={character} />
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default EditCharacter;
