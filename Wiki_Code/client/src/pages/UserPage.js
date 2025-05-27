import React, {useContext, useState, useEffect} from "react";
import { Button, Card, Image, Spinner, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { WIKIS_ROUTER } from "../utils/consts";
import { Context } from "../index";
import RedactUser from "../components/modals/RedactUser";
import { $authHost } from "../http";
import { fetchOneUser, updateUser } from '../http/userAPI';
import defaut_awatar from '../img/defaut_awatar.jpg';

const RenderText = ({str}) => {
    return parse(str || '');
}

const UserPage = () => {
    const {users, user, text} = useContext(Context);
    const {id} = useParams();
    const navigator = useNavigate();
    const [redact, setRedact] = useState(false);
    const [userProfil, setUserProfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Сначала ищем пользователя в локальном списке
                let foundUser = users.users.find(u => u.id === parseInt(id));
                
                // Если не нашли, пробуем загрузить с сервера
                if (!foundUser) {
                    const data = await fetchOneUser(id);
                    if (data) {
                        foundUser = {
                            id: data.id,
                            user: {
                                id: data.id,
                                fn: data.fn,
                                sn: data.sn,
                                img: data.foto,
                                email: data.email,
                                text: data.text,
                                isAdmin: data.role === 'ADMIN'
                            }
                        };
                    }
                }

                if (foundUser) {
                    setUserProfil(foundUser.user);
                    setEditedUser(foundUser.user);
                } else {
                    setError('Пользователь не найден');
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                setError('Ошибка при загрузке данных пользователя');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [id, users.users]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser(userProfil);
        setFile(null);
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('id', editedUser.id);
            formData.append('email', editedUser.email);
            formData.append('fullName', editedUser.fn + ' ' + editedUser.sn);
            if (file) {
                formData.append('img', file);
            }

            const updatedUser = await updateUser(formData);
            if (updatedUser) {
                setUserProfil(updatedUser);
                setEditedUser(updatedUser);
                setIsEditing(false);
                setFile(null);
                users.setUsers(users.users.map(u => u.id === updatedUser.id ? updatedUser : u));
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Ошибка при обновлении данных пользователя');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </Container>
        );
    }

    if (!userProfil) {
        return null;
    }

    const isMyProfil = user.id === parseInt(id);
    const isAdmin = user.isAuth && user.isAdmin;

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Body className="p-4">
                    <div className="d-flex flex-column align-items-center mb-4">
                        <div className="position-relative mb-3">
                            <Image
                                src={userProfil.img ? process.env.REACT_APP_API_URL + userProfil.img : defaut_awatar}
                                roundedCircle
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    border: '3px solid #fff',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            />
                            {isEditing && (
                                <Form.Group className="mt-2">
                                    <Form.Control
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="form-control-sm"
                                    />
                                </Form.Group>
                            )}
                        </div>
                        
                        {isEditing ? (
                            <Form className="w-100 max-w-md">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={editedUser.email}
                                        onChange={handleInputChange}
                                        className="form-control-lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Имя</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fn"
                                        value={editedUser.fn}
                                        onChange={handleInputChange}
                                        className="form-control-lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Фамилия</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sn"
                                        value={editedUser.sn}
                                        onChange={handleInputChange}
                                        className="form-control-lg"
                                    />
                                </Form.Group>
                            </Form>
                        ) : (
                            <>
                                <h2 className="mb-2">{userProfil.fn} {userProfil.sn}</h2>
                                <p className="text-muted mb-0">{userProfil.email}</p>
                            </>
                        )}
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={handleSave}
                                    className="px-4 py-2"
                                    style={{ minWidth: '120px' }}
                                >
                                    Сохранить
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleCancel}
                                    className="px-4 py-2"
                                    style={{ minWidth: '120px' }}
                                >
                                    Отмена
                                </Button>
                            </>
                        ) : (
                            <>
                                {(isMyProfil || isAdmin) && (
                                    <Button
                                        variant="primary"
                                        onClick={handleEdit}
                                        className="px-4 py-2"
                                        style={{ minWidth: '120px' }}
                                    >
                                        Редактировать
                                    </Button>
                                )}
                                <Button
                                    variant="outline-primary"
                                    onClick={() => {
                                        text.setSelectedUser(userProfil);
                                        navigator(WIKIS_ROUTER);
                                    }}
                                    className="px-4 py-2"
                                    style={{ minWidth: '120px' }}
                                >
                                    Статьи
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => navigator(WIKIS_ROUTER)}
                                    className="px-4 py-2"
                                    style={{ minWidth: '120px' }}
                                >
                                    Назад
                                </Button>
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>
            <div 
                style={{fontWeight: "bold", margin: '0px 10px 0px 30px', fontSize: 30}}
            >
                О себе:
            </div>
            <div style={{margin: 15}}>
                <RenderText str={userProfil.text}/>
            </div>
            <RedactUser 
                user={userProfil}
                show={redact} 
                onHide={() => setRedact(false)}
            />
        </Container>
    );
};

export default UserPage;