import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreatePostPage from './pages/CreatePostPage';
import NavBar from "./components/NavBar";

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/create-post" element={<CreatePostPage />} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
};

export default App;
