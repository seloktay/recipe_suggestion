import api from "./axios";

export const getRecipes = () => api.get("/recipes/");

export const addRecipe = (data) =>
  api.post("/recipes/", data);

export const updateRecipe = (id, data) =>
  api.put(`/recipes/${id}`, data);

export const deleteRecipe = (id) =>
  api.delete(`/recipes/${id}`);

  export const searchRecipes = (data) =>
    api.post("/recipes/search_by_ingredient/", data)