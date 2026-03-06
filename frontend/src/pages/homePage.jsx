import { useEffect, useState } from "react";
import MultiSelect from "../components/MultiSelect";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getIngredients } from "../api/ingredientsApi";
import { searchRecipes } from "../api/recipesApi"
import { Autocomplete, TextField } from "@mui/material";

function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchMode, setSearchMode] = useState('');
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const handleSearchModeSelection = (event) => {
      setSearchMode(event.target.value);
  };

  const handleSearch = async () => {
      const ingredient_id_list = selectedIngredients.map(ing => ing.id)
      const data = {
          "ingredients": ingredient_id_list,
          "search_mode": "strict"
      }
    const res = await searchRecipes(data);
    setMatchedRecipes(res.data);
  };

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
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Search Mode</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searchMode}
          label="SearchMode"
          onChange={handleSearchModeSelection}
        >
          <MenuItem value="strict">strict (no ingredients besides the ones selected)</MenuItem>
          <MenuItem value="flexible">flexible (uses any of the selected ingredients but is not limited to them)</MenuItem>
        </Select>
      </FormControl>
    </Box>
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