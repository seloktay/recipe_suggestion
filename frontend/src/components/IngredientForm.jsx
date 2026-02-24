import { useState } from "react";
import { addIngredient } from "../api/ingredientsApi";

function IngredientForm({ onCreated }) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    await addIngredient({ name });
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

export default IngredientForm;