import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserWiki from './wiki/UserWiki';
import TextWiki from './wiki/TextWiki';
import UsersConteiner from './wiki/UsersConteiner';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    user: new UserWiki(),
    text: new TextWiki(),
    users: new UsersConteiner(),
    masMark: []
  }}>
      <App />
  </Context.Provider>
);

reportWebVitals();
