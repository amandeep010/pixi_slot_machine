import { Sprite, TextStyle } from 'pixi.js'
import { spriteSheet } from '../loadingSlot'
import app from '../app'

//static variables are includede here.
export const reels = [
  ['A', 'B', 'Z', 'D', 'A'],
  ['B', 'Z', 'Y', 'D', 'D'],
  ['Y', 'D', 'B', 'Z', 'B'],
  ['Z', 'A', 'D', 'Y', 'A'],
  ['Z', 'A', 'D', 'Y', 'A'],
  ['Z', 'A', 'D', 'Y', 'A']
]

export const paylineArray = [
  ["02", "12", "22", "32", "42", "52"]
]

export const frameBottom = window.innerHeight / 2 + 550 // Frame's bottom boundary

export const lowCard = ['A', 'B', 'C', 'D', 'E']
export const highCard = ['W', 'X', 'Y', 'Z']

export const setframe = (lowLevelCard: any, highLevelCard: any) => {
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
      spriteData.x = window.innerWidth / 4 + i * 450 + 300
      spriteData.y = window.innerHeight / 2 - 500 + j * 250
      spriteData.width = 300
      spriteData.height = 200
      spriteSheet.push(spriteData)
      app.stage.addChild(spriteData)
    }
  }
}

export const style = new TextStyle({
  fill: '#ffffff',
  fillGradientType: 1,
  fontFamily: 'Courier New',
  fontSize: 150,
  //@ts-ignore
  fontWeight: 600,
  miterLimit: 33,
  //@ts-ignore
  padding: '',
  stroke: '#608de6',
  strokeThickness: 28
})

export const betStyle = new TextStyle({
  fill: '#ffffff',
  fillGradientType: 1,
  fontFamily: 'Tahoma',
  fontSize: 50,
  //@ts-ignore
  fontWeight: 300,
  miterLimit: 33,
  //@ts-ignore
  padding: '',
  stroke: '#608de6'
})

export const winStyle = new TextStyle({
  fill: '#ecbb09',
  fillGradientType: 1,
  fontFamily: 'Comic Sans MS',
  fontSize: 62,
  //@ts-ignore
  fontWeight: 600,
  miterLimit: 33,
  //@ts-ignore
  padding: '',
  stroke: '#608de6'
})

export const winAmountStyle = new TextStyle({
  fill: '#ffffff',
  fillGradientType: 1,
  fontFamily: 'Comic Sans MS',
  fontSize: 62,
  // @ts-ignore
  fontWeight: 600,
  miterLimit: 33,
  // @ts-ignore
  padding: '',
  stroke: '#608de6'
})
