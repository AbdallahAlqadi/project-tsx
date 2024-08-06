import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageAlert from '../Component/messagealert';
import '../style/login,reg.css'; // Ensure you include this CSS file

interface FormData {
  email: string;
  password: string;
}

interface StoredData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [newPassword, setNewPassword] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const storedData: StoredData | null = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedData && storedData.email === formData.email && storedData.password === formData.password) {
      navigate('/home');
    } else {
      setAlertMessage('Invalid email or password');
    }
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setAlertMessage('Please enter both the old and new passwords.');
      return;
    }
    const storedData: StoredData | null = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedData && storedData.email === formData.email && storedData.password === oldPassword) {
      try {
        storedData.password = newPassword;
        localStorage.setItem('user', JSON.stringify(storedData));
        setAlertMessage('Password updated successfully');
        setNewPassword('');
        setOldPassword('');
        setShowPasswordChange(false);
      } catch (error) {
        console.error('Error:', error);
        setAlertMessage('An error occurred during password change');
      }
    } else {
      setAlertMessage('Old password is incorrect');
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);

  const closeAlert = () => setAlertMessage(null);

  return (
    <div className='b'>
      <div style={{ marginTop: '90px' }} className={`form-container ${showPasswordChange ? 'expanded' : ''}`}>
        <h2 style={{ color: 'white' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{marginLeft:'20px'}} htmlFor="email">Email</label>
            <input
            style={{width:'533px',marginLeft:'20px'}}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label style={{marginLeft:'20px'}} htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
              style={{width:'553px',marginLeft:'20px'}}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required  
                
              />
              <button type="button" className="toggle-password-button" onClick={toggleShowPassword}>
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>

        <button
          type="button"
          onClick={() => setShowPasswordChange(true)}
          className="change-password-button"
        >
          Change Password
        </button>
        <a style={{ marginLeft: '370px', cursor: 'pointer' }} onClick={() => { navigate('/signup') }}>Register</a>
        {showPasswordChange && (
          <form onSubmit={handlePasswordChange} className="change-password-form">
            <h3>Change Password</h3>
            <div className="form-group">
              <label style={{marginLeft:'20px'}} htmlFor="oldPassword">Old Password</label>
              <div className="password-input-container">
                <input
               style={{width:'553px',marginLeft:'20px'}}
                  type={showOldPassword ? 'text' : 'password'}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-password-button" onClick={toggleShowOldPassword}>
                  {showOldPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label style={{marginLeft:'20px'}} htmlFor="newPassword">New Password</label>
              <div className="password-input-container">
                <input style={{marginLeft:'20px'}}
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-password-button" onClick={toggleShowNewPassword}>
                  {showNewPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>
            <button type="submit" className="submit-button">Update Password</button>
            <button
              type="button"
              onClick={() => setShowPasswordChange(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
      {alertMessage && <MessageAlert message={alertMessage} onClose={closeAlert} />}
    </div>
  );
};

export default LoginForm;
