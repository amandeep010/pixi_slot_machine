import { Assets, Graphics, Sprite, Text } from 'pixi.js'
import app from './app'
import { highCard, reels, style, betStyle, winStyle, winAmountStyle } from './helper/Helper'
import { RotateSlots } from './RotateSlots'

const InitialGameSetup = async () => {
  // Append the application canvas to the document body
  document.getElementById('pixi-container')!.appendChild(app.canvas)

  let spriteSheet: Sprite[] = []
  let currentBetAmount = 10.0
  let totalWins = 0
  let credit = 0
  const changeAmount = 1
  let newReel: any

  //Spin wheel as a text ===> as begin
  const buyFreeSpin = new Text({
    text: 'Buy \nfree \nSpin',
    style
  })

  buyFreeSpin.x = window.innerWidth / 10
  buyFreeSpin.y = window.innerHeight / 2
  buyFreeSpin.cursor = 'pointer'
  buyFreeSpin.interactive = true

  //adding spin wheel to staging
  app.stage.addChild(buyFreeSpin)

  //menifest file to load all images
  const manifest = {
    bundles: [
      {
        name: 'low-level-card',
        assets: [
          { alias: 'letterA', src: './assets/GreenA.png' },
          { alias: 'letterB', src: './assets/GreenB.png' },
          { alias: 'letterC', src: './assets/GreenC.png' },
          { alias: 'letterD', src: './assets/GreenD.png' },
          { alias: 'letterE', src: './assets/GreenE.png' }
        ]
      },
      {
        name: 'high-level-card',
        assets: [
          { alias: 'letterW', src: './assets/RedW.png' },
          { alias: 'letterX', src: './assets/RedX.png' },
          { alias: 'letterY', src: './assets/RedY.png' },
          { alias: 'letterZ', src: './assets/RedZ.png' }
        ]
      },
      {
        name: 'buttons',
        assets: [
          { alias: 'wheel', src: './assets/wheel.png' },
          { alias: 'plus', src: './assets/plus.png' },
          { alias: 'minus', src: './assets/minus.png' }
        ]
      },
      {
        name: 'images',
        assets: [{ alias: 'credit', src: './assets/credit.png' }]
      }
    ]
  }
  await Assets.init({ manifest })

  // Load a bundle...
  const lowLevelCard = await Assets.loadBundle('low-level-card')

  // Load another bundle...
  const highLevelCard = await Assets.loadBundle('high-level-card')
  const buttonTexture = await Assets.loadBundle('buttons')
  const loadImages = await Assets.loadBundle('images')

  const text = new Text({
    text: 'PIXI Slot spin',
    style
  })
  text.x = window.innerWidth / 2 - 400
  text.y = 40

  const setframe = () => {
    for (let i = 0; i < reels.length; i++) {
      const len = reels[i].length
      for (let j = 0; j < len; j++) {
        const data = reels[i][j]
        const spriteData = new Sprite(
          highCard.includes(data) ? highLevelCard[`letter${data}`] : lowLevelCard[`letter${data}`]
        )

        //image height = 174
        //image width = 145
        spriteData.anchor.set(0.5)
        spriteData.x = window.innerWidth / 4 + i * 600
        spriteData.y = window.innerHeight / 2 - 500 + j * 250
        spriteData.width = 300
        spriteData.height = 200
        spriteSheet.push(spriteData)
        app.stage.addChild(spriteData)
      }
    }
  }

  setframe()

  buyFreeSpin.on('click', async () => {
    alert(':) have not added screen yet')
  })

  //add line
  let line = new Graphics()
    .moveTo(0, window.innerHeight - 400)
    .lineTo(window.innerWidth, window.innerHeight - 400)
    .stroke({ color: 0xb96c3f, pixelLine: true })

  app.stage.addChild(line)

  //wheel button to rotate spin
  const spinWheel = new Sprite(buttonTexture.wheel)
  spinWheel.anchor.set(0.5)
  spinWheel.x = window.innerWidth - 1000
  spinWheel.y = window.innerHeight - 400
  spinWheel.height = 300
  spinWheel.width = 300
  spinWheel.interactive = true
  spinWheel.on('click', async () => {
    const array = await RotateSlots(spinWheel, newReel ? newReel : spriteSheet)
    newReel = []
    newReel = array
  })
  app.stage.addChild(spinWheel)

  //total bet
  const total = new Text({
    text: `TOTAL BET`,
    style: betStyle
  })
  total.x = window.innerWidth - 650
  total.y = window.innerHeight - 350
  app.stage.addChild(total)

  //bet amout between plus and minus
  const betAmount = new Text({
    text: `${currentBetAmount}`,
    style: betStyle
  })
  betAmount.x = window.innerWidth - 500
  betAmount.y = window.innerHeight - 250
  app.stage.addChild(betAmount)

  //   //image credit
  const creditImage = new Sprite(loadImages.credit)
  creditImage.x = window.innerWidth / 2 - 1100
  creditImage.y = window.innerHeight - 200
  creditImage.anchor.set(0.5)
  creditImage.height = 150
  creditImage.width = 150
  app.stage.addChild(creditImage)

  //balance credit remaining
  const creditText = new Text({
    text: `CREDIT\n$${credit}`,
    style: winAmountStyle
  })
  creditText.x = window.innerWidth / 2 - 1000
  creditText.y = window.innerHeight - 300
  app.stage.addChild(creditText)

  //Win text
  const win = new Text({
    text: 'WIN:',
    style: winStyle
  })
  win.x = window.innerWidth / 2
  win.y = window.innerHeight - 300
  app.stage.addChild(win)

  //Win amount
  const winAmount = new Text({
    text: `$${totalWins}`,
    style: winAmountStyle
  })
  winAmount.x = window.innerWidth / 2 + 200
  winAmount.y = window.innerHeight - 300
  app.stage.addChild(winAmount)

  //plus button
  const plus = new Sprite(buttonTexture.plus)
  plus.anchor.set(0.5)
  plus.x = window.innerWidth - 750
  plus.y = window.innerHeight - 250
  plus.height = 150
  plus.width = 150
  plus.interactive = true
  plus.on('click', () => {
    if (currentBetAmount + changeAmount > 100) {
      alert('max bet limit is $100.')
      return
    }
    currentBetAmount += changeAmount
    betAmount.text = `${currentBetAmount}`
  })
  app.stage.addChild(plus)

  //minus button
  const minus = new Sprite(buttonTexture.minus)
  minus.anchor.set(0.5)
  minus.x = window.innerWidth - 250
  minus.y = window.innerHeight - 250
  minus.height = 150
  minus.width = 150
  minus.interactive = true
  minus.on('click', () => {
    if (currentBetAmount - 1 < 0.2) {
      alert('minimum bet amount is $0.20')
      return
    }
    currentBetAmount -= 1
    betAmount.text = `${currentBetAmount}`
  })
  app.stage.addChild(minus)

  app.stage.addChild(text)

  app.ticker.add(() => app.renderer.resize(window.innerWidth, window.innerHeight))
}

export default InitialGameSetup
