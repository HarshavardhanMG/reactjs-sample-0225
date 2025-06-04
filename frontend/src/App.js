import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import TasksBoard from './components/TaskBoard';

function App() {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user')));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tasks" element={user ? <TasksBoard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/tasks" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;