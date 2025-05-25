import React, { useState , useContext}  from "react";
import parse from 'html-react-parser';
import { Button, Card, Form, ToggleButton, ToggleButtonGroup  } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {Context} from '../index';
import { WIKIS_ROUTER } from "../utils/consts";
import { changeText } from "../http/textAPI";
import { Col, Container, Row, ListGroup } from "react-bootstrap";
import GrupBar from "../components/GrupBar";


const RenderText = ({str}) =>{
    return(
        parse(str)
    )
}


const WikiRedact  = () => {
    const {id} = useParams();
    const {text} = useContext(Context);
    const navigator = useNavigate()

    const RedactState = text.texts.find(OneText => OneText.id == id);
   
    const [isRedact, setIsRedact] = useState(true)
    let [title, setTitle] = useState(RedactState.state.title)
    let [redactText, setRedactText] = useState(RedactState.state.text)
    let [activeGroup, setActiveGroup] = useState(RedactState.group)
    
    const save = () =>{
        changeText( RedactState.id ,title,  redactText, activeGroup.id).then(data=> {
            navigator(WIKIS_ROUTER)
        })
    }

    return (
        <Container>
            <Row className="mt-1"> 
                <Col md = {3}>
                    <ListGroup>
                        {text.groups.map(group =>
                            <ListGroup.Item 
                                variant="light"
                                style={{cursor: 'pointer'}}
                                active={group.id === activeGroup.id}
                                onClick = {()=> setActiveGroup(group)}
                                key = {group.id} 
                            >
                                {group.name}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
                <Col md = {9}>
                    <Card
                        style={{borderRadius: 20, marginBottom:20, borderWidth: '5px'}}
                    >
                    <div style={{margin: 30}}>
                        <div className="d-flex" style={{marginBottom: 25}}>
                            <div 
                                style={{marginLeft: 25, fontSize: 25, fontWeight: "lighter"}}
                            >
                                {isRedact?
                                    <b>{title}: </b>
                                :
                                    <Form.Control
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    >
                                    </Form.Control>
                                }   
                            </div>
                            <div style={{marginLeft: "auto"}}>
                                <Button 
                                    variant="outline-success" 
                                    style={{marginRight: 10}}
                                    onClick={() => save()}
                                >
                                    Сохранить
                                </Button>
                                <ToggleButtonGroup  type="radio" name="options" defaultValue={1}>
                                    <ToggleButton
                                        variant="outline-dark"
                                        id="tbg-radio-1"
                                        value={1}
                                        onClick = {()=> setIsRedact(true)}
                                    >
                                    Просмотр
                                    </ToggleButton>
                                    <ToggleButton 
                                        variant="outline-dark"
                                        id="tbg-radio-2"
                                        value={2}
                                        onClick = {()=> setIsRedact(false)}
                                    >
                                        Редактировать
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </div>
                        {isRedact?
                            <RenderText str={redactText}/>
                            :
                            <Form.Control
                                value={redactText}
                                onChange={e => setRedactText(e.target.value)}
                                as="textarea" 
                                rows={30}
                            />
                        }   
                    </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WikiRedact;