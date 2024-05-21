import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import './Signup.css';  // Assurez-vous que le chemin est correct et que le fichier CSS existe

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async () => {
    try {
      const response = await signup({ variables: { username, email, password } });
      alert('Signup successful!');
      console.log('Response:', response.data);
    } catch (e) {
      alert('Signup failed.');
      console.error('Signup error:', e);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}>
        <h1 className="text-center mb-3">Sign Up</h1>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error 😦 Please try again</p>}
      </form>
    </div>
  );
}

export default Signup;
