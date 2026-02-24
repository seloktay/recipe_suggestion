import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <button onClick={() => setOpen(!open)}>
        ☰
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "3rem",
            background: "white",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <div>
              <Link to="/" onClick={() => setOpen(false)}>
              Home Page
              </Link>
          </div>
          <div>
            <Link to="/recipes" onClick={() => setOpen(false)}>
              Recipes
            </Link>
          </div>
          <div>
            <Link to="/ingredients" onClick={() => setOpen(false)}>
              Ingredients
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;