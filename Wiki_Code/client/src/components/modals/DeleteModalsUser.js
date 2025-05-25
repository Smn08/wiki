import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { delText } from '../../http/textAPI';
import { useContext } from 'react';
import { Context } from '../../index';
import { deleteUser } from '../../http/usersAPI';

const DeletePanel = ({show, onHide, id}) =>{
  
  const Delete = async () =>{
    await deleteUser(id)
    onHide()
  }

  return (
    <Modal
      show = {show}
      onHide={onHide}
    >
        <Modal.Header closeButton>
          <Modal.Title style={{color: "red"}}>Удалить пользователя</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p> Вы действительно хотите удалить пользователя?
            <br/> Удаление пользователя приведет к удалению его статей.
              <br/>Отменить это действие будет невозможно.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Закрыть</Button>
          <Button variant="primary" onClick={()=> Delete()}>Удалить</Button>
        </Modal.Footer>
      </Modal>
  );
};

export default DeletePanel;