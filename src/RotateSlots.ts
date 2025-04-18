import app from './app'

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const RotateSlots = async (spinWheel: any, spriteSheet: any[]) => {
  spinWheel.interactive = false
  const reelHeight = window.innerHeight / 2 - 100 // Total height of all sprites in a reel (4 sprites * 145px each)
  const spinDuration = 3000
  const startTime = Date.now()
  const frameBottom = window.innerHeight / 2 + 550 // Frame's bottom boundary

  // Group sprites into reels
  let reels: any[] = []
  for (let i = 0; i < 6; i++) {
    reels.push(spriteSheet.slice(i * 5, (i + 1) * 5))
  }

  const animateSpin = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / spinDuration, 1)

    const animate = () => {
      reels.forEach((reel, reelIndex) => {
        reels[reelIndex] = shuffle(reel)
        reels[reelIndex].forEach((sprite: any) => {
          sprite.y += 100
          if (sprite.y > frameBottom) {
            sprite.y -= reelHeight
          }
        })
      })
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      reels.forEach((reel) => {
        reel.forEach((sprite: any, spriteIndex: number) => {
          sprite.y = window.innerHeight / 2 - 500 + spriteIndex * 250
          frameBottom - 145
        })
      })
      spinWheel.interactive = true
      app.ticker.remove(animateSpin)
      return reels
    }
  }
  app.ticker.add(animateSpin)
}
