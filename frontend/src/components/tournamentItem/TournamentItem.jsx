import React from "react";
import CustomButton from "../customButton/CustomButton";
import { useNavigate } from "react-router-dom";

const TournamentItem = ({ tournament, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const isTournamentIsOver = new Date(tournament.end_date) < new Date();

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col">
      <h3 className="text-lg font-semibold">{tournament.name}</h3>
      <p className="text-sm text-gray-600">
        📅 Du <strong>{tournament.start_date}</strong> au <strong>{tournament.end_date}</strong>
      </p>
      <p className="text-sm text-gray-600">💰 Participation : <strong>{tournament.entry_fee} pièces d'or</strong></p>

      <div className="flex justify-between mt-4">
        <CustomButton 
          onClick={onEdit} 
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          disabled={isTournamentIsOver}
          >
          Modifier
        </CustomButton>
        
        <CustomButton 
          onClick={() => onDelete(tournament.id)} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer">
          Supprimer
        </CustomButton>

        <CustomButton 
          onClick={() => navigate(`/details/tournament/${tournament.id}`)} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer">
          Voir
        </CustomButton>
      </div>
    </div>
  );
};

export default TournamentItem;
