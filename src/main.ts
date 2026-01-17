import './style/main.css'
import './style/cards.css'
import Alpine from 'alpinejs'

// Import cardsJS - it usually needs jQuery
import $ from 'jquery'
import 'cardsJS'

declare global {
  interface Window {
    Alpine: any
    $: any
    jQuery: any
  }
}

window.Alpine = Alpine
window.$ = window.jQuery = $

Alpine.start()
