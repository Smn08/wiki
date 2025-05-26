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
        <Container>
            <Card style={{ marginBottom: 20 }}>
                <div className="d-flex">
                    <Image 
                        src={user.img ? process.env.REACT_APP_API_URL + user.img : defaut_awatar}
                        height={35}
                        width={35}
                        roundedCircle
                        style={{ margin: '10px', cursor: 'pointer', objectFit: 'cover' }}
                        onClick={() => navigator(USER_ROUTER + '/' + user.id)}
                    />
                    <div 
                        style={{ margin: '15px 0px 0px 5px' }}
                        onClick={() => addState()}
                    >
                        Добавить статью?
                    </div>
                    <div style={{ margin: '10px 10px 10px auto' }}>
                        <Button 
                            variant="outline-dark"
                            style={{ marginRight: 10 }}
                            onClick={() => addState()}
                        >
                            Добавить статью
                        </Button>
                        {text.selectedUser.id === user.id ? (
                            <Button 
                                variant="outline-dark"
                                onClick={handleShowAllArticles}
                            >
                                Все статьи
                            </Button>
                        ) : (
                            <Button 
                                variant="outline-dark"
                                onClick={handleShowMyArticles}
                            >
                                Мои статьи
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
            <ListGroup>
                {filteredTexts.map(OneText => (
                    <Card
                        key={OneText.state.id}
                        className="mb-4"
                    >
                        <div className="d-flex">
                            <div
                                style={{cursor: 'pointer'}}
                                onClick={() => navigator(USER_ROUTER + '/' + OneText.userId)}
                            >
                                <Image 
                                    src={users.img(OneText.userId) ? process.env.REACT_APP_API_URL + users.img(OneText.userId) : defaut_awatar}
                                    height={50}
                                    width={50}
                                    roundedCircle
                                    style={{margin: '10px 10px 5px 15px', objectFit: 'cover'}}
                                />
                                <b style={{marginTop: 20}}>
                                    {OneText.userName}
                                </b>
                            </div>
                            {user.isAdmin && (
                                <CloseButton
                                    style={{margin: '10px 10px 10px auto'}}
                                    onClick={() => {
                                        setDeleteVisible(true);
                                        setDelId(OneText.state.id);
                                    }}
                                />
                            )}
                        </div>
            
                        <div 
                            style={{marginLeft: 15, fontSize: 14, color: '#2A5885', cursor: 'pointer'}}
                            onClick={() => text.setSelectedGroup(OneText.group)}
                        >
                            {'#' + OneText.group.name}
                        </div>

                        <div 
                            style={{marginLeft: 19, fontSize: 25, fontWeight: "lighter"}}
                        >
                            {OneText.state.title} 
                        </div>

                        <div style={{margin: 15}}>
                            <RenderText str={OneText.state.text}/>
                        </div>

                        <div className="d-flex">
                            <StarButton 
                                mark={OneText.mark}
                            />
                            <PencilButton idState={OneText.state.id}/>
                        </div>

                        <DeletePanel 
                            id={delId}
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