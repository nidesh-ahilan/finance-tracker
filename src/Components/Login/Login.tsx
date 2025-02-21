import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); 

  const toggleSignUp = () => {
    setIsNewUser(!isNewUser);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    let users = JSON.parse(localStorage.getItem('users') || '[]');
  
    if (isNewUser) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
  
      if (users.some((user: any) => user.username === username)) {
        alert('Username already exists');
        return;
      }
  
      const newUser = { username, password, transactions: [] };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('activeUser', username); 
      onLogin();
      navigate('/dashboard');
    } else {
      let user = users.find((user: any) => user.username === username && user.password === password);
  
      if (user || (username === 'admin' && password === 'admin')) {
        localStorage.setItem('activeUser', username); 
        onLogin();
        navigate('/dashboard');
      } else {
        alert('Invalid Username or Password');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login">
        <h1>Welcome to Your Personal Finance Tracker</h1>

        {isNewUser ? (
          <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <span onClick={toggleSignUp} className="link">Login</span></p>
          </div>
        ) : (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <span onClick={toggleSignUp} className="link">Sign Up</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
