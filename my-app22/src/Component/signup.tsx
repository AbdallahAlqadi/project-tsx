import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login,reg.css';

// معلومات المخله في form
interface FormData {
  username: string;
  email: string;
  password: string;
}

// القيم المخزنه في localStorage
interface User {
  username: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  //بحتوي على البيانات المدخله
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  // بتعرض رساله بعد التسجيل
  const [alertMessage, setAlertMessage] = useState<string>('');
  // بنقلني لصفحه login
  const navigate = useNavigate();
// مسؤول عن اي تغير بحدث linput
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
//بتاكد اذا email موجود او لا
    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = existingUsers.some(user => user.email === formData.email);
    //بحال كان email موجود
    if (userExists) {
      setAlertMessage('User with this email already exists.');
      return;
    }
    //بحال كان email غير موجود

    existingUsers.push(formData);

    localStorage.setItem('users', JSON.stringify(existingUsers));

    setAlertMessage('Registration successful!');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const goToLogin = (): void => {
    navigate('/login');
  };

  return (
    <div className='b'>
      <div className="form-container">
        <h2 style={{ color: 'white' }}>Register</h2>
        {alertMessage && <div className="alert-message">{alertMessage}</div>}
        <form style={{ marginBottom: '8px' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: 'white' ,marginLeft:'20px',width:'533px'}} htmlFor="username">Username</label>
            <input  style={{marginLeft:'20px',width:'533px'}}
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'white',width:'533px',marginLeft:'20px' }} htmlFor="email">Email</label>
            <input style={{marginLeft:'20px',width:'533px'}}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'white' ,marginLeft:'20px'}} htmlFor="password">Password</label>
            <input  style={{marginLeft:'20px',width:'533px'}}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={{marginLeft:'20px'}} type="submit" className="submit-button">Register</button>
        </form> 
        <a id='z' onClick={goToLogin} className="login-button">Login</a>
      </div>
    </div>
  );
};

export default RegisterForm;
