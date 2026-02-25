import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
  MenuItem,
  IconButton,
  Select,
  Chip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function RecipeModal({
  open,
  handleClose,
  categories,
  ingredients,
  handleSubmit
}) {

  const [name, setName] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [ingredientRows, setIngredientRows] = useState([
    { ingredient: null, quantity: "" }
  ]);
  const [images, setImages] = useState([]);

    const MAX_INGREDIENTS = 30;

    const addRow = () => {
      if (ingredientRows.length < MAX_INGREDIENTS) {
        setIngredientRows([
          ...ingredientRows,
          { ingredient: null, quantity: "" }
        ]);
      }
    };

    const removeRow = (index) => {
      setIngredientRows(prev =>
        prev.filter((_, i) => i !== index)
      );
    };

    const updateIngredient = (index, value) => {
      setIngredientRows(prev =>
        prev.map((row, i) =>
          i === index ? { ...row, ingredient: value } : row
        )
      );
    };

    const updateQuantity = (index, value) => {
      setIngredientRows(prev =>
        prev.map((row, i) =>
          i === index ? { ...row, quantity: value } : row
        )
      );
    };

  const submitRecipe = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("cooking_time", cookingTime);
    formData.append("instructions", instructions);

    formData.append(
      "category_ids",
      JSON.stringify(selectedCategories)
    );

    const formattedIngredients = ingredientRows
      .filter(row => row.ingredient && row.quantity)
      .map(row => ({
        id: row.ingredient.id,
        quantity: row.quantity
      }));

    formData.append(
      "ingredients",
      JSON.stringify(formattedIngredients)
    );

    images.forEach(file => {
      formData.append("images", file);
    });

    handleSubmit(formData);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Create Recipe
        </Typography>

        <TextField
          fullWidth
          label="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Cooking Time"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Instructions"
          multiline
          rows={4}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          margin="normal"
        />

        {/* Categories */}
        <Typography mt={2}>Categories</Typography>
        <Select
          fullWidth
          multiple
          value={selectedCategories}
          onChange={(e) => setSelectedCategories(e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {selected.map((id) => {
                const category = categories.find(c => c.id === id);
                return <Chip key={id} label={category?.name} />;
              })}
            </Box>
          )}
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>

        {/* Ingredients */}
       <Typography mt={3}>Ingredients</Typography>

       {ingredientRows.map((row, index) => (
         <Box
           key={index}
           sx={{
             display: "flex",
             gap: 2,
             alignItems: "center",
             mt: 1
           }}
         >
           <Autocomplete
             sx={{ flex: 2 }}
             options={ingredients}
             getOptionLabel={(option) => option.name}
             value={row.ingredient}
             onChange={(e, newValue) =>
               updateIngredient(index, newValue)
             }
             renderInput={(params) => (
               <TextField
                 {...params}
                 label="Ingredient"
               />
             )}
             filterSelectedOptions
           />
            <TextField
              sx={{ flex: 1 }}
              label="Amount"
              value={row.quantity}
              onChange={(e) =>
                updateQuantity(index, e.target.value)
              }
            />

            <IconButton
              color="error"
              onClick={() => removeRow(index)}
              disabled={ingredientRows.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Box mt={2}>
          <IconButton
            color="primary"
            onClick={addRow}
            disabled={ingredientRows.length >= MAX_INGREDIENTS}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Images */}
        <Typography mt={3}>Images</Typography>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setImages(Array.from(e.target.files))
          }
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={submitRecipe}
        >
          Create Recipe
        </Button>
      </Box>
    </Modal>
  );
}