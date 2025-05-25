import React, {useContext, useState} from "react";
import { Card, Image, CloseButton, ListGroup, Form } from "react-bootstrap";
import {observer} from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';
import { Context } from "../index";
import DeletePanel from "../components/modals/DeleteModalsUser";
import { LOGIN_ROUTE, USERS_ROUTER, USER_ROUTER } from "../utils/consts";
import { changeUser } from "../http/usersAPI";

const Users = observer(() => {
    const {users, user} = useContext(Context)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [delUserId, setDelUserId] = useState(-1)
    const navigator = useNavigate()

    const resAdmin = (id,role) => {
        if (role){
            changeUser( id,'role', 'ADMIN').then(data=> {
                users.setRole(id,role)
            })
        }else{
            changeUser( id,'role', 'USER').then(data=> {
                users.setRole(id,role)
            })
        }
        if (id == user.id){
            navigator(LOGIN_ROUTE)
        }
    }

    return(
        <Card 
            style={{borderRadius: 20, margin: '0px 80px 0px 80px', backgroundColor: "#EDEEF0"}}
        >
            <ListGroup>
                {users.users.map(OneUser =>
                    <Card 
                        style={{margin: 20,  backgroundColor: "#EDEEF0"}}
                    >
                        <div className="d-flex">
                            <Image
                                src = {process.env.REACT_APP_API_URL + OneUser.user.img}
                                width={90}
                                height={90}
                                roundedCircle
                                style={{margin: 20, cursor: 'pointer' , objectFit: 'cover'}}
                                onClick={() => navigator(USER_ROUTER + '/' + OneUser.user.id)}
                            ></Image>
                            <div className="flex-column">
                                <div
                                    style={{marginTop: '20px', fontSize: 30,cursor: 'pointer', fontWeight: "bold"}}
                                    onClick={() => navigator(USER_ROUTER + '/' + OneUser.user.id)}
                                >
                                    {OneUser.user.fn} {OneUser.user.sn}
                                </div>
                                <div style={{marginLeft: '5px'}}>{OneUser.user.email} </div>
                            </div>
                            {user.isAdmin && user.id != OneUser.id?
                                <div 
                                    style={{margin: '10px 10px 10px auto'}} 
                                    className="d-flex"
                                >
                                    <Form >
                                        <div className="d-flex">
                                            <Form.Label>
                                                Admin
                                            </Form.Label>
                                            <Form.Check
                                                type="switch"
                                                id = {OneUser.user.id}
                                                checked = {OneUser.user.isAdmin}
                                                onClick={() => {
                                                    resAdmin(OneUser.user.id,!OneUser.user.isAdmin)
                                                }}
                                                style={{marginLeft: 5}}
                                            />
                                        </div>
                                    </Form>
                                    <CloseButton
                                        onClick={()=> {
                                            setDeleteVisible(true)
                                            setDelUserId(OneUser.id)
                                        }}
                                        style={{marginLeft: 10}}
                                    ></CloseButton>
                                </div>
                                :
                                <b/>
                            }  
                        </div>
                        <DeletePanel 
                            show = {deleteVisible} 
                            onHide={() => setDeleteVisible(false)} 
                            id={delUserId}
                        />
                    </Card>
                )}   
            </ListGroup>
        </Card>
    );
});

export default Users;