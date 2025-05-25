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

    
    const addState = async() =>{
        var idGroup = text.groups[0].id;
        var groupName = text.groups[0].name
        if (text.selectedGroup.id != undefined){
            idGroup = text.selectedGroup.id
            groupName = text.selectedGroup.name
        }
        const data = await createText('Название','<b>Текст статьи</b>',user.id, idGroup)
        text.addText(data, user.fullName, groupName)
        navigator(REDACT_ROUTER + "/" + data.id)
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
                        src = {process.env.REACT_APP_API_URL + user.img}
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
                        {!text.selectedUser.id == user.id?
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
                        className="mb-4"
                    >
                        <div className="d-flex">
                            <div
                                style={{cursor: 'pointer'}}
                                onClick={() => navigator(USER_ROUTER + '/' + OneText.userId)}
                            >
                                <Image 
                                    src = {process.env.REACT_APP_API_URL + users.img(OneText.userId)}
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