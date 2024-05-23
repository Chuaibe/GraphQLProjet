import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import './NavBar.css';

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
    }
  }
`;

const NavBar: React.FC = () => {
    const { data } = useQuery(GET_CURRENT_USER);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Social Network</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                {data?.me ? (
                    <>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
