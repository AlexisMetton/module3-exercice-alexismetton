import { useState, useEffect } from "react";
import API_URL from "../../utils/ConfigAPI";
import { useNavigate } from "react-router-dom";

const CharacterItem = ({ character, onDelete }) => {
    const [classLabel, setClassLabel] = useState("Chargement...");
  const [roleLabel, setRoleLabel] = useState("Chargement...");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassName = async () => {
        //console.log(character.class_id)
      if (!character.class_id) {
        setClassLabel("Aucune classe");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/classes/${character.class_id}`);

        const data = await response.json();
        setClassLabel(data.class?.label || "Classe inconnue");
      } catch (err) {
        console.error("Erreur lors de la récupération de la classe :", err);
        setClassLabel("Erreur");
      }
    };

    const fetchRoleName = async () => {
      if (!character.role_id) {
        setRoleLabel("Aucun rôle");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/roles/${character.role_id}`);
        const data = await response.json();

        if (response.ok) {
            setRoleLabel(data.role?.label || "Rôle inconnu");
          } else {
            setRoleLabel("Rôle inconnu");
          }
      } catch (err) {
        console.error("Erreur lors de la récupération du rôle :", err);
        setRoleLabel("Erreur");
      }
    };

    fetchClassName();
    fetchRoleName();
  }, [character.class_id, character.role_id]);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {character.name}
      </h3>
      <p className="text-gray-500 dark:text-gray-300">Classe : {classLabel}</p>
      <p className="text-gray-500 dark:text-gray-300">Rôle : {roleLabel}</p>
      <p className="text-gray-500 dark:text-gray-300">iLvl : {character.ilvl}</p>
      <p className="text-gray-500 dark:text-gray-300">RIO : {character.rio}</p>

      <div className="flex mt-3 gap-2 flex-wrap">
      <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded"
          onClick={() => navigate(`/characters/edit/${character.id}`)}
        >
          Modifier
        </button>
        <button
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded"
          onClick={() => onDelete(character.id)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default CharacterItem;
