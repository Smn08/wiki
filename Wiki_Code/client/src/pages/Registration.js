import React, { useContext, useState } from "react";
import { Button, Container, Form, Row, Card, Alert } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { LOGIN_ROUTE, WIKIS_ROUTER } from "../utils/consts";
import { registration } from "../http/userAPI";
import { Context } from "../index";

const Registration = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!email || !password || !firstName || !lastName) {
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
            const data = await registration(email, password, firstName, lastName);
            
            // Устанавливаем данные пользователя
            user.setUser(data);
            user.setIsAuth(true);
            user.setIsAdmin(data.role === 'ADMIN');
            user.setId(data.id);
            
            // Перенаправляем на страницу со статьями
            navigate(WIKIS_ROUTER);
        } catch (e) {
            setError(e.response?.data?.message || 'Произошла ошибка при регистрации');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 160 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">Регистрация</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваше имя..."
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        disabled={loading}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите вашу фамилию..."
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        disabled={loading}
                    />
                    <Form.Control
                        className="mt-3"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Введите ваш email..."
                        disabled={loading}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        disabled={loading}
                    />
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        <div>Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink></div>
                        <Button 
                            variant="outline-success"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Registration; 