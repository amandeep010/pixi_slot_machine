import {
  Application,
  Assets,
  BlurFilter,
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

  const reel = [
    ["A", "B", "Z", "D", "Y"],
    ["B", "Z", "Y", "D", "A"],
    ["Y", "D", "B", "Z", "A"],
    ["Z", "A", "D", "Y", "B"],
  ];

  let spriteSheet = [];

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
    ],
  };
  await Assets.init({ manifest });
  // Load a bundle...
  const lowLevelCard = await Assets.loadBundle("low-level-card");

  console.log("lowLevelCard", lowLevelCard);
  // Load another bundle...
  const highLevelCard = await Assets.loadBundle("high-level-card");

  const text = new Text({
    text: "PIXI Slot spin",
    style,
  });
  text.x = window.innerWidth / 2 - 400;
  text.y = 40;
  app.stage.addChild(text);

  console.log("first");

  const reelLength = reel.length;
  for (let i = 0; i < reelLength; i++) {
    const len = reel[i].length;
    for (let j = 0; j < len; j++) {
      const data = reel[i][j];
      const spriteData = new Sprite(
        highCard.includes(data)
          ? highLevelCard[`letter${data}`]
          : lowLevelCard[`letter${data}`]
      );

      //image height = 174
      //image width = 145
      spriteData.anchor.set(0.5);
      spriteData.x = window.innerWidth / 2.4 + i * 110;
      spriteData.y = window.innerHeight / 4 + j * 100;
      spriteData.width = 100;
      spriteData.height = 90;
      spriteSheet.push(spriteData);
      app.stage.addChild(spriteData);
    }
  }

  spinWheel.on("click", async () => {
    spinWheel.interactive = false;
    const reelHeight = 500;
    const spinDuration = 3000;
    const startTime = Date.now();

    // Group sprites into reels
    const reels: any[] = [];
    for (let i = 0; i < 4; i++) {
      reels.push(spriteSheet.slice(i * 5, (i + 1) * 5));
    }

    // Add blur and set initial positions
    spriteSheet.forEach((sprite) => {
      sprite.filters = [new BlurFilter()];
    });

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      reels.forEach((reel, reelIndex) => {
        const reelOffset = easedProgress * reelHeight * (3 + reelIndex * 0.2);
        console.log("data", reelOffset);

        reel.forEach((sprite: any, spriteIndex: number) => {
          const baseY = window.innerHeight / 4 + spriteIndex * 100;
          const newY = (baseY + reelOffset) % reelHeight;
          sprite.y = baseY + newY;

          if (sprite.y > baseY + reelHeight) {
            sprite.y -= reelHeight;
          }
        });
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Snap to final positions
        reels.forEach((reel) => {
          const finalOffset =
            Math.round((easedProgress * reelHeight * 3) / 100) * 100;
          reel.forEach((sprite: any, spriteIndex: number) => {
            sprite.y =
              window.innerHeight / 4 + spriteIndex * 100 + spriteIndex * 110;
            sprite.filters = [];
          });
        });
        spinWheel.interactive = true;
      }
    };

    animate();
  });

  // Listen for animate update
  app.ticker.add(() => {
    // bunny.rotation += 0.1 * time.deltaTime;
  });
})();
