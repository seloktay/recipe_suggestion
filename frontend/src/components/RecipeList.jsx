import { deleteRecipe } from "../api/recipesApi";

function RecipeList({ recipes, onDeleted }) {
  const handleDelete = async (id) => {
    await deleteRecipe(id);
    onDeleted();
  };

  return (
    <ul>
      {recipes.map((i) => (
        <li key={i.id}>
          {i.name}
          <button onClick={() => handleDelete(i.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default RecipeList;