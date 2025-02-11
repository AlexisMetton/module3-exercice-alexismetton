import { useForm } from "react-hook-form";
import CustomInput from "../customInput/CustomInput";
import CustomButton from "../customButton/CustomButton";
import { useEffect } from "react";
import API_URL from "../../utils/ConfigAPI";

const TournamentForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  const handleFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
      entry_fee: parseInt(data.entry_fee, 10),
    };

    onSubmit(formattedData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <CustomInput
        type="text"
        name="name"
        label="Nom du tournoi"
        errorMessage={errors.name?.message}
        {...register("name", { required: "Le nom est obligatoire" })}
      />
      <CustomInput
        type="date"
        name="start_date"
        label="Date de début"
        defaultValue={formatDateForInput(defaultValues?.start_date)}
        {...register("start_date", { required: "Date obligatoire" })}
      />
      <CustomInput
        type="date"
        name="end_date"
        label="Date de fin"
        defaultValue={formatDateForInput(defaultValues?.end_date)}
        {...register("end_date", { required: "Date obligatoire" })}
      />
      <CustomInput
        type="number"
        name="entry_fee"
        label="Droit de participation (pièces d'or)"
        {...register("entry_fee", { required: "Montant obligatoire" })}
      />
      <CustomInput
        type="text"
        name="description"
        label="Description"
        {...register("description")}
      />

      <CustomButton
        type="submit"
        className="w-full bg-green-600 hover:bg-green-500"
      >
        {defaultValues ? "Modifier le tournoi" : "Créer le tournoi"}
      </CustomButton>
    </form>
  );
};

export default TournamentForm;
