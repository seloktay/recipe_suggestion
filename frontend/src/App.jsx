import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IngredientsPage from "./pages/ingredientsPage"
import RecipesPage from "./pages/recipesPage"
import HomePage from "./pages/homePage"
import Navbar from "./components/Navbar"


function App() {
  const [count, setCount] = useState(0)

  return (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
          </Routes>
        </BrowserRouter>
  )
}

export default App
