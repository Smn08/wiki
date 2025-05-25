import React, {useContext, useState} from "react";
import { Button, Card,Image } from "react-bootstrap";
import { useNavigate,  useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { WIKIS_ROUTER } from "../utils/consts";
import { Context } from "../index";
import RedactUser from "../components/modals/RedactUser";

const RenderText = ({str}) =>{
    return(
        parse(str)
    )
}

const UserPage = () => {
    const {users, user, text} = useContext(Context)

    const {id} = useParams();
    const userProfil = users.users.find(user => user.id == id).user;
    const navigator = useNavigate()
    const [redact,setRedact] = useState(false);
    const isMyProfil = user.id == id;

    return (
        <Card
            style={{borderRadius: 20, margin: '0px 80px 0px 80px', borderWidth: '5px'}}
        >
            <div className="d-flex">
                <Image
                    style={{margin: 50, objectFit: 'cover'}}
                    src = {process.env.REACT_APP_API_URL + userProfil.img}
                    width={300}
                    height={300}
                    roundedCircle
                ></Image>
                <div className="d-flex_column" style={{fontWeight: "bold"}}>
                    <div
                        className="d-flex"
                        style={{margin: '150px 10px 0px 0px', fontSize: 30}}
                    >
                        {userProfil.user.fn} {userProfil.user.sn}
                    </div>
                    <div 
                        style={{margin: '0px 10px 0px 5px', fontSize: 15}}
                    >
                        {userProfil.user.email}
                    </div>
                </div>
                <div style={{marginTop: 10, marginLeft: "auto"}}>
                    {isMyProfil?
                        <Button 
                            style={{marginRight: 10}}
                            variant={"outline-dark"}
                            onClick={()=> setRedact(true)}
                        >
                            Редактировать профиль
                        </Button>
                        :
                        <b/>
                    }
                    <Button
                        style={{marginRight: 10}}
                        variant={"outline-dark"}
                        onClick={()=> {
                            text.setSelectedUser(userProfil)
                            navigator(WIKIS_ROUTER)
                        }}
                    >
                        Статьи
                    </Button>
                </div>
            </div>
            <div 
                style={{fontWeight: "bold", margin: '0px 10px 0px 30px', fontSize: 30}}
            >
                О себе:
            </div>
            <div style={{margin: 15}}>
                <RenderText str= {userProfil.text}/>
            </div>
            <RedactUser 
                user = {userProfil}
                show = {redact} 
                onHide={() => setRedact(false)}
            />
        </Card>
    );
};

export default UserPage;