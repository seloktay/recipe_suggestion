import { useState } from "react";
import MultiSelect from "../components/MultiSelect";

function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleSearch = () => {
    console.log("Selected:", selectedIngredients);
    // Later: call backend here
  };

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Select Ingredients</h1>

      <MultiSelect
        selected={selectedIngredients}
        setSelected={setSelectedIngredients}
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