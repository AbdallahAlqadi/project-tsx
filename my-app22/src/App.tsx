import * as React from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import health2 from './img/health2.jpeg';
import Home from './Component/home';
import LoginForm from './Component/login';
import RegisterForm from './Component/signup';

const App: React.FC = () => {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      {!isAuthPage && (
        <AppBar style={{backgroundColor:'green'}} className='App-bar'>
          <Toolbar>
            <img src={health2} alt="Health Logo" />
            <div className='links'>
              <Link to="/home">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content Area */}
      <div className="content">
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<RegisterForm />} />
        </Routes>
      </div>

      {/* Footer */}
      {!isAuthPage && (
        <footer style={{backgroundColor:'green'}} className="footer">
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
