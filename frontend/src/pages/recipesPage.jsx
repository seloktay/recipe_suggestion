import { useEffect, useState } from "react";
import { getRecipes, addRecipe } from "../api/recipesApi";
import { getCategories } from "../api/categoriesApi";
import { getIngredients } from "../api/ingredientsApi";
import RecipeModal from "../components/RecipeModal";
import RecipeList from "../components/RecipeList";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  Chip
} from "@mui/material";


function recipesPage() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const ingredientsRes = await getIngredients();
        setIngredients(ingredientsRes.data);
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  const handleSubmit = async (formData) => {
    try {
        await addRecipe(formData);
        await loadRecipes();

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

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
      <Button variant="contained" onClick={handleOpen}>
          Add Recipe
      </Button>
      <RecipeModal
          open={open}
          handleClose={handleClose}
          categories={categories}
          ingredients={ingredients}
          handleSubmit={handleSubmit}
      />
      <RecipeList
        recipes={recipes}
        onDeleted={loadRecipes}
      />
    </div>
  );
}

export default recipesPage;