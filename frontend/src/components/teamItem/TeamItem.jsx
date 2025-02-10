import React from "react";
import CustomButton from "../customButton/CustomButton";

const TeamItem = ({ team, onDelete, onEdit }) => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col">
      <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
      <p className="text-sm text-gray-600 mb-2">Personnages :</p>
      <ul className="list-disc pl-4 mb-4">
        {team.characters && team.characters.length > 0 ? (
          team.characters.map((character) => (
            <li key={character.id} className="text-sm text-gray-800">
              {character.name} ({character.class_name}, {character.role_name})
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucun personnage dans l'équipe</p>
        )}
      </ul>
      <div className="flex justify-between mt-auto">
        <CustomButton onClick={onEdit} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
          Modifier
        </CustomButton>
        <CustomButton onClick={() => onDelete(team.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Supprimer
        </CustomButton>
      </div>
    </div>
  );
};

export default TeamItem;
