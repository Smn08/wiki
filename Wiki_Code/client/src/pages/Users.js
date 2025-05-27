import React, {useContext, useState} from "react";
import { Card, Image, CloseButton, ListGroup, Form, Button, Modal } from "react-bootstrap";
import {observer} from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';
import { Context } from "../index";
import DeletePanel from "../components/modals/DeleteModalsUser";
import { LOGIN_ROUTE, USERS_ROUTER, USER_ROUTER } from "../utils/consts";
import { changeUser, createUser } from "../http/usersAPI";

const Users = observer(() => {
    const {users, user} = useContext(Context);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [delUserId, setDelUserId] = useState(-1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        fn: '',
        sn: '',
        role: 'USER'
    });
    const navigator = useNavigate();

    const resAdmin = (id, role) => {
        if (role) {
            changeUser(id, 'role', 'ADMIN').then(data => {
                users.setRole(id, role);
            });
        } else {
            changeUser(id, 'role', 'USER').then(data => {
                users.setRole(id, role);
            });
        }
        if (id == user.id) {
            navigator(LOGIN_ROUTE);
        }
    };

    const handleCreateUser = async () => {
        try {
            // Форматируем данные пользователя в соответствии с ожиданиями сервера
            const userData = {
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
                fn: newUser.fn,
                sn: newUser.sn
            };
            
            await createUser(userData);
            setShowCreateModal(false);
            setNewUser({
                email: '',
                password: '',
                fn: '',
                sn: '',
                role: 'USER'
            });
            // Обновляем список пользователей
            window.location.reload();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <Card className="mt-3">
            <div className="d-flex justify-content-between align-items-center p-3">
                <h3>Управление пользователями</h3>
                {user.isAdmin && (
                    <Button 
                        variant="primary" 
                        onClick={() => setShowCreateModal(true)}
                    >
                        Создать пользователя
                    </Button>
                )}
            </div>
            <ListGroup variant="flush">
                {users.users.map(OneUser =>
                    <Card 
                        key={OneUser.id}
                        className="mt-2"
                        style={{width: '100%'}}
                    >
                        <div className="d-flex">
                            <Image 
                                width={150} 
                                height={150} 
                                src={OneUser.img} 
                                className="mt-3"
                            />
                            <div className="d-flex flex-column mt-3">
                                <div className="d-flex">
                                    <h4>{OneUser.fullName}</h4>
                                    {user.isAdmin && user.id != OneUser.id ?
                                        <div 
                                            style={{margin: '10px 10px 10px auto'}} 
                                            className="d-flex"
                                        >
                                            <Form>
                                                <div className="d-flex">
                                                    <Form.Label>
                                                        Admin
                                                    </Form.Label>
                                                    <Form.Check
                                                        type="switch"
                                                        id={OneUser.user.id}
                                                        checked={OneUser.user.isAdmin}
                                                        onClick={() => {
                                                            resAdmin(OneUser.user.id, !OneUser.user.isAdmin);
                                                        }}
                                                        style={{marginLeft: 5}}
                                                    />
                                                </div>
                                            </Form>
                                            <CloseButton
                                                onClick={() => {
                                                    setDeleteVisible(true);
                                                    setDelUserId(OneUser.id);
                                                }}
                                                style={{marginLeft: 10}}
                                            />
                                        </div>
                                        : <b/>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </ListGroup>

            <DeletePanel
                show={deleteVisible}
                onHide={() => setDeleteVisible(false)}
                id={delUserId}
            />

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создать нового пользователя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.fn}
                                onChange={(e) => setNewUser({...newUser, fn: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.sn}
                                onChange={(e) => setNewUser({...newUser, sn: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Роль</Form.Label>
                            <Form.Select
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            >
                                <option value="USER">Пользователь</option>
                                <option value="ADMIN">Администратор</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleCreateUser}>
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
});

export default Users;