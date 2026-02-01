import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import api from './js/api.js'
import { AuthProvider, useAuth } from './js/authContext.jsx'
import ProtectedRoute from './js/helpers.jsx'
import Navbar from './components/navbar.jsx';
import RegisterPage from './pages/registerPage.jsx';
import HomePage from './pages/homePage.jsx';
import LoginPage from './pages/loginPage.jsx';
import Dashboard from './pages/dashboard.jsx';
import './App.css'

function App() {

  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
    </>
    );
}

export default App
