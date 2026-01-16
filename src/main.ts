import './style.css'
import Alpine from 'alpinejs'

declare global {
  interface Window {
    Alpine: any
  }
}

window.Alpine = Alpine

Alpine.start()
