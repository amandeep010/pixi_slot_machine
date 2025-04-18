import { TextStyle } from "pixi.js";

//static variables are includede here.
export const reels = [
      ["A", "B", "Z", "D", "A"],
      ["B", "Z", "Y", "D", "D"],
      ["Y", "D", "B", "Z", "B"],
      ["Z", "A", "D", "Y", "A"],
      ["Z", "A", "D", "Y", "A"],
      ["Z", "A", "D", "Y", "A"] 
];

export const lowCard = ["A", "B", "C", "D", "E"];
export const highCard = ["W", "X", "Y", "Z"];

export const style = new TextStyle({
      fill: "#ffffff",
      fillGradientType: 1,
      fontFamily: "Courier New",
      fontSize: 150,
      //@ts-ignore
      fontWeight: 900,
      miterLimit: 33,
      //@ts-ignore
      padding: "",
      stroke: "#608de6",
      strokeThickness: 28,
});

export const betStyle = new TextStyle({
    fill: "#ffffff",
    fillGradientType: 1,
    fontFamily: "Tahoma",
    fontSize: 62,
    //@ts-ignore
    fontWeight: 300,
    miterLimit: 33,
    //@ts-ignore
    padding: "",
    stroke: "#608de6"
});

export const winStyle = new TextStyle({
    fill: "#ecbb09",
    fillGradientType: 1,
    fontFamily: "Comic Sans MS",
    fontSize: 62,
    //@ts-ignore
    fontWeight: 600,
    miterLimit: 33,
    //@ts-ignore
    padding: "",
    stroke: "#608de6"
});

export const winAmountStyle = new TextStyle({
    fill: "#ffffff",
    fillGradientType: 1,
    fontFamily: "Comic Sans MS",
    fontSize: 62,
    // @ts-ignore
    fontWeight: 600,
    miterLimit: 33,
    // @ts-ignore
    padding: "",
    stroke: "#608de6"
});

