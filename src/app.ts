import { Application } from 'pixi.js'
import loadingSlot from './loadingSlot'

// Create a new application
const app = new Application()

// Initialize the application
;(async () => {
  await app.init({
    background: '#090C25',
    resizeTo: window
  })
  await loadingSlot()
})()

export default app
