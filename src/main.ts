import {
  Application,
  Assets,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const reels = [
    ["A", "B", "Z", "D", "A"],
    ["B", "Z", "Y", "D", "D"],
    ["Y", "D", "B", "Z", "B"],
    ["Z", "A", "D", "Y", "A"],
    ["Z", "A", "D", "Y", "A"],
    ["Z", "A", "D", "Y", "A"] 
  ];

  let spriteSheet: Sprite[] = [];

  const lowCard = ["A", "B", "C", "D", "E"];
  const highCard = ["W", "X", "Y", "Z"];

  const style = new TextStyle({
    fill: "#ffffff",
    fillGradientType: 1,
    fontFamily: "Courier New",
    fontSize: 80,
    //@ts-ignore
    fontWeight: 900,
    miterLimit: 33,
    //@ts-ignore
    padding: "",
    stroke: "#608de6",
    strokeThickness: 28,
  });

  //Spin wheel as a text ===> as begin
  const spinWheel = new Text({
    text: "Begin",
    style,
  });
  spinWheel.x = window.innerWidth / 8;
  spinWheel.y = window.innerHeight / 2;
  spinWheel.cursor = "pointer";
  spinWheel.interactive = true;

  //adding spin wheel to staging
  app.stage.addChild(spinWheel);

  //menifest file to load all images
  const manifest = {
    bundles: [
      {
        name: "low-level-card",
        assets: [
          { alias: "letterA", src: "./assets/GreenA.png" },
          { alias: "letterB", src: "./assets/GreenB.png" },
          { alias: "letterC", src: "./assets/GreenC.png" },
          { alias: "letterD", src: "./assets/GreenD.png" },
          { alias: "letterE", src: "./assets/GreenE.png" },
        ],
      },
      {
        name: "high-level-card",
        assets: [
          { alias: "letterW", src: "./assets/RedW.png" },
          { alias: "letterX", src: "./assets/RedX.png" },
          { alias: "letterY", src: "./assets/RedY.png" },
          { alias: "letterZ", src: "./assets/RedZ.png" },
        ],
      },
      {
        name: "frame",
        assets: [
          { alias: "frame", src: "./assets/frame.png" }
        ],
      },
    ],
  };
  await Assets.init({ manifest });
  // Load a bundle...
  const lowLevelCard = await Assets.loadBundle("low-level-card");

  // Load another bundle...
  const highLevelCard = await Assets.loadBundle("high-level-card");
  const frametexture = await Assets.loadBundle("frame");

  const frame = new Sprite(frametexture.frame)
  
  frame.anchor.set(0.5);
  frame.x = window.innerWidth/2;
  frame.y = window.innerHeight / 2;
  frame.width = 3000;
  frame.height = 1500;
  
  const text = new Text({
    text: "PIXI Slot spin",
    style,
  });
  text.x = window.innerWidth / 2 - 400;
  text.y = 40;
  

  const setframe = () => {
    for (let i = 0; i < reels.length; i++) {
      const len = reels[i].length;
      for (let j = 0; j < len; j++) {
        const data = reels[i][j];
        const spriteData = new Sprite(
          highCard.includes(data)
            ? highLevelCard[`letter${data}`]
            : lowLevelCard[`letter${data}`]
        );
  
        //image height = 174
        //image width = 145
        spriteData.anchor.set(0.5);
        spriteData.x = window.innerWidth / 4 + i*600
        spriteData.y = window.innerHeight / 2 -500 + j*250
        spriteData.width = 300;
        spriteData.height = 200;
        spriteSheet.push(spriteData);
        app.stage.addChild(spriteData);
      }
    }
  }

  setframe()

  spinWheel.on("click", async () => {
    spinWheel.interactive = false;
    const reelHeight = window.innerHeight/2 -100; // Total height of all sprites in a reel (4 sprites * 145px each)
    const spinDuration = 3000;
    const startTime = Date.now();
    const frameBottom = window.innerHeight/2 + 550// Frame's bottom boundary
  
    // Group sprites into reels
    let reels: any[] = [];
    for (let i = 0; i < 6; i++) {
      reels.push(spriteSheet.slice(i * 5, (i + 1) * 5));
    }
  
    const animateSpin = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      const animate = ()=>{
        reels.forEach((reel) => {
          reel.forEach((sprite: any) => {
            sprite.y += 200
            if (sprite.y > frameBottom) {
              sprite.y -= reelHeight;
            }
          });
        })}
      
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        reels.forEach((reel) => {
          reel.forEach((sprite: any, spriteIndex: number) => {
            sprite.y = window.innerHeight / 2 -500 + spriteIndex*250
              frameBottom - 145
          });
        });
        spinWheel.interactive = true;
        return "Done Spin"
      }
    };
    app.ticker.add(animateSpin)
  });
  app.stage.addChild(text);

  app.ticker.add((tick) => { 
    console.log("tick", tick)
  });
})();
