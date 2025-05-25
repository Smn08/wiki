import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import ListGroup from 'react-bootstrap/ListGroup';


const Pages = observer(() => {
    const {text} = useContext(Context)
    const pageCount = Math.ceil(text.totalCount / text.limit)
    const pages = []
    for (let i = 0;i < pageCount;i++){
        pages.push(i + 1)
    }


    return (
        
        <ListGroup 
            className="mt-5 d-flex justify-content-center align-items-center"
            horizontal
            style={{marginBottom: 20}}
        >
            {pages.map(page =>
                <ListGroup.Item  
                    variant="light"
                    style={{cursor: 'pointer'}}
                    active = {text.page == page}
                    onClick={() => text.setPage(page)} 
                    key = {page} 
                >
                    {page}
                </ListGroup.Item>
            )}
      </ListGroup>
    )
})

export default Pages;