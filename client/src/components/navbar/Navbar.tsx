import React, { useContext } from 'react';
import './Navbar.css';
import ButtonMenu from '../button-menu/ButtonMenu';
import { Context } from '../../index';
import UserStore from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(Context) as { user: UserStore }
  const navigate = useNavigate()

  const closeProfile: () => void = () => {
    user.setUser({})
    user.setIsAuth(false)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="container-menu">
        <div className="container-menu__name-user">
              {user.userLogin}
        </div>
        <div className="container-menu__btn">
            <ButtonMenu
                text="Выход"
                onClick={closeProfile}
            />
        </div>
    </div>
  );
}

export default Navbar;
