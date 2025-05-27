import React, { useContext, useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchUsers, createUser, changeUser, deleteUser } from '../http/usersAPI';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';

const UserManagement = observer(() => {
    const { user, users } = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fn: '',
        sn: '',
        role: 'USER'
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await fetchUsers();
            users.setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Ошибка при загрузке пользователей');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            if (selectedUser) {
                await changeUser(selectedUser.id, 'email', formData.email);
                await changeUser(selectedUser.id, 'fn', formData.fn);
                await changeUser(selectedUser.id, 'sn', formData.sn);
                await changeUser(selectedUser.id, 'role', formData.role);
                
                if (formData.password) {
                    await changeUser(selectedUser.id, 'password', formData.password);
                }
                
                if (selectedUser.id === user.id) {
                    navigate(LOGIN_ROUTE);
                }
            } else {
                await createUser(formData);
            }
            setShowModal(false);
            await loadUsers();
            resetForm();
        } catch (error) {
            console.error('Error saving user:', error);
            setError('Ошибка при сохранении пользователя');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                setIsLoading(true);
                await deleteUser(userId);
                if (userId === user.id) {
                    navigate(LOGIN_ROUTE);
                }
                await loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Ошибка при удалении пользователя');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            fn: '',
            sn: '',
            role: 'USER'
        });
        setSelectedUser(null);
        setError('');
    };

    if (!user.isAdmin) {
        return <Alert variant="danger">Доступ запрещен</Alert>;
    }

    return (
        <Container>
            <Card className="mt-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Управление пользователями</h4>
                        <Button 
                            variant="light" 
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            disabled={isLoading}
                        >
                            <i className="fas fa-plus-circle me-2"></i>
                            Добавить пользователя
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                    
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                        </div>
                    ) : (
                        <Row className="g-4">
                            {users.users.map(user => (
                                <Col key={user.id} md={6} lg={4}>
                                    <Card className="h-100 shadow-sm">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h5 className="mb-1">{user.fn} {user.sn}</h5>
                                                    <p className="text-muted mb-0">{user.email}</p>
                                                </div>
                                                <Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'}>
                                                    {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                                                </Badge>
                                            </div>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setFormData({
                                                            email: user.email,
                                                            fn: user.fn,
                                                            sn: user.sn,
                                                            role: user.role,
                                                            password: ''
                                                        });
                                                        setShowModal(true);
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    <i className="fas fa-pencil-alt me-1"></i>
                                                    Редактировать
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={isLoading}
                                                >
                                                    <i className="fas fa-trash-alt me-1"></i>
                                                    Удалить
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => {
                if (!isLoading) {
                    setShowModal(false);
                    resetForm();
                }
            }}>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>
                        {selectedUser ? 'Редактирование пользователя' : 'Новый пользователь'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.fn}
                                onChange={(e) => setFormData({...formData, fn: e.target.value})}
                                required
                                placeholder="Введите имя"
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.sn}
                                onChange={(e) => setFormData({...formData, sn: e.target.value})}
                                required
                                placeholder="Введите фамилию"
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                                placeholder="Введите email"
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required={!selectedUser}
                                placeholder={selectedUser ? "Оставьте пустым, чтобы не менять" : "Введите пароль"}
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Роль</Form.Label>
                            <Form.Select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                disabled={isLoading}
                            >
                                <option value="USER">Пользователь</option>
                                <option value="ADMIN">Администратор</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button 
                                variant="secondary" 
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                disabled={isLoading}
                            >
                                Отмена
                            </Button>
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Сохранение...' : (selectedUser ? 'Сохранить изменения' : 'Создать пользователя')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
});

export default UserManagement; 