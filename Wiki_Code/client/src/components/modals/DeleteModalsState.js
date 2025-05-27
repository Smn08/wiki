import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { delText } from '../../http/textAPI';
import { useContext } from 'react';
import { Context } from '../../index';

const DeletePanel = ({ show, onHide, id, userId }) => {
    const { text, user } = useContext(Context);
    const canDelete = user.isAdmin || (user.isAuth && user.id === userId);

    const Delete = async () => {
        try {
            await delText(id);
            text.delTextId(id);
            onHide();
        } catch (error) {
            console.error('Error deleting article:', error);
            if (error.response?.status === 403) {
                alert('У вас нет прав на удаление этой статьи');
            } else {
                alert('Произошла ошибка при удалении статьи');
            }
        }
    };

    if (!canDelete) {
        return null;
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title style={{color: "red"}}>Удалить статью</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Вы действительно хотите удалить статью?
                    <br/>Отменить это действие будет невозможно.</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Закрыть</Button>
                <Button variant="danger" onClick={Delete}>Удалить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeletePanel;