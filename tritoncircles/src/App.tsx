import React from 'react';
import './App.css';
import NavBar from './components/Navbar/Navbar';
import { Route, Routes, Navigate, useLocation} from 'react-router-dom';
import Clubs from './views/Clubs';
import Events from './views/Events';
import Friends from './views/Friends';
import FriendsInterestedEvents from './views/FriendsInterestedEvents';
import Home from './views/Home';
import Profile from './views/Profile';
import Calendar from './views/Calendar';
import {AuthProvider} from './context/AuthContext';
import {useAuth} from './context/AuthContext';
import Signup from './views/Signup';
import SignupInfo from './views/SignupInfo';
import Login from './views/Login';

function App() {
  const location = useLocation();
  const {isAuthenticated} = useAuth();
  const hideNavBar = ['/login', '/signup', '/signup-info'];
  const shouldHide = hideNavBar.includes(location.pathname);

  return (
      <div className="App">
        {!shouldHide && isAuthenticated && <NavBar />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace />:<Navigate to="/login" replace/>} />
          <Route path="home" element={<Home/>} />
          <Route path="events" element={<Events/>} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="calendar" element={<Calendar/>} />
          <Route path="friends" element={<Friends />} />
          <Route path="friends-interested-events" element={<FriendsInterestedEvents />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="signup-info" element={<SignupInfo />} />
        </Routes>
      </div>
  );
}

const RootApp = () => {
  <AuthProvider>
    <App />
  </AuthProvider>
}

export default App;
