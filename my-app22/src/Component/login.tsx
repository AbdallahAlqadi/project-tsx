import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Retrieve stored data
    const storedData: StoredData | null = JSON.parse(localStorage.getItem('user') || 'null');
    // Check if the entered data matches stored data
    if (storedData && storedData.email === formData.email && storedData.password === formData.password) {
      // Redirect to home page
      navigate('/home');
    } else {
      alert('Invalid email or password');
    }
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      alert('Please enter both the old and new passwords.');
      return;
    }

    // Retrieve stored data
    const storedData: StoredData | null = JSON.parse(localStorage.getItem('user') || 'null');

    // Check if the old password matches the stored data
    if (storedData && storedData.email === formData.email && storedData.password === oldPassword) {
      try {
        // Update local storage with the new password
        storedData.password = newPassword;
        localStorage.setItem('user', JSON.stringify(storedData));

        alert('Password updated successfully');
        setNewPassword('');
        setOldPassword('');
        setShowPasswordChange(false);
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during password change');
      }
    } else {
      alert('Old password is incorrect');
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);

  return (
    <div className='b'>
      <div style={{ marginTop: '90px' }} className={`form-container ${showPasswordChange ? 'expanded' : ''}`}>
        <h2 style={{ color: 'white' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
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
              <label htmlFor="oldPassword">Old Password</label>
              <div className="password-input-container">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-password-button" onClick={toggleShowOldPassword}>
                {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-password-button" onClick={toggleShowNewPassword}>
                {showPassword ? '👁️' : '🙈'}
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
    </div>
  );
};

export default LoginForm;
