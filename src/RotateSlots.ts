import app from './app'
import { Sprite } from 'pixi.js'
import { frameBottom, paylineArray } from './helper/Helper'
import { zoomOperation } from './types/basicType'

export const newReel: Sprite[][] = []
const zoomIn = () => animateImage('zoomIn')
const zoomOut = () => animateImage('zoomOut')

//shuffle cards from each reel
const shuffle = (array: Sprite[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

//animation for image
export const animateImage = (operation: string) => {
  paylineArray.map((paylineColumn) => {
    paylineColumn.map((payline: any) => {
      const column = Number(payline[0])
      const row = Number(payline[1])
      switch (operation) {
        case zoomOperation.ZoomIn:
          newReel[column][row].width += 0.2
          newReel[column][row].height += 0.2
          break
        case zoomOperation.ZoomOut:
          newReel[column][row].width -= 0.2
          newReel[column][row].height -= 0.2
      }
    })
  })
}

const setArrayToEmpty = (array: any) => {
  for (let i = 0; i < array.length; i++) {
    array[i] = [] // replace each row with an empty array
  }
}

//Zoom Animation
const zoomEffect = (spinWheel: Sprite) => {
  const startTime = Date.now()
  let animationId: number

  const animate = () => {
    const elapsed = (Date.now() - startTime) / 1000

    if (elapsed > 3) {
      // Stop animation
      app.ticker.remove(zoomIn)
      app.ticker.remove(zoomOut)
      cancelAnimationFrame(animationId)
      setArrayToEmpty(newReel)
      spinWheel.interactive = true
      return
    }

    if (elapsed > 2.5) {
      app.ticker.remove(zoomIn)
      app.ticker.add(zoomOut)
    } else if (elapsed > 2) {
      app.ticker.remove(zoomOut)
      app.ticker.add(zoomIn)
    } else if (elapsed > 1.5) {
      app.ticker.remove(zoomIn)
      app.ticker.add(zoomOut)
    } else if (elapsed > 1) {
      app.ticker.remove(zoomOut)
      app.ticker.add(zoomIn)
    } else if (elapsed > 0.5) {
      app.ticker.remove(zoomIn)
      app.ticker.add(zoomOut)
    } else if (elapsed > 0) {
      // app.ticker.remove(zoomOut);
      app.ticker.add(zoomIn)
    }
    animationId = requestAnimationFrame(animate)
  }
  animate()
}

//Creating reels
export const createReel = (spriteSheet: Sprite[], initialPosition: number) => {
  let reels: any[] = []
  for (let i = initialPosition; i < 6; i++) {
    reels.push(spriteSheet.slice(i * 5, (i + 1) * 5))
  }
  return reels
}

//This function is limited to this file only because new Reel is dependent on it and, we are making new reel in below function
const setReelPosition = (reels: Sprite[][], positionIndex: number) => {
  try {
    reels.forEach((reel: Sprite[], reelIndex: number) => {
      reel.forEach((sprite: Sprite, spriteIndex: number) => {
        sprite.y = window.innerHeight / 2 - 500 + spriteIndex * 250

        //all data from first reel from every loop will be inserted inside new reel.
        if (reelIndex === 0 && positionIndex !== 5) {
          if (!newReel[positionIndex]) {
            newReel[positionIndex] = []
          }
          newReel[positionIndex].push(sprite)
        }
        if (positionIndex === 5) {
          if (!newReel[positionIndex]) {
            newReel[positionIndex] = []
          }
          if (reelIndex === 5) newReel[positionIndex].push(sprite)
        }
      })
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

//For every different reel to sop at different time we are using it.
export const RotateSlots = async (spinWheel: Sprite, spriteSheet: Sprite[]) => {
  spinWheel.interactive = false
  const reelHeight = window.innerHeight / 2 - 100 // Total height of all sprites in a reel (4 sprites * 145px each)
  const spinDuration = 4000
  const startTime = Date.now()
  let data = 0

  // Group sprites into reels
  let reels = createReel(spriteSheet, 0)

  const animateSpin = () => {
    data += 1
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / spinDuration, 1)
    let choosenColumn = reels

    const animate = (reelData: Sprite[][]) => {
      reelData.forEach((reel: any, reelIndex: number) => {
        reels[reelIndex] = shuffle(reel)
        reel.forEach((sprite: any) => {
          sprite.y += 100
          if (sprite.y > frameBottom) {
            sprite.y -= reelHeight
          }
        })
      })
    }

    if (progress < 1) {
      const reel: number = 0
      switch (data) {
        case 40:
          choosenColumn = createReel(spriteSheet, reel + 1)
          setReelPosition(reels, 0)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        case 80:
          choosenColumn = createReel(spriteSheet, reel + 2)
          setReelPosition(reels, 1)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        case 120:
          choosenColumn = createReel(spriteSheet, reel + 3)
          setReelPosition(reels, 2)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        case 160:
          choosenColumn = createReel(spriteSheet, reel + 4)
          setReelPosition(reels, 3)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        case 200:
          choosenColumn = createReel(spriteSheet, reel + 5)
          setReelPosition(reels, 4)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        default:
          requestAnimationFrame(() => animate(choosenColumn))
          break
      }
    } else {
      const result: boolean = setReelPosition(reels, 5)
      if (result) {
        zoomEffect(spinWheel)
      }

      app.ticker.remove(animateSpin)
      return reels
    }
  }
  app.ticker.add(animateSpin)
}
