import React, {useContext} from "react";
import {Card, Image} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {observer} from "mobx-react-lite";
import star_black from "../../img/star_black.png";
import star from "../../img/star.png"
import {Context} from "../../index";
import { LOGIN_ROUTE } from "../../utils/consts";


const StarButton = observer(({mark}) =>{
    const src = mark.isClick? star: star_black;
    const {user} = useContext(Context)
    const navigator = useNavigate()
    return(
        <Card 
            style={{ cursor: 'pointer', borderRadius: 12, margin: '4px 4px 10px 15px', background: '#EBEDF0' } }
            onClick={() => {user.isAuth?mark.setCount(user.id):navigator(LOGIN_ROUTE)}}
       > 
            <div  
                className="d-flex justify-content-center align-items-center" 
                style={{margin: '0px 10px 0px 10px'}}
            >
            <Image 
                src = {src}
                width={22}
                style={{margin: 3}}
            ></Image>
                <div>{mark.count}</div>
            </div>
        </Card>
    )
});

export default StarButton;