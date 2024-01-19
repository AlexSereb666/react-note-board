import React, { useState, ChangeEvent, useContext } from 'react';
import './ModalForm.css';
import InputForm from '../input-form/InputForm';
import ButtonMenu from '../button-menu/ButtonMenu';
import { userRegistration, loginFunc } from '../../http/UserAPI'
import UserStore from '../../store/UserStore';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';

const ModalForm = () => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const navigate = useNavigate()

    const { user } = useContext(Context) as { user: UserStore }

    const [checkTitle, setCheckTitle] = useState<string>('Авторизация')
    const [checkTextBtn, setCheckTextBtn] = useState<string>('Войти')
    const [checkTextTrans, setCheckTextTrans] = useState<string>('Регистрация')

    const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleCheckAuthChange: React.MouseEventHandler<HTMLDivElement> = (event) => {     
        changeData()
    };

    const changeData: () => void = () => {
        if (checkTitle === 'Авторизация') {
            setCheckTitle('Регистрация')
            setCheckTextBtn('Зарегистрироваться')
            setCheckTextTrans('Авторизация')
        } else {
            setCheckTitle('Авторизация')
            setCheckTextBtn('Войти')
            setCheckTextTrans('Регистрация')
        }
    }

    const Auth: () => void = async () => {
        if (login && password) {
            if (checkTitle === 'Авторизация') {
                try {
                    const data = await loginFunc(login, password)

                    user.setUser(data)
                    user.setIsAuth(true)

                    setLogin('')
                    setPassword('')

                    navigate('/work-board')
                } catch (error: any) {
                    console.log("Данный логин занят");
                }
                
            } else {
                try {
                    const data = await userRegistration(login, password, 'USER')
                    changeData()
                    setLogin('')
                    setPassword('')
                } catch (error: any) {
                    console.log("Данный пользователь уже есть");
                }
            }
        }
    };

    return (  
        <div className='container-modal'>
            <div className='container-modal__name'>
                NOTE BOARD
            </div>
            <div className='container-modal__title'>
                {checkTitle}
            </div>
            <div className='container-modal__login'>
                <InputForm
                    placeholder="Введите логин..."
                    value={login}
                    onChange={handleLoginChange}
                />
            </div>
            <div className='container-modal__password'>
                <InputForm
                    placeholder="Введите пароль..."
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>
            <div className='container-modal__button'>
                <ButtonMenu
                    text={checkTextBtn}
                    onClick={Auth}
                    fontSize='26px'
                />
            </div>
            <div className='container-modal__choice' onClick={handleCheckAuthChange}>
                {checkTextTrans}
            </div>
        </div>
    );
}
 
export default ModalForm;
