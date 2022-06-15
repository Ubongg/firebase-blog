import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>
        my<span>P</span>rojecta
      </h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        {/* <Link to="/create" className="create">
          New Article
        </Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
