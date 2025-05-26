import React, { useContext, useEffect } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import GrupBar from "../components/GrupBar"
import StateBar from "../components/StateBar";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchGroup, fetchText } from "../http/textAPI";
import { fetchUsers } from "../http/usersAPI";
import Pages from "../components/Pages";
import { isMark } from "../http/workMarkAPI";
import { useNavigate } from "react-router-dom";
import { REDACT_ROUTER } from "../utils/consts";

const Wikis = observer(() => {
    const { text, user, masMark } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [marksData, groupsData, usersData] = await Promise.all([
                    isMark(user.id),
                    fetchGroup(),
                    fetchUsers()
                ]);
                
                // Обновляем состояние
                if (marksData) {
                    masMark.marks = marksData;
                }
                text.setGroups(groupsData);
                text.setUsers(usersData);

                // Загружаем все статьи при первой загрузке
                const textsData = await fetchText(null, null, 1, text.limit);
                text.setText(textsData.rows, masMark.marks);
                text.setTotalCount(textsData.count);
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const loadFilteredData = async () => {
            try {
                const marksData = await isMark(user.id);
                if (marksData) {
                    masMark.marks = marksData;
                }

                // Загружаем статьи с учетом фильтров
                const textsData = await fetchText(
                    text.selectedGroup.id,
                    text.selectedUser.id,
                    text.page,
                    text.limit
                );
                text.setText(textsData.rows, masMark.marks);
                text.setTotalCount(textsData.count);
            } catch (error) {
                console.error('Error loading filtered data:', error);
            }
        };

        loadFilteredData();
    }, [text.page, text.selectedGroup, text.selectedUser]);

    return (
        <Container>
            <Row className="mt-3">
                <Col md={3}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Фильтры</h4>
                        {user.isAuth && (
                            <Button
                                variant="primary"
                                onClick={() => navigate(REDACT_ROUTER + '/0')}
                            >
                                Создать статью
                            </Button>
                        )}
                    </div>
                    <GrupBar />
                </Col>
                <Col md={9}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Все статьи</h4>
                    </div>
                    <StateBar />
                    <Pages />
                </Col>
            </Row>
        </Container>
    );
});

export default Wikis;