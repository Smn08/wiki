import React, { useState, useContext, useEffect } from "react";
import { Button, Card, Form, Container, Row, Col, ListGroup, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from '../index';
import { WIKIS_ROUTER } from "../utils/consts";
import { changeText } from "../http/textAPI";
import GrupBar from "../components/GrupBar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/WikiRedact.css';

const WikiRedact = () => {
    const { id } = useParams();
    const { text } = useContext(Context);
    const navigator = useNavigate();

    const RedactState = text.texts.find(OneText => OneText.id == id);
   
    const [title, setTitle] = useState(RedactState?.state?.title || '');
    const [redactText, setRedactText] = useState(RedactState?.state?.text || '');
    const [activeGroup, setActiveGroup] = useState(RedactState?.group || {});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tempTitle, setTempTitle] = useState(RedactState?.state?.title || '');
    const [tempText, setTempText] = useState(RedactState?.state?.text || '');
    const [tempGroup, setTempGroup] = useState(RedactState?.group || {});
    
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
            await changeText(RedactState.id, tempTitle, tempText, tempGroup.id);
            setTitle(tempTitle);
            setRedactText(tempText);
            setActiveGroup(tempGroup);
            setHasChanges(false);
            navigator(WIKIS_ROUTER);
        } catch (error) {
            console.error('Error saving article:', error);
            alert('Произошла ошибка при сохранении статьи');
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