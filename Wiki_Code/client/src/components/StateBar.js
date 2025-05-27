import React from 'react';
import { useContext, useState } from "react";
import { Card, CloseButton, Container, Image, ListGroup, Button } from "react-bootstrap";
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from '../index';
import DeletePanel from "./modals/DeleteModalsState";
import defaut_awatar from "../img/defaut_awatar.jpg";
import StarButton from "./controls/StarButton";
import PencilButton from "./controls/PencilButton";
import { USER_ROUTER, REDACT_ROUTER } from "../utils/consts";
import { createText } from "../http/textAPI";

const RenderText = ({str}) => {
    return parse(str || '');
};

const StateBar = observer(() => {
    const { text, user, users } = useContext(Context);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [delId, setDelId] = useState(-1);
    const navigator = useNavigate();
    
    const addState = async () => {
        try {
            // Check authentication
            if (!user.isAuth || !user.id) {
                console.error('User not authenticated');
                navigator('/login');
                return;
            }

            // Check for available groups
            if (!text.groups || text.groups.length === 0) {
                alert('Нет доступных групп. Пожалуйста, создайте группу перед добавлением статьи.');
                return;
            }

            // Get group ID and name
            let idGroup = text.selectedGroup?.id || text.groups[0].id;
            let groupName = text.selectedGroup?.name || text.groups[0].name;
            
            if (!idGroup || !groupName) {
                alert('Не удалось определить группу. Пожалуйста, выберите группу.');
                return;
            }

            // Create new article with default content
            const defaultTitle = 'Новая статья';
            const defaultContent = '<h2>Заголовок</h2><p>Начните писать вашу статью здесь...</p>';
            
            const data = await createText(defaultTitle, defaultContent, user.id, idGroup);
            if (data) {
                // Add the new article to the list
                text.addText(data, user.fullName, groupName);
                // Immediately navigate to edit page
                navigator(REDACT_ROUTER + "/" + data.id);
            }
        } catch (error) {
            console.error('Error creating article:', error);
            if (error.response?.status === 401) {
                navigator('/login');
            } else {
                alert('Ошибка при создании статьи. Пожалуйста, попробуйте снова.');
            }
        }
    };

    const handleShowAllArticles = () => {
        text.setSelectedUser({});
        text.setSelectedGroup({});
    };

    const handleShowMyArticles = () => {
        text.setSelectedUser(user);
        text.setSelectedGroup({});
    };

    const filteredTexts = text.texts.filter(article => {
        const matchesUser = !text.selectedUser.id || article.userId === text.selectedUser.id;
        const matchesGroup = !text.selectedGroup.id || article.group.id === text.selectedGroup.id;
        return matchesUser && matchesGroup;
    });

    return (
        <Container className="py-4">
            <Card className="shadow-sm mb-4">
                <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                        <Image 
                            src={user.img ? process.env.REACT_APP_API_URL + user.img : defaut_awatar}
                            height={40}
                            width={40}
                            roundedCircle
                            style={{ 
                                cursor: 'pointer', 
                                objectFit: 'cover',
                                border: '2px solid #fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => navigator(USER_ROUTER + '/' + user.id)}
                        />
                        <div 
                            className="ms-3 text-primary"
                            style={{ cursor: 'pointer' }}
                            onClick={() => addState()}
                        >
                            Добавить статью?
                        </div>
                        <div className="ms-auto d-flex gap-2">
                            <Button 
                                variant="primary"
                                onClick={() => addState()}
                                className="px-4"
                            >
                                Добавить статью
                            </Button>
                            <Button 
                                variant="outline-primary"
                                onClick={handleShowAllArticles}
                                className="px-4"
                            >
                                Все статьи
                            </Button>
                            <Button 
                                variant="outline-primary"
                                onClick={handleShowMyArticles}
                                className="px-4"
                            >
                                Мои статьи
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <ListGroup className="gap-3">
                {filteredTexts.map(OneText => (
                    <Card
                        key={OneText.state.id}
                        className="shadow-sm"
                    >
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div
                                    className="d-flex align-items-center"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => navigator(USER_ROUTER + '/' + OneText.userId)}
                                >
                                    <Image 
                                        src={users.img(OneText.userId) ? process.env.REACT_APP_API_URL + users.img(OneText.userId) : defaut_awatar}
                                        height={50}
                                        width={50}
                                        roundedCircle
                                        style={{
                                            objectFit: 'cover',
                                            border: '2px solid #fff',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <span className="ms-3 fw-bold">
                                        {OneText.userName}
                                    </span>
                                </div>
                                {user.isAdmin && (
                                    <CloseButton
                                        className="ms-auto"
                                        onClick={() => {
                                            setDeleteVisible(true);
                                            setDelId(OneText.state.id);
                                        }}
                                    />
                                )}
                            </div>
                
                            <div 
                                className="text-primary mb-2"
                                style={{cursor: 'pointer'}}
                                onClick={() => text.setSelectedGroup(OneText.group)}
                            >
                                {'#' + OneText.group.name}
                            </div>

                            <h3 className="mb-3 fw-light">
                                {OneText.state.title} 
                            </h3>

                            <div className="mb-3">
                                <RenderText str={OneText.state.text}/>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <StarButton 
                                    mark={OneText.mark}
                                />
                                <PencilButton 
                                    idState={OneText.state.id}
                                    userId={OneText.userId}
                                />
                            </div>
                        </Card.Body>

                        <DeletePanel 
                            id={delId}
                            userId={text.texts.find(t => t.id === delId)?.userId}
                            show={deleteVisible} 
                            onHide={() => setDeleteVisible(false)} 
                        />
                    </Card>             
                ))}
            </ListGroup>
        </Container>
    );
});

export default StateBar;