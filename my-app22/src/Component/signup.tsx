import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login,reg.css';  

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface User {
  username: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Retrieve existing users from localStorage
    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    const userExists = existingUsers.some(user => user.email === formData.email);
    
    if (userExists) {
      alert('User with this email already exists.');
      return;
    }

    // Add new user to the list
    existingUsers.push(formData);

    // Store updated list in localStorage
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Navigate to login page or home page
    navigate('/home');
  };

  const goToLogin = (): void => {
    navigate('/login');
  };

  return (
    <div className='b'>
      <div className="form-container">
        <h2 style={{ color: 'white' }}>Register</h2>
        <form style={{ marginBottom: '8px' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: 'white' }} htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'white' }} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'white' }} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form> 
        <a id='z' onClick={goToLogin} className="login-button">Login</a>
      </div>
    </div>
  );
};

export default RegisterForm;
