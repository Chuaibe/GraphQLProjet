import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SIGNUP_USER = gql`
  mutation SignupUser($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      token
    }
  }
`;

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [signup, { loading, error }] = useMutation(SIGNUP_USER);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data } = await signup({ variables: { email, name, password } });
        localStorage.setItem('token', data.signup.token);
        navigate('/');
    };

    return (
        <div className="signup-container">
            <h1>Signup</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Signup'}
                </button>
                {error && <p className="error-message">Error: {error.message}</p>}
            </form>
        </div>
    );
};

export default SignupPage;
