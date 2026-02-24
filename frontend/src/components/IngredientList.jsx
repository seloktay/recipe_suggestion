import { deleteIngredient } from "../api/ingredientsApi";

function IngredientList({ ingredients, onDeleted }) {
  const handleDelete = async (id) => {
    await deleteIngredient(id);
    onDeleted();
  };

  return (
    <ul>
      {ingredients.map((i) => (
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

export default IngredientList;