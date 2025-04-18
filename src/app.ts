import { Application } from "pixi.js";
import InitialGameSetup from "./InitialGameSetup";

// Create a new application
const app = new Application();

// Initialize the application
(async()=>{
  await app.init({ background: "#090C25", resizeTo: window });
  await InitialGameSetup();
})()

export default app
