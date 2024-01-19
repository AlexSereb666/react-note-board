import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';

interface ContextProps {
  user: UserStore;
}

export const Context = createContext<ContextProps | null>(null);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Context.Provider
    value={{
      user: new UserStore()
    }}
  >
    <App />
  </Context.Provider>
);
