import React from 'react';
import { useContext , useState} from "react";
import {Card,CloseButton,Container,Image, ListGroup, Button } from "react-bootstrap";
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import {observer} from "mobx-react-lite";
import {Context} from '../index';
import DeletePanel from "./modals/DeleteModalsState";
import defaut_awatar from "../img/defaut_awatar.jpg";
import StarButton from "./controls/StarButton";
import PencilButton from "./controls/PencilButton";
import { USER_ROUTER, REDACT_ROUTER } from "../utils/consts";
import { createText } from "../http/textAPI";

const RenderText = ({str}) =>{
    return(
        parse(str)
    )
};

const StateBar = observer(() => {
    const {text, user, users} = useContext(Context)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [delId, setDelId] = useState(-1)
    const navigator = useNavigate()

    const addState = async() => {
        try {
            // Проверяем авторизацию
            if (!user.isAuth || !user.id) {
                console.error('Пользователь не авторизован');
                navigator('/login');
                return;
            }

            // Проверяем наличие групп
            if (!text.groups || text.groups.length === 0) {
                console.error('Нет доступных групп');
                return;
            }

            // Получаем ID и имя группы
            let idGroup = text.selectedGroup?.id || text.groups[0].id;
            let groupName = text.selectedGroup?.name || text.groups[0].name;
            
            if (!idGroup || !groupName) {
                console.error('Не удалось определить группу');
                return;
            }

            // Создаем новую статью
            const data = await createText('Новая статья', '<b>Текст статьи</b>', user.id, idGroup);
            if (data) {
                text.addText(data, user.fullName, groupName);
                navigator(REDACT_ROUTER + "/" + data.id);
            }
        } catch (error) {
            console.error('Ошибка при создании статьи:', error);
            if (error.response?.status === 401) {
                navigator('/login');
            }
        }
    }

    return(
        <Container>
            <Card
                style={{marginBottom: 20}}
            >
                <div 
                    className="d-flex"
                >
                    <Image 
                        src={user.img ? process.env.REACT_APP_API_URL + user.img : defaut_awatar}
                        height={35}
                        width={35}
                        roundedCircle
                        style={{margin: '10px', cursor: 'pointer', objectFit: 'cover'}}
                        onClick={() => navigator(USER_ROUTER + '/' + user.id)}
                    />
                    <div 
                        style={{margin: '15px 0px 0px 5px'}}
                        onClick={()=> addState()}
                    >
                        Добавить статью?
                    </div>
                    <div style={{margin: '10px 10px 10px auto'}}>
                        <Button 
                            variant="outline-dark"
                            style={{marginRight: 10}}
                            onClick={()=> addState()}
                        >
                            Добавить статью
                        </Button>
                        {!text.selectedUser.id === user.id?
                            <Button 
                                variant="outline-dark"
                                onClick={() => {
                                    text.setSelectedUser(user)
                                }}
                            >
                                Мои статьи
                            </Button>
                            :
                            <Button 
                                variant="outline-dark"
                                onClick={() => {
                                    text.setSelectedUser({})
                                }}
                            >
                                Все статьи
                            </Button>
                        }   
                    </div>
                </div>
            </Card>
            <ListGroup>
                {text.texts.map(OneText =>
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
                            {user.isAdmin?
                                <CloseButton
                                    style={{margin: '10px 10px 10px auto'}}
                                    onClick={()=> {setDeleteVisible(true)
                                                   setDelId(OneText.state.id)}}
                                ></CloseButton>
                                :
                                <b/>
                            }  
                        </div>
            
                        <div 
                            style={{marginLeft: 15, fontSize: 14, color: '#2A5885', cursor: 'pointer'}}
                            onClick = {()=> text.setSelectedGroup(OneText.group)}
                        >
                            {'#' + OneText.group.name}
                        </div>

                        <div 
                            style={{marginLeft: 19, fontSize: 25, fontWeight: "lighter"}}
                        >
                            {OneText.state.title} 
                        </div>

                        <div style={{margin: 15}}>
                            <RenderText str= {OneText.state.text}/>
                        </div>

                        <div className="d-flex">
                            <StarButton 
                                mark={OneText.mark}
                            />
                            <PencilButton idState={OneText.state.id}/>
                        </div>

                        <DeletePanel 
                            id={delId}
                            show = {deleteVisible} 
                            onHide={() => setDeleteVisible(false)} 
                        />
                
                    </Card>             
                )}
            </ListGroup>
      </Container>
    );
});

export default StateBar;