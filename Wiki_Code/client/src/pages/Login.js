import React, { useContext, useState } from 'react';
import { Card, Container, Form, Button, Row } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { login } from '../http/userAPI';
import { LOGIN_ROUTE, REGISTRATION_ROUTER } from '../utils/consts';

const Login = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const click = async () => {
        try {
            setError('');
            const data = await login(email, password);
            user.setUser(data);
            user.setIsAuth(true);
            user.setId(data.id);
            user.setIsAdmin(data.role === 'ADMIN');
            navigate('/');
        } catch (e) {
            setError(e.response?.data?.message || 'Ошибка при входе');
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">Авторизация</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {error && <div className="text-danger mt-2">{error}</div>}
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        <Button
                            variant="outline-dark"
                            onClick={click}
                        >
                            Войти
                        </Button>
                        <div>
                            Нет аккаунта? <NavLink to={REGISTRATION_ROUTER}>Зарегистрируйся!</NavLink>
                        </div>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Login; 