import { useEffect, useState } from "react";
import { getIngredients } from "../api/ingredientsApi";
import IngredientForm from "../components/IngredientForm";
import IngredientList from "../components/IngredientList";

function ingredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const loadIngredients = async () => {
    const res = await getIngredients();
    setIngredients(res.data);
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  return (
    <div>
      <h1>Ingredients</h1>
      <IngredientForm onCreated={loadIngredients} />
      <IngredientList
        ingredients={ingredients}
        onDeleted={loadIngredients}
      />
    </div>
  );
}

export default ingredientsPage;