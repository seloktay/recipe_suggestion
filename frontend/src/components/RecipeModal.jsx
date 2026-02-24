import { useEffect, useState } from "react";
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
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [images, setImages] = useState([]);

  const addIngredient = (id) => {
    if (!selectedIngredients.find(i => i.id === id)) {
      setSelectedIngredients([
        ...selectedIngredients,
        { id, quantity: "" }
      ]);
    }
  };

  const updateQuantity = (id, quantity) => {
    setSelectedIngredients(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
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

    formData.append(
      "ingredients",
      JSON.stringify(selectedIngredients)
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

        <Select
          fullWidth
          onChange={(e) => addIngredient(e.target.value)}
          value=""
        >
          {ingredients.map(ingredient => (
            <MenuItem key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </MenuItem>
          ))}
        </Select>

        {selectedIngredients.map(item => {
          const ingredient = ingredients.find(i => i.id === item.id);

          return (
            <Box key={item.id} mt={1}>
              <Typography>{ingredient?.name}</Typography>
              <TextField
                label="Quantity"
                fullWidth
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, e.target.value)
                }
              />
            </Box>
          );
        })}

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