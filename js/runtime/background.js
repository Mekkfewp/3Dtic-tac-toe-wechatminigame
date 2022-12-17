import Sprite from '../base/sprite'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC = 'images/bg.jpg'
const BG_WIDTH = 640
const BG_HEIGHT = 968

export default class BackGround extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)
    this.render(ctx)
  }

  update() {
  }

  render(ctx) {

    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      screenWidth,
      screenHeight
    )
  }
}
