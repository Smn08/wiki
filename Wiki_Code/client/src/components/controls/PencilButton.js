import React, { useContext } from "react";
import {Card, Image} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import pencil from "../../img/pencil.png";
import { LOGIN_ROUTE, REDACT_ROUTER } from "../../utils/consts";
import {Context} from "../../index";

const PencilButton = ({idState}) =>{
    const navigator = useNavigate()
    const {user} = useContext(Context)
    return(
        <Card  
            className="d-flex justify-content-center align-items-center"
            style={{ cursor: 'pointer', borderRadius: 12, margin: '4px 4px 10px 0px', background: '#EBEDF0', width: 50 } }
            onClick={() => {user.isAuth? navigator(REDACT_ROUTER + "/" + idState): navigator(LOGIN_ROUTE)}}
        > 
            <Image 
                src= {pencil}
                width={22}
            ></Image>
        </Card>
    )
};

export default PencilButton;