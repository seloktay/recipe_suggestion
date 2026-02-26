import { useState, useEffect } from "react";
import { getIngredients } from "../api/ingredientsApi";

function MultiSelect({ selected, setSelected }) {


  const [query, setQuery] = useState("");

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleIngredient = (ingredient) => {
    if (selected.find((i) => i.id === ingredient.id)) {
      setSelected(selected.filter((i) => i.id !== ingredient.id));
    } else {
      setSelected([...selected, ingredient]);
    }
  };

  return (
    <div style={{ width: "300px", margin: "0 auto" }}>
      <input
        type="text"
        placeholder="Search ingredient..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "0.5rem" }}
      />

      <div
        style={{
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
        }}
      >
        {filtered.map((ingredient) => (
          <div
            key={ingredient.id}
            onClick={() => toggleIngredient(ingredient)}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              background: selected.find((i) => i.id === ingredient.id)
                ? "#ddd"
                : "white",
            }}
          >
            {ingredient.name}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        Selected: {selected.map((i) => i.name).join(", ")}
      </div>
    </div>
  );
}

export default MultiSelect;