import React, { useEffect, useState, useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Context } from './index';
import ModalForm from './components/modal-form/ModalForm';
import { observer } from 'mobx-react-lite'
import UserStore from './store/UserStore';
import { auth } from './http/UserAPI';
import WorkBoard from './components/work-board/WorkBoard';
import { jwtDecode } from 'jwt-decode';

const App = observer(() => {
  const { user } = useContext(Context) as { user: UserStore }

  useEffect(() => {
    auth().then(data => {
      if (localStorage.getItem('token')) {
        user.setUser(jwtDecode(localStorage.getItem('token')!))
        user.setIsAuth(true)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route key='/' path="/" element={user.isAuth ? <Navigate to="/work-board" /> : <ModalForm />} />
          {user.isAuth ? (
            <Route key='/work-board' path="/work-board" element={<WorkBoard />} />
          ) : null}
        </Routes>
      </div>
    </Router>
  );
})

export default App;
