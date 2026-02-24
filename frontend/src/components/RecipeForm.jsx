import { useState } from "react";
import { addRecipe } from "../api/recipesApi";

function RecipeForm({ onCreated }) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    await addRecipe({ name });
    setName("");
    onCreated();
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default RecipeForm;