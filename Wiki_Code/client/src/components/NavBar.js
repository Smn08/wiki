import React, { useContext } from "react";
import {Navbar, Image, Nav, Container} from 'react-bootstrap';
import {observer} from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';
import { Context } from "../index";
import I from "../img/I.png"
import { ADMIN_ROUTE, LOGIN_ROUTE, USERS_ROUTER, USER_ROUTER, WIKIS_ROUTER } from "../utils/consts";

const SetNav = observer(() => {
    const {user} = useContext(Context)
    const navigator = useNavigate()

    const logOut = () =>{
        user.setUser(false)
        user.setIsAdmin(false)
        user.setIsAuth(false)
        user.setId(0)
        navigator(LOGIN_ROUTE)
    }
    
    if (user.isAuth){
        return(
            <Nav 
                className="ml-auto" 
                style={{fontWeight:  'bold', fontSize: 20}}
            >
                {user.isAdmin?
                    <Nav.Link
                        onClick={()=> navigator(ADMIN_ROUTE)}
                    >
                        Админ панель
                    </Nav.Link>
                    :<b/>
                }
                <Nav.Link
                    onClick={()=> navigator(USER_ROUTER + '/' + user.id)}
                >
                    Профиль
                </Nav.Link>
                <Nav.Link
                    onClick={()=> navigator(WIKIS_ROUTER)}
                >
                    Статьи
                </Nav.Link>
                <Nav.Link
                    onClick={()=> navigator(USERS_ROUTER)}
                >
                    Пользователи
                </Nav.Link>
                <Nav.Link
                    onClick={()=> logOut()}
                >
                    Выход
                </Nav.Link>
            </Nav>
            )
    }else{
        return (
            <Nav 
                className="ml-auto"
                style={{fontWeight:  'bold', fontSize: 20}}
            >
                <Nav.Link 
                    onClick={() => navigator(LOGIN_ROUTE)}
                >
                    Авторизация
                </Nav.Link>
            </Nav>
        )
    }
});

const NavBar = () => {
    const navigator = useNavigate()
    return (
        <Navbar 
            color="white"
            style={{boxShadow:"1px 1px 7px black", marginBottom: "40px"}}
        >
            <Container>
                <Navbar.Brand>
                    <Image
                        src= {I}
                        alt="Business IT"
                        height= "70"
                        rounded 
                        onClick={()=> navigator(WIKIS_ROUTER)}
                        style={{cursor: 'pointer'}}
                    />
                </Navbar.Brand>
                <SetNav />
            </Container>
        </Navbar>
    )
}

export default NavBar;