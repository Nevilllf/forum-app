import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';



const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({ name, password });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500); 
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">      
      <h2 className="auth-title">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          Register
        </button>
      </form>
      <p className="auth-footer">
          Already have an account? <a href="/login" className="text-blue-500">Log in here</a>
      </p>

      {message && <p className="mt-4">{message}</p>}
    </div>
    </div>
  );
};

export default Register;
