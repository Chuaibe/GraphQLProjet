import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Social Network</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/create-post">Create Post</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </div>
        </nav>
    );
};

export default NavBar;
