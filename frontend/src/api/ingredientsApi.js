import api from "./axios";

export const getIngredients = () => api.get("/ingredients");

export const addIngredient = (data) =>
  api.post("/ingredients", data);

export const deleteIngredient = (id) =>
  api.delete(`/ingredients/${id}`);