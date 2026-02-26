import { useEffect, useState } from "react";
import MultiSelect from "../components/MultiSelect";
import { getIngredients } from "../api/ingredientsApi";
import { Autocomplete, TextField } from "@mui/material";

function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const handleSearch = () => {
    console.log("Selected:", selectedIngredients);
    // Later: call backend here
  };

  const [ingredients, setIngredients] = useState([]);
  useEffect(() => {
         const loadIngredients = async () => {
             const res = await getIngredients();
             console.log
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