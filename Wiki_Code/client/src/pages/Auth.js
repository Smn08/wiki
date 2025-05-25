import React, {useContext, useState} from "react";
import { Button, Container, Form, Col, Row, Card} from "react-bootstrap";
import { NavLink, useLocation , useNavigate} from "react-router-dom";
import { observer } from "mobx-react-lite";
import { REGISTRATION_ROUTER, LOGIN_ROUTE, WIKIS_ROUTER } from "../utils/consts";
import { registration , login} from "../http/userAPI";
import {Context} from "../index"

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE

    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigator = useNavigate()


    const click = async () => {
        let data;
        try{
            if (isLogin){
                data = await login(email,password);
            }else{
                data = await registration(email,password);
            }
            console.log(data)
            user.setUser(data)
            user.setIsAuth(true)
            user.setIsAdmin(data.role == 'ADMIN')
            user.setId(data.id)
            navigator(WIKIS_ROUTER)
        }catch(e){
            alert(e.response.data.message)
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style = {{height: window.innerHeight - 160}}
        >
            <Card style = {{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin?'Авторизация':'Регистрация'}</h2>
                <Form className = "d-flex flex-column">
                    <Form.Control
                        className = "mt-3"
                        value={email}
                        onChange={e=> setEmail(e.target.value)}
                        placeholder = "Введите ваш email..."
                    />
                    <Form.Control
                        className = "mt-3"
                        placeholder = "Введите ваш пароль..."
                        value={password}
                        onChange={e=> setPassword(e.target.value)}
                        type = "password"
                    />
                    <Row>
                        <Col className="d-flex justify-content-between mt-3 pl-3 pr-3">
                            {isLogin?
                                <div>Нет аккаунта? <NavLink to = {REGISTRATION_ROUTER}>Зарегистрируйся!</NavLink></div>
                                :<div>Есть аккаунт? <NavLink to = {LOGIN_ROUTE}>Войдите!</NavLink></div>
                            }
                            <Button 
                                variant={"outline-success"}
                                onClick={()=> click()}
                            >
                                {isLogin?'Войти':'Регистрация'}
                            </Button>
                        </Col>
                    </Row>

                </Form>
            </Card>
        </Container>
    );
});

export default Auth;