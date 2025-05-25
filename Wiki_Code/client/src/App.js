import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar'
import { Context } from './index';
import { check } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import { fetchUsers } from './http/usersAPI';

const  App = () => {
  const {user, users} = useContext(Context)
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
      fetchUsers().then(data => {
        users.setUsers(data)
        check().then(data=> {
          user.setUser(data)
          user.setIsAuth(true)
          user.setId(data.id)
          user.setImg(users.img(user.id))
          user.setIsAdmin(data.role == 'ADMIN')
        }).finally(()=> setLoading(false))
      });
    }, [])
    
  if (loading){
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style = {{height: window.innerHeight}}
      >
        <Spinner animation="border" variant="dark"/>
      </div>
    )
  }




  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
