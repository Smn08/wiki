import { useContext, useState } from 'react';
import { Card, Form, ToggleButton, ToggleButtonGroup  } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Context } from '../../index';
import parse from 'html-react-parser';
import { changeUser } from '../../http/usersAPI';
import { changePassword, setImg } from '../../http/userAPI';

const RenderText = ({str}) =>{
  return(
      parse(str)
  )
}

const RedactUser = ({ show, onHide , user}) => {

  
  const [fName, setFName] = useState(user.fn)
  const [sName, setSName] = useState(user.sn)
  const [email, setEmail] = useState(user.email)
  const [text, setText] = useState(user.text)
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('Пароль')
  const [textRedact, setTextRedact] = useState(true)

  const selectFile = e =>{
    setFile(e.target.files[0])
  }

  const savePassword = async () =>{
     await changePassword(user.id, password).then(alert("Пароль успешно изменен"))
  }

  const save = async () => {
    if (fName != user.fn){
      await changeUser(user.id, 'fn', fName).then(user.setFn(fName))
    }
    if (sName != user.sn){
      await changeUser(user.id, 'sn', sName).then(user.setSn(sName))
    }
    if (email != user.email){
      await changeUser(user.id, 'email', email).then(user.setEmail(email))
    }
    if (text != user.text){
      await changeUser(user.id, 'text', text). then(user.setText(text))
    }
    if (file != null){
      const img = new FormData()
      img.append('img', file)
      await setImg(user.id, img)
    }
    
    onHide()
  }


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Изменение профиля
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className='d-flex' >
            <Form.Control
              style={{margin: "10px 0px 10px 5px", borderColor: 'black'}}
              onChange={e => setFName(e.target.value)}
              placeholder= {fName}
            />
            <Form.Control
              style={{margin: "10px 0px 10px 5px" , borderColor: 'black'}}
              onChange={e => setSName(e.target.value)}
              placeholder= {sName}
            />
          </div>
          <Form.Control 
            style={{borderColor: 'black'}}
            className='m-1'
            onChange={e => setEmail(e.target.value)}
            placeholder= {email}
          />
          <div className='d-flex'>
            <Button
              variant="outline-dark"
              style={{margin: '10px 0px 0px 3px',width:"30%" }}
              onClick={() => savePassword()}
              
            >
              <div>Изменить пароль</div>
            </Button>
            <Form.Control
              style={{margin: '10px 0px 0px 3px'}}
              placeholder= {password}
              type='password'
              onChange={e => setPassword(e.target.value)}
            >

            </Form.Control>
          </div>

          <Form.Control 
            style={{borderColor: 'black', margin: '13px 0px 0px 3px'}}
            type='file' 
            onChange={selectFile}
          />
          <hr/>
          <div 
            className='d-flex'
                style={{fontWeight: "bold", margin: '0px 10px 0px 30px', fontSize: 30}}
          >
              О себе:
              <ToggleButtonGroup style={{marginLeft: 'auto'}} type="radio" name="options" defaultValue={1}>
                <ToggleButton
                  variant="outline-dark"
                  id="tbg-radio-1"
                  value={1}
                  onClick = {()=> setTextRedact(true)}
                >
                  Просмотр
                </ToggleButton>
                <ToggleButton 
                  variant="outline-dark"
                  id="tbg-radio-2"
                  value={2}
                  onClick = {()=> setTextRedact(false)}
                >
                  Редактировать
                </ToggleButton>
              </ToggleButtonGroup>
          </div>
            <Card className='mt-1'>
            {textRedact?
              <div style={{margin:5}}>
                <RenderText str={text}/>
              </div>
              :
              <Form.Control
              value={text}
              onChange={e => setText(e.target.value)}
              as="textarea" 
              rows={30}
              />
            }  
            </Card>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-danger"
          onClick={onHide}
        >
          Отмена
        </Button>
        <Button
          variant="outline-success"
          onClick={() => save()}
        >
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RedactUser;