import React from 'react';
import './App.css';
import NavBar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Clubs from './views/Clubs';
import Events from './views/Events';
import Friends from './views/Friends';
import FriendsInterestedEvents from './views/FriendsInterestedEvents';
import Home from './views/Home';
import Profile from './views/Profile';
import Calendar from './views/Calendar';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="events" element={<Events/>} />
       <Route path="clubs" element={<Clubs />} />
       <Route path="calendar" element={<Calendar/>} />
       <Route path="friends" element={<Friends />} />
       <Route path="friends-interested-events" element={<FriendsInterestedEvents />} />
       <Route path="profile" element={<Profile />} />
     </Routes>
    </div>
  );
}

export default App;
