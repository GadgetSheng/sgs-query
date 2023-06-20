import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import VConsole from 'vconsole';
import './index.css'
import 'virtual:uno.css';

const vConsole=new VConsole();
window.addEventListener('destroy',()=>{
  vConsole.destroy();
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
