// src/App.js
import * as React from 'react';
import { useLocation, Route, Routes, Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import './App.css';
import health2 from './img/health2.jpeg';
import Home from './Component/home';
import LoginForm from './Component/login';
import RegisterForm from './Component/signup';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/login');
  };

  React.useEffect(() => {
    if (location.pathname === '/logout') {
      handleLogout();
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthPage && (
        <AppBar style={{ backgroundColor: '#018749', paddingTop: '15px', paddingBottom: '10px'}} className='appbar'>
          <Toolbar className='toolbar'>
            <img id='imgappbar' src={health2} alt="Health Logo" />
            <div className='links'>
              <Link to="/home">Home</Link>
              {isLoggedIn ? (
                <a onClick={handleLogout}>Logout</a>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Signup</Link>
                </>
              )}
              <a>Menu</a>
            </div>
          </Toolbar>
        </AppBar>
      )}

      <div className="content" style={{ flex: 1 }}>
        <Routes>
          <Route path='/' element={<RegisterForm />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/signup' element={<RegisterForm />} />
          <Route path='/logout' element={<div />} /> {/* Dummy route for logout */}
        </Routes>
      </div>

      {!isAuthPage && (
        <footer className="footer">
          <div className="footer-container">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
        </footer>
      )}
    </Box>
  );
}

export default App;
