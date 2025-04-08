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
    ["A", "B", "Z", "D"],
    ["B", "Z", "Y", "D"],
    ["Y", "D", "B", "Z"],
    ["Z", "A", "D", "Y"],
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

  console.log(frametexture)

  const frame = new Sprite(frametexture.frame)
  
  console.log("frame", frame)
  frame.anchor.set(0.5);
  frame.x = window.innerWidth/2;
  frame.y = window.innerHeight / 2;
  frame.width = 1000;
  frame.height = 700;
  
  const text = new Text({
    text: "PIXI Slot spin",
    style,
  });
  text.x = window.innerWidth / 2 - 400;
  text.y = 40;
  

  console.log("first");

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
        spriteData.x = window.innerWidth / 2 - 240 + i*174
        spriteData.y = window.innerHeight / 2 -220 + j*145
        spriteData.width = 100;
        spriteData.height = 90;
        console.log("SPRITE",i,j,spriteData.y)
        spriteSheet.push(spriteData);
        app.stage.addChild(spriteData);
      }
    }
  }

  setframe()

  spinWheel.on("click", async () => {
    spinWheel.interactive = false;
    const reelHeight = 4 * 145; // Total height of all sprites in a reel (4 sprites * 145px each)
    const spinDuration = 3000;
    const startTime = Date.now();
    const frameBottom = window.innerHeight / 2 + 350; // Frame's bottom boundary
  
    // Group sprites into reels
    let reels: any[] = [];
    for (let i = 0; i < 4; i++) {
      reels.push(spriteSheet.slice(i * 4, (i + 1) * 4));
    }
  
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
  
      reels.forEach((reel, reelIndex) => {
        const reelOffset = (easedProgress * reelHeight * 3) % reelHeight;
        reel.forEach((sprite: any, spriteIndex: number) => {
          const baseY = window.innerHeight / 2 - 200 + spriteIndex * 145;
          sprite.y = baseY + reelOffset;

          console.log(sprite.texture.label, sprite.y)
      
          // Correct wrapping (teleport to top when below frame)
          if (sprite.y > frameBottom) {
            sprite.y -= reelHeight;
          }
        });
        console.log("new",reelIndex)
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Snap to final positions (ensure they stay inside frame)
        reels.forEach((reel) => {
          reel.forEach((sprite: any, spriteIndex: number) => {
            sprite.y = Math.min(
              window.innerHeight / 2 - 200 + spriteIndex * 145,
              frameBottom - 145
            );
          });
        });
        spinWheel.interactive = true;
      }
      
  
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Snap to final positions
        reels.forEach((reel) => {
          reel.forEach((sprite: any, spriteIndex: number) => {
            sprite.y = window.innerHeight / 2 - 200 + spriteIndex * 145;
          });
        });
        spinWheel.interactive = true;
      }
    };
  
    animate();
  });
  app.stage.addChild(frame)
  app.stage.addChild(text);

  app.ticker.add(() => { });
})();
