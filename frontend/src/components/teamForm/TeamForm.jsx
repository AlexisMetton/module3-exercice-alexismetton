import { useForm } from "react-hook-form";
import CustomSelect from "../customSelect/CustomSelect";
import CustomInput from "../customInput/CustomInput";
import CustomButton from "../customButton/CustomButton";
import { useState, useEffect } from "react";
import API_URL from "../../utils/ConfigAPI";

const TeamsForm = ({ onSubmit, defaultValues }) => {
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

  const [characters, setCharacters] = useState([]);
  const [classes, setClasses] = useState({});
  const [roles, setRoles] = useState({});
  const [selectedCharacters, setSelectedCharacters] = useState(defaultValues?.charactersIds || []);

  useEffect(() => {
    reset(defaultValues);
    console.log(defaultValues);
    console.log("selected", selectedCharacters);
  }, [defaultValues, reset]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(`${API_URL}/characters/team`);
        const data = await response.json();
        //console.log(data)
        if (response.ok) {
          setCharacters(data.characters);
        } else {
          console.error("Erreur de récupération des personnages :", data.error);
        }
      } catch (err) {
        console.error("Impossible de récupérer les personnages :", err);
      }
    };

    const fetchSelectedCharacters = async () => {
        if (!selectedCharacters || selectedCharacters.length === 0) return;
  
        try {
          const response = await fetch(`${API_URL}/characters/by-ids`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ characterIds: selectedCharacters }),
          });
  
          const data = await response.json();
          if (response.ok) {
            setCharacters((prev) => [...data.characters, ...prev]);
          } else {
            console.error("Erreur récupération des personnages sélectionnés :", data.error);
          }
        } catch (err) {
          console.error("Impossible de récupérer les personnages sélectionnés :", err);
        }
      };

    const fetchClassesAndRoles = async () => {
      try {
        const classResponse = await fetch(`${API_URL}/classes`);
        const roleResponse = await fetch(`${API_URL}/roles/liste`);
        const classData = await classResponse.json();
        const roleData = await roleResponse.json();

        if (classResponse.ok && roleResponse.ok) {
          const classMap = Object.fromEntries(classData.classes.map(cls => [cls.id, cls.label]));
          const roleMap = Object.fromEntries(roleData.roles.map(role => [role.id, role.label]));
          setClasses(classMap);
          setRoles(roleMap);
        } else {
          console.error("Erreur de récupération des classes ou rôles");
        }
      } catch (err) {
        console.error("Impossible de récupérer les classes et rôles :", err);
      }
    };

    fetchCharacters();
    fetchSelectedCharacters();
    fetchClassesAndRoles();
  }, []);

  const validateTeamComposition = () => {
    if (selectedCharacters.length !== 5) {
      return "Une équipe doit contenir exactement 5 personnages.";
    }
    
    const roleCounts = selectedCharacters.reduce((acc, char) => {
      acc[char.role_id] = (acc[char.role_id] || 0) + 1;
      return acc;
    }, {});

    console.log(roleCounts);

    if ((roleCounts[1] || 0) !== 1) return "Une équipe doit avoir exactement un Tank.";
    if ((roleCounts[3] || 0) !== 1) return "Une équipe doit avoir exactement un Soigneur.";
    if ((roleCounts[2] || 0) !== 3) return "Une équipe doit avoir exactement trois Dégâts.";
    
    return null;
  };

  const handleFormSubmit = async (data) => {
    const validationError = validateTeamComposition();
    if (validationError) {
      alert(validationError);
      return;
    }
    await onSubmit({ ...data, charactersIds: selectedCharacters.map((char) => char.id) });
    reset();
    setSelectedCharacters([]);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <CustomInput
        type="text"
        name="name"
        label="Nom de l'équipe"
        errorMessage={errors.name?.message}
        {...register("name", {
          required: "Le nom est obligatoire",
          minLength: { value: 3, message: "Minimum 3 caractères" },
        })}
      />

      <CustomSelect
        name="characters"
        label="Sélectionnez les personnages"
        errorMessage={errors.characters?.message}
        multiple
        options={characters.map((char) => ({
          value: char.id,
          label: `${char.name} (${classes[char.class_id] || "Inconnu"}, ${roles[char.role_id] || "Inconnu"})`,
        }))}
        onChange={(e) => {
          const selectedIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
          setSelectedCharacters(characters.filter((char) => selectedIds.includes(char.id)));
        }}
      />

      <CustomButton type="submit" className="w-full bg-green-600 hover:bg-green-500">
        {defaultValues ? "Modifier l'équipe" : "Ajouter l'équipe"}
      </CustomButton>
    </form>
  );
};

export default TeamsForm;