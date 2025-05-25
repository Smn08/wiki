import { useContext } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import {observer} from "mobx-react-lite";
import {Context} from '../index';

const GrupBar = observer(() => {
    const {text} = useContext(Context)
    return(
        <ListGroup >
            {text.groups.map(group =>
                <ListGroup.Item  
                    variant="light"
                    style={{cursor: 'pointer'}}
                    active={group.id === text.selectedGroup.id}
                    onClick = {()=> {
                        {text.selectedGroup.id != group.id?
                            text.setSelectedGroup(group)
                            :
                            text.setSelectedGroup({})
                        }
                    }}
                    key = {group.id} 
                >
                    {group.name}
                </ListGroup.Item>
            )}
      </ListGroup>
    );
});

export default GrupBar;