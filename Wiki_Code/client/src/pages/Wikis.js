import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import GrupBar from "../components/GrupBar"
import StateBar from "../components/StateBar";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchGroup, fetchText } from "../http/textAPI";
import { fetchUsers, fetchAuthUser } from "../http/usersAPI";
import Pages from "../components/Pages";
import { isMark } from "../http/workMarkAPI";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../utils/consts";

const Wikis = observer(() => {
    const { text, user, masMark, users } = useContext(Context);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                // Проверяем авторизацию только если нет данных пользователя
                if (!user.id || !user.isAuth) {
                    await fetchAuthUser()
                        .then(authData => {
                            user.setUser(authData);
                            user.setIsAuth(true);
                            user.setIsAdmin(authData.role === 'ADMIN');
                            user.setId(authData.id);
                        })
                        .catch(error => {
                            if (error.response?.status === 401 || error.response?.status === 404) {
                                user.setUser({});
                                user.setIsAuth(false);
                                user.setIsAdmin(false);
                                user.setId(null);
                                localStorage.removeItem('token');
                                navigate(LOGIN_ROUTE);
                            } else {
                                console.error('Error fetching authenticated user:', error);
                            }
                            throw error;
                        });
                }

                // Загружаем остальные данные
                const [groupsData, usersData] = await Promise.all([
                    fetchGroup(),
                    fetchUsers()
                ]);

                if (groupsData) {
                    text.setGroups(groupsData);
                }

                if (usersData && Array.isArray(usersData)) {
                    users.setUsers(usersData);
                }

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user.isAuth, user.id, navigate, users, text]);

    // Этот useEffect для фильтрации остается прежним, он реагирует на изменение фильтров/пагинации
    useEffect(() => {
        if (!user.isAuth || !user.id) return;

        const loadFilteredData = async () => {
            try {
                const marksData = await isMark(user.id);
                if (marksData) {
                    masMark.marks = marksData;
                }

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
                if (error.response?.status === 401) {
                    user.setUser({});
                    user.setIsAuth(false);
                    user.setIsAdmin(false);
                    user.setId(null);
                    localStorage.removeItem('token');
                    navigate(LOGIN_ROUTE);
                }
            }
        };

        loadFilteredData();
    }, [text.page, text.selectedGroup, text.selectedUser, user.id, user.isAuth, users]);

    if (!user.isAuth && !isLoading) { // Добавил !isLoading, чтобы не мелькало содержимое до проверки
        return null; // Или рендерить что-то другое, пока идет проверка авторизации
    }

    if (isLoading) {
        return (
            <Container>
                <Row className="mt-3">
                    <Col>
                        <div className="text-center">
                            <h4>Загрузка данных...</h4>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="mt-3">
                <Col md={3}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Фильтры</h4>
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