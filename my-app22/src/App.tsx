import * as React from 'react';
import { useLocation, Route, Routes, Link } from 'react-router-dom';
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

  // Check if the current route is /login or /signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/' ;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Conditionally render AppBar */}
      {!isAuthPage && (
        <AppBar style={{ backgroundColor: 'green', paddingTop: '15px', paddingBottom: '10px' }} className='appbar'>
          <Toolbar className='toolbar'>
            <img id='imgappbar' src={health2} alt="Health Logo" />
            <div className='links'>
              <Link to="/home">Home</Link>
              {location.pathname === '/login' ? (
                <Link to="/signup">Signup</Link>
              ) : (
                <Link to="/login">Login</Link>
              )}
              <a>Menu</a>
            </div>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content Area */}
      <div className="content" style={{ flex: 1 }}>
        <Routes>
          <Route path='/' element={<RegisterForm />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<RegisterForm />} />
          
        </Routes>
      </div>

      {/* Conditionally render Footer */}
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
