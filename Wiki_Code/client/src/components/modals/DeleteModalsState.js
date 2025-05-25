import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { delText } from '../../http/textAPI';
import { useContext } from 'react';
import { Context } from '../../index';

const DeletePanel = ({show, onHide, id}) =>{
  const {text} = useContext(Context)
  const Delete = async () =>{
    await delText(id).then(data=> {
      text.delTextId(id)
      onHide()
    }
  )}

  return (
    <Modal
      show = {show}
      onHide={onHide}
    >
        <Modal.Header closeButton>
          <Modal.Title style={{color: "red"}}>Удалить статью</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p> Вы действительно хотите удалить статью?
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