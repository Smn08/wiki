import React, {useState} from 'react'
import { Button, Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import CreateGroup from '../components/modals/CreateGroup';
import { USERS_ROUTER, WIKIS_ROUTER } from "../utils/consts";

const Admin = () => {
    const [groupVisible, setGroupVisible] = useState(false)
    const navigator = useNavigate()
    return (
        <Container className="d-flex flex-column">
        <Button 
            variant={"outline-dark"}
            className="mt-4 p-2"
            onClick={()=> setGroupVisible(true)}
        >
            Добавить группу
        </Button>
        <Button 
            variant={"outline-dark"}
            className="mt-4 p-2"
            onClick={()=> navigator(WIKIS_ROUTER)}
        >
            Удалить статью
        </Button>
        <Button
            variant={"outline-dark"}
            className="mt-4 p-2"
            onClick={()=> navigator(USERS_ROUTER)}
        >
            Редактировать пользователей
        </Button>
        <CreateGroup show = {groupVisible} onHide={() => setGroupVisible(false)}/>
       </Container>
    );
};

export default Admin;