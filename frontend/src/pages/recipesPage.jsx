import { useEffect, useState } from "react";
import { getRecipes } from "../api/recipesApi";
import RecipeForm from "../components/RecipeForm";
import RecipeList from "../components/RecipeList";

function recipesPage() {
  const [recipes, setRecipes] = useState([]);

  const loadRecipes = async () => {
    const res = await getRecipes();
    setRecipes(res.data);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <div>
      <h1>Recipes</h1>
      <RecipeForm onCreated={loadRecipes} />
      <RecipeList
        recipes={recipes}
        onDeleted={loadRecipes}
      />
    </div>
  );
}

export default recipesPage;