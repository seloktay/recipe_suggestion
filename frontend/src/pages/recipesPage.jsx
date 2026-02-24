import { useEffect, useState } from "react";
import { getRecipes } from "../api/recipesApi";
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

  // Fetch categories & ingredients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get("http://localhost:5000/categories");
        const ingredientsRes = await axios.get("http://localhost:5000/ingredients");

        setCategories(categoriesRes.data);
        setIngredients(ingredientsRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await axios.post("http://localhost:5000/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      handleClose(); // close modal after success
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