import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style/main.css'
import './style/cards.css'

declare global {
  interface Window {
    $: any
    jQuery: any
  }
}

// jQuery requirement for cardsJS
import $ from 'jquery'
window.$ = window.jQuery = $
import 'cardsJS'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
