import React, { useState, useContext, useEffect } from "react";
import { Button, Card, Form, Container, Row, Col, ListGroup, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from '../index';
import { WIKIS_ROUTER } from "../utils/consts";
import { changeText, fetchText } from "../http/textAPI";
import GrupBar from "../components/GrupBar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/WikiRedact.css';

const WikiRedact = () => {
    const { id } = useParams();
    const { text, user } = useContext(Context);
    const navigator = useNavigate();

    const [title, setTitle] = useState('');
    const [redactText, setRedactText] = useState('');
    const [activeGroup, setActiveGroup] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tempTitle, setTempTitle] = useState('');
    const [tempText, setTempText] = useState('');
    const [tempGroup, setTempGroup] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadArticle = async () => {
            try {
                setIsLoading(true);
                // Получаем статью из локального состояния
                const article = text.texts.find(t => t.id === parseInt(id));
                
                if (!article) {
                    // Если статья не найдена в локальном состоянии, пробуем загрузить с сервера
                    const data = await fetchText(null, null, 1, 1, id);
                    if (!data || !data.rows || data.rows.length === 0) {
                        setError('Статья не найдена');
                        return;
                    }
                    const serverArticle = data.rows[0];
                    const canEdit = user.isAdmin || (user.isAuth && serverArticle.userId === user.id);
                    
                    if (!canEdit) {
                        setError('У вас нет прав на редактирование этой статьи');
                        return;
                    }

                    setTitle(serverArticle.title);
                    setRedactText(serverArticle.text);
                    setActiveGroup({ id: serverArticle.groupId, name: serverArticle.group.name });
                    setTempTitle(serverArticle.title);
                    setTempText(serverArticle.text);
                    setTempGroup({ id: serverArticle.groupId, name: serverArticle.group.name });
                } else {
                    const canEdit = user.isAdmin || (user.isAuth && article.userId === user.id);
                    
                    if (!canEdit) {
                        setError('У вас нет прав на редактирование этой статьи');
                        return;
                    }

                    setTitle(article.state.title);
                    setRedactText(article.state.text);
                    setActiveGroup(article.group);
                    setTempTitle(article.state.title);
                    setTempText(article.state.text);
                    setTempGroup(article.group);
                }
            } catch (error) {
                console.error('Error loading article:', error);
                if (error.response?.status === 401) {
                    setError('Необходима авторизация');
                } else if (error.response?.status === 403) {
                    setError('У вас нет прав на редактирование этой статьи');
                } else {
                    setError('Ошибка при загрузке статьи');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadArticle();
    }, [id, user, text.texts]);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list', 'bullet',
        'align',
        'link', 'image'
    ];

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    const handleTitleChange = (e) => {
        setTempTitle(e.target.value);
        setHasChanges(true);
    };

    const handleTextChange = (content) => {
        setTempText(content);
        setHasChanges(true);
    };

    const handleGroupChange = (group) => {
        setTempGroup(group);
        setHasChanges(true);
    };

    const save = async () => {
        if (isSaving) return;
        
        if (!tempTitle.trim()) {
            alert('Пожалуйста, введите заголовок статьи');
            return;
        }
        if (!tempText.trim()) {
            alert('Пожалуйста, введите текст статьи');
            return;
        }
        if (!tempGroup.id) {
            alert('Пожалуйста, выберите группу для статьи');
            return;
        }

        try {
            setIsSaving(true);
            await changeText(id, tempTitle, tempText, tempGroup.id);
            setTitle(tempTitle);
            setRedactText(tempText);
            setActiveGroup(tempGroup);
            setHasChanges(false);
            navigator(WIKIS_ROUTER);
        } catch (error) {
            console.error('Error saving article:', error);
            if (error.response?.status === 403) {
                alert('У вас нет прав на редактирование этой статьи');
            } else {
                alert('Произошла ошибка при сохранении статьи');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            setShowConfirmModal(true);
        } else {
            navigator(WIKIS_ROUTER);
        }
    };

    const handleConfirmLeave = () => {
        setTempTitle(title);
        setTempText(redactText);
        setTempGroup(activeGroup);
        setHasChanges(false);
        navigator(WIKIS_ROUTER);
    };

    if (isLoading) {
        return (
            <Container className="mt-5">
                <Card className="text-center">
                    <Card.Body>
                        <h3>Загрузка...</h3>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Card className="text-center">
                    <Card.Body>
                        <h3 className="text-danger">{error}</h3>
                        <Button 
                            variant="primary" 
                            onClick={() => navigator(WIKIS_ROUTER)}
                            className="mt-3"
                        >
                            Вернуться к статьям
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="mt-3">
                <Col md={3}>
                    <Card className="mb-3">
                        <Card.Header>
                            <h5>Группы</h5>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {text.groups.map(group =>
                                <ListGroup.Item 
                                    key={group.id}
                                    active={group.id === tempGroup.id}
                                    onClick={() => handleGroupChange(group)}
                                    style={{cursor: 'pointer'}}
                                >
                                    {group.name}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
                <Col md={9}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5>Редактирование статьи</h5>
                            {hasChanges && <span className="text-warning">Есть несохраненные изменения</span>}
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Заголовок</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={tempTitle}
                                    onChange={handleTitleChange}
                                    placeholder="Введите заголовок статьи"
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Текст статьи</Form.Label>
                                <ReactQuill
                                    theme="snow"
                                    value={tempText}
                                    onChange={handleTextChange}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Введите текст статьи..."
                                />
                            </Form.Group>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end">
                            <Button 
                                variant="outline-secondary" 
                                className="me-2"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                Отмена
                            </Button>
                            <Button 
                                variant="primary"
                                onClick={save}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Остаться
                    </Button>
                    <Button variant="danger" onClick={handleConfirmLeave}>
                        Покинуть
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default WikiRedact;