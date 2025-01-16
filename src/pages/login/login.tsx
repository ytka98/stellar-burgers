import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  getUserError,
  getUserData,
  loginUserAsyncThunk
} from '../../services/slices/user-slice';
import { Modal } from '@components';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalErrorText, setModalErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(getUserError);
  const user = useSelector(getUserData);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await dispatch(
      loginUserAsyncThunk({
        email: email,
        password: password
      })
    );

    if (error) {
      setModalErrorText('Некорректный логин или пароль');
      setIsModalOpen(true);
    } else if (user) {
      navigate('/');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalErrorText('');
  };

  return (
    <>
      <LoginUI
        errorText=''
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
      {isModalOpen && (
        <Modal title='Error' onClose={closeModal}>
          <p>{modalErrorText}</p>
        </Modal>
      )}
    </>
  );
};
