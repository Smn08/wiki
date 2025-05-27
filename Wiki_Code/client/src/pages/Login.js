import React, { useContext, useState } from "react";
import { Button, Container, Form, Col, Row, Card, Alert } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { REGISTRATION_ROUTER, LOGIN_ROUTE, WIKIS_ROUTER } from "../utils/consts";
import { registration, login } from "../http/userAPI";
import { Context } from "../index";

const Login = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return false;
        }
        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return false;
        }
        if (!email.includes('@')) {
            setError('Пожалуйста, введите корректный email');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError('');
        if (!validateForm()) return;

        setLoading(true);
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password);
            }
            
            // Сохраняем токен в localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            // Устанавливаем данные пользователя
            user.setUser(data);
            user.setIsAuth(true);
            user.setIsAdmin(data.role === 'ADMIN');
            user.setId(data.id);

            // Добавляем небольшую задержку перед редиректом
            // чтобы убедиться, что все данные установлены
            setTimeout(() => {
                // Перенаправляем на страницу со статьями
                navigate(WIKIS_ROUTER, { replace: true });
            }, 100);
        } catch (e) {
            setError(e.response?.data?.message || 'Произошла ошибка при авторизации');
            // Очищаем токен в случае ошибки
            localStorage.removeItem('token');
            // Сбрасываем состояние пользователя
            user.setUser({});
            user.setIsAuth(false);
            user.setIsAdmin(false);
            user.setId(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit();
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 160 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Введите ваш email..."
                        disabled={loading}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        type="password"
                        disabled={loading}
                    />
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                    <Row>
                        <Col className="d-flex justify-content-between mt-3 pl-3 pr-3">
                            {isLogin ?
                                <div>Нет аккаунта? <NavLink to={REGISTRATION_ROUTER}>Зарегистрируйся!</NavLink></div>
                                : <div>Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink></div>
                            }
                            <Button 
                                variant="outline-success"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Регистрация')}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Login;