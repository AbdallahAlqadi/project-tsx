import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageAlert from '../Component/messagealert';
import '../style/login,reg.css';

// شكل البيانات المدخله
interface FormData {
  email: string;
  password: string;
}

// بتحدد شكل البيانات الموجوده في localStorage
interface StoredData {
  email: string;
  password: string;
}

const LoginForm: React.FC<{ setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsLoggedIn }) => {
  // بتم تخزين email ,password
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  // يتم تخزين الباسورد الجديد
  const [newPassword, setNewPassword] = useState<string>('');
  // يتم تخزين الباسورد القديم
  const [oldPassword, setOldPassword] = useState<string>('');
  // بتتحكم بظهور  شاشه login or changepassword
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  // بتتحكم بظهور واخفاء الباسورد
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // بتتحكم بظهور واخفاء الباسورد
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  // بتتحكم بظهور واخفاء الباسورد
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  // لتغير المسج
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0); // عدد المحاولات الفاشلة
  const navigate = useNavigate();

  // بتحكم بوقت اخفاء MessageAlert
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // مسؤوله عن تغير القيم داخل input
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // بقارن اذا القيمه المدخله موجوده ب localstorge
    const users: StoredData[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setFailedAttempts(0); // إعادة تعيين المحاولات الفاشلة إلى 0
      navigate('/home');
    } else {
      setFailedAttempts(prev => prev + 1); // زيادة عدد المحاولات الفاشلة

      if (failedAttempts >= 3) {
        setAlertMessage('You have entered the wrong password and email 3 times.');
        setFailedAttempts(0); // إعادة تعيين المحاولات الفاشلة بعد 3 محاولات
      } else {
        setAlertMessage('Invalid email or password');
      }
    }
  };

  // مسؤوله عن تغير الباسورد
  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // بتحقق اذا اذا الباسورد القديم او الجديد غير مدخل
    if (!oldPassword || !newPassword) {
      setAlertMessage('Please enter both the old and new passwords.');
      return;
    }
    // جلب المستخدمين المخزنين في localStorage
    const users: StoredData[] = JSON.parse(localStorage.getItem('users') || '[]');
    // البحث عن المستخدم بناءً على الإيميل وكلمة المرور القديمة
    const userIndex = users.findIndex(u => u.email === formData.email && u.password === oldPassword);
    // إذا تم العثور على المستخدم
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      setAlertMessage('Password updated successfully');
      setNewPassword('');
      setOldPassword('');
      setShowPasswordChange(false);
      
    } 
    // إذا لم يتم العثور على المستخدم
    else {
      setAlertMessage('Old password is incorrect');
    }
  };

  // مسؤولات عن اظهار واخفاء كلمه المرور
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  //    بإغلاق رسالة التنبيه أو التحذير
  const closeAlert = () => setAlertMessage(null);

  return (
    <div className='b'>
      <div style={{ marginTop: '160px' }} className={`form-container ${showPasswordChange ? 'expanded' : ''}`}>
         {/* شرط بتحكم بعرض شاشه login or change password */}
        {!showPasswordChange ? (
          <>
            <h2 style={{ color: 'white' }}>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label style={{ marginLeft: '20px' }} htmlFor="email">Email</label>
                <input
                  style={{ width: '88.5%', marginLeft: '3.5%' }}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ marginLeft: '20px' }} htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    style={{ width: '85.5%', marginLeft: '20px' }}
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

            <div className='gridregchange'>
              <button
                type="button"
                onClick={() => setShowPasswordChange(true)}
                className="change-password-button"
              >
                Change Password
              </button>
              <a className='regbutton' style={{ marginLeft: '58%', cursor: 'pointer' }} onClick={() => { navigate('/signup') }}>Register</a>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ marginLeft: '20px', marginTop: '55px', marginBottom: '16px' }}>Change Password</h3>
            <form onSubmit={handlePasswordChange} className="change-password-form">
              <div className="form-group">
                <label style={{ marginLeft: '20px' }} htmlFor="oldPassword">Old Password</label>
                <div className="password-input-container">
                  <input
                    style={{ width: '553px', marginLeft: '20px' }}
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
                <label style={{ marginLeft: '20px' }} htmlFor="newPassword">New Password</label>
                <div className="password-input-container">
                  <input
                    style={{ marginLeft: '20px' }}
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
          </>
        )}
      </div>
      {/* جزئيه التحكم ب messagealert */}
      {alertMessage && <MessageAlert message={alertMessage} onClose={closeAlert} />}
    </div>
  );
};

export default LoginForm;
