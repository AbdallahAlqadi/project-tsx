import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login,reg.css';

// معلومات المخلة في form
interface FormData {
  username: string;
  email: string;
  password: string;
}

// القيم المخزنة في localStorage
interface User {
  username: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  // يحتوي على البيانات المدخلة
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  // تعرض رسالة بعد التسجيل أو الخطأ
  const [alertMessage, setAlertMessage] = useState<string>('');
  // بنقلني لصفحة login
  const navigate = useNavigate();

  // مسؤول عن أي تغير يحدث في input
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // إعادة تعيين الرسالة التحذيرية عند تغيير المدخلات
    setAlertMessage('');
  };

  // تحقق من كلمة المرور - يجب أن تحتوي على أحرف وأرقام
  const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // تحقق إذا كان email موجودًا بالفعل
    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some(user => user.email === formData.email);

    if (userExists) {
      setAlertMessage('User with this email already exists.');
      return;
    }

    // تحقق من صحة كلمة المرور
    if (!isPasswordValid(formData.password)) {
      setAlertMessage('Password must contain at least 8 characters, including letters and numbers.');
      return;
    }

    // إذا كان email غير موجود وكانت كلمة المرور صحيحة
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
            <label style={{ color: 'white', marginLeft: '20px', width: '533px' }} htmlFor="username">Username</label>
            <input
              style={{ marginLeft: '20px', width: '90%' }}
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'white', width: '533px', marginLeft: '20px' }} htmlFor="email">Email</label>
            <input
              style={{ marginLeft: '20px', width: '90%' }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'white', marginLeft: '20px' }} htmlFor="password">Password</label>
            <input
              style={{ marginLeft: '20px', width: '90%' }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={{ marginLeft: '20px' }} type="submit" className="submit-button">Register</button>
        </form>
        <a id='z' onClick={goToLogin} className="login-button">Login</a>
      </div>
    </div>
  );
};

export default RegisterForm;
