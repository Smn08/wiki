import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import GrupBar from "../components/GrupBar"
import StateBar from "../components/StateBar";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchGroup, fetchText } from "../http/textAPI";
import { fetchUsers } from "../http/usersAPI";
import Pages from "../components/Pages";
import { isMark } from "../http/workMarkAPI";

const Wikis = observer(() => {
    var {text, user, masMark} = useContext(Context)

    useEffect(()=>{
        isMark(user.id).then(data=> masMark = data)
        fetchGroup().then(data => text.setGroup(data))

        fetchText(null,null, 1,text.limit).then(data => {
            text.setText(data.rows, masMark)
            text.setTotalCount(data.count)              
        })

    }, [])

    useEffect(() => {

        isMark(user.id).then(data=> masMark = data)

        fetchText(text.selectedGroup.id,text.selectedUser.id, text.page,text.limit ).then(data => {
            text.setText(data.rows, masMark)
            text.setTotalCount(data.count) 
        })
    }, [text.page,text.selectedGroup, text.selectedUser])

    return (
        <Container>
            <Row className="mt-1"> 
                <Col md = {3}>
                    <GrupBar/>
                </Col>
                <Col md = {9} >
                    <StateBar/>
                    <Pages/>
                </Col>
            </Row>
        </Container>
    );
});

export default Wikis;