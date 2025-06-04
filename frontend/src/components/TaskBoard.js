import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import './TaskBoard.css';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';

function Web3Wallet() {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (err) {
        alert('User denied wallet connection');
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  return (
    <div style={{ margin: '0.5rem 0' }}>
      <button onClick={connectWallet} style={{ background: '#f5f6fa', color: '#174a7c', border: '1px solid #174a7c', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: 500 }}>
        {account ? `Connected: ${account.substring(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>
    </div>
  );
}

export default function TasksBoard({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const profileRef = useRef();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: token }
    });
    setTasks(res.data);
  };

  // Persist randomId per user (by email)
  useEffect(() => {
    if (!user?.email) return;
    const key = `profileImgId_${user.email}`;
    let randomId = localStorage.getItem(key);
    if (!randomId) {
      randomId = Math.floor(Math.random() * 1000);
      localStorage.setItem(key, randomId);
    }
    // Check if the image exists
    fetch(`https://picsum.photos/id/${randomId}/info`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        setProfileImg(`https://picsum.photos/id/${randomId}/40/40`);
      })
      .catch(() => setProfileImg(null));
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);

  const openModal = (task = null) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditTask(null);
    setModalOpen(false);
    fetchTasks();
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowProfile(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="tasksboard-container">
      <header>
        <h1>TasksBoard</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div
            className="profile"
            ref={profileRef}
            style={{ cursor: 'default', position: 'relative', overflow: 'hidden', padding: 0, width: 40, height: 40, minWidth: 40, minHeight: 40 }}
          >
            {profileImg ? (
              <img
                src={profileImg}
                alt="profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
              />
            ) : (
              user.username[0]
            )}
          </div>
          <div
            className="profile-username"
            onClick={e => { e.stopPropagation(); setShowProfile(v => !v); }}
            style={{ marginTop: 6, fontWeight: 500, color: '#174a7c', cursor: 'pointer', userSelect: 'none', position: 'relative' }}
          >
            {user.username}
            {showProfile && (
              <div className="profile-dropdown" onClick={e => e.stopPropagation()} style={{ left: '50%', transform: 'translateX(-50%)', top: '110%', position: 'absolute' }}>
                <div className="profile-info">
                  <strong>{user.username}</strong>
                  <div style={{ fontSize: '0.9em', color: '#555' }}>{user.email}</div>
                </div>
                <button className="logout-btn" onMouseDown={handleLogout}>Logout</button>
              </div>
            )}
          </div>
          <Web3Wallet />
        </div>
      </header>
      <button className="add-task-btn" onClick={() => openModal()}>+ Add Task</button>
      <TaskList tasks={tasks} onEdit={openModal} onChange={fetchTasks} />
      {modalOpen && (
        <TaskModal
          task={editTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}