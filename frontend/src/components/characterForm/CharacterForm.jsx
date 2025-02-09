import { useForm } from "react-hook-form";
import CustomSelect from "../customSelect/CustomSelect";
import CustomInput from "../customInput/CustomInput";
import CustomButton from "../customButton/CustomButton";
import { useState, useEffect } from "react";
import API_URL from "../../utils/ConfigAPI";

const CharacterForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const [classes, setClasses] = useState([]);
  const [roles, setRoles] = useState([]);
  const selectedClass = watch("class_ID");

  useEffect(() => {
    reset(defaultValues);
    //console.log(defaultValues);
  }, [defaultValues, reset]);

  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_URL}/classes`);
        const data = await response.json();
        if (response.ok) {
          setClasses(data.classes);
        } else {
          console.error("Erreur de récupération des classes :", data.error);
        }
      } catch (err) {
        console.error("Impossible de récupérer les classes :", err);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setRoles([]);
      return;
    }

    const fetchRolesForClass = async () => {
      try {
        const response = await fetch(
          `${API_URL}/roles?class_ID=${selectedClass}`
        );
        const data = await response.json();
        if (response.ok) {
          setRoles(data.roles);

        } else {
          console.error("Erreur de récupération des rôles :", data.error);
        }
      } catch (err) {
        console.error("Impossible de récupérer les rôles :", err);
      }
    };

    fetchRolesForClass();
  }, [selectedClass]);

  useEffect(() => {
    if (classes.length > 0 && defaultValues?.class_id) {
      setValue("class_ID", defaultValues.class_id);
    }
  }, [classes, defaultValues?.class_id, setValue]);

  useEffect(() => {
    if (roles.length > 0 && defaultValues?.role_id) {
      setValue("role_ID", defaultValues.role_id);
    }
  }, [roles, defaultValues?.role_id, setValue]);
  
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <CustomInput
        type="text"
        name="name"
        label="Nom du personnage"
        errorMessage={errors.name?.message}
        {...register("name", {
          required: "Le nom est obligatoire",
          minLength: { value: 3, message: "Minimum 3 caractères" },
        })}
      />

      <CustomSelect
        name="class_ID"
        label="Classe"
        errorMessage={errors.class_ID?.message}
        options={[
          { value: "", label: "-- Sélectionnez une classe --" },
          ...classes.map((cls) => ({
            value: cls.id,
            label: cls.label,
          })),
        ]}
        {...register("class_ID", { required: "Sélectionnez une classe" })}
      />

      <CustomSelect
        name="role_ID"
        label="Rôle"
        errorMessage={errors.role_ID?.message}
        options={[
            { value: "", label: "-- Sélectionnez un rôle --" },
            ...roles.map((role) => ({
              value: role.id.toString(),
              label: role.label,
            })),
          ]}
        {...register("role_ID", { required: "Sélectionnez un rôle" })}
      />

      <CustomInput
        type="number"
        name="ilvl"
        label="Item Level"
        errorMessage={errors.ilvl?.message}
        {...register("ilvl", {
          required: "L'iLvl est obligatoire",
          min: { value: 0, message: "Minimum 0" },
          max: { value: 645, message: "Maximum 645" },
        })}
      />

      <CustomInput
        type="number"
        name="rio"
        label="RIO"
        errorMessage={errors.rio?.message}
        {...register("rio", {
          required: "Le RIO est obligatoire",
          min: { value: 0, message: "Minimum 0" },
          max: { value: 4500, message: "Maximum 4500" },
        })}
      />

<CustomButton type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
        {defaultValues ? "Modifier le personnage" : "Ajouter le personnage"}
      </CustomButton>
    </form>
  );
};

export default CharacterForm;
