import { Sprite } from 'pixi.js'
import app from './app'
import { frameBottom } from './helper/Helper'

//shuffle cards
const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

//Creating reels
const createReel = (spriteSheet: Sprite[], initialPosition: number) => {
  let reels: any[] = []
  for (let i = initialPosition; i < 6; i++) {
    reels.push(spriteSheet.slice(i * 5, (i + 1) * 5))
  }
  return reels
}

//Set Reels position
const setReelPosition = (reels: Sprite[][]) => {
  reels.forEach((reel) => {
    reel.forEach((sprite: any, spriteIndex: number) => {
      sprite.y = window.innerHeight / 2 - 500 + spriteIndex * 250
    })
  })
}

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
    console.log('data', data)
    const progress = Math.min(elapsed / spinDuration, 1)
    let choosenColumn = reels

    const animate = (reelData: Sprite[]) => {
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
          setReelPosition(reels)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        case 80:
          choosenColumn = createReel(spriteSheet, reel + 2)
          setReelPosition(reels)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        case 120:
          choosenColumn = createReel(spriteSheet, reel + 3)
          setReelPosition(reels)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        case 160:
          choosenColumn = createReel(spriteSheet, reel + 4)
          setReelPosition(reels)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        case 200:
          choosenColumn = createReel(spriteSheet, reel + 5)
          setReelPosition(reels)
          requestAnimationFrame(() => animate(choosenColumn))
          break
        default:
          requestAnimationFrame(() => animate(choosenColumn))
      }
    } else {
      setReelPosition(reels)
      spinWheel.interactive = true
      app.ticker.remove(animateSpin)
      return reels
    }
  }
  app.ticker.add(animateSpin)
}
