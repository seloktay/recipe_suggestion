import { useEffect, useState } from "react";
import MultiSelect from "../components/MultiSelect";
import { getIngredients } from "../api/ingredientsApi";
import { searchRecipes } from "../api/recipesApi"
import { Autocomplete, TextField } from "@mui/material";

function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const handleSearch = async () => {
      const ingredient_id_list = selectedIngredients.map(ing => ing.id)
      const data = {
          "ingredients": ingredient_id_list,
          "search_mode": "strict"
          }
    const res = await searchRecipes(data);
    setMatchedRecipes(res.data);
  };

  const [ingredients, setIngredients] = useState([]);
  useEffect(() => {
         const loadIngredients = async () => {
             const res = await getIngredients();
             setIngredients(res.data);
         };
         loadIngredients()
      }, [])

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Select Ingredients</h1>

    <Autocomplete
      multiple
      limitTags={1}
      value={selectedIngredients}
      onChange={(event, newValue) => {
        setSelectedIngredients(newValue);
      }}
      id="ingredient-filter"
      options={ingredients}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField {...params} label="Ingredient" placeholder="ingredients" />
      )}
    />

      <button
        onClick={handleSearch}
        style={{ marginTop: "1rem" }}
      >
        Search Recipes
      </button>
    </div>
  );
}

export default HomePage;