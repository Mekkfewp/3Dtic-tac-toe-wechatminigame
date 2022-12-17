
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import GameBoard from './runtime/gameboard'

const ctx = canvas.getContext('2d')
const databus = new DataBus()


/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )


    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()
      if (databus.gameOver) return
      var width = 50;
      const touchx = e.touches[0].clientX
      const touchy = e.touches[0].clientY
      var gridx = Math.floor((touchx)/(width+4))-2
      var board = 1
      if (touchy>300){
        board = 2
        if (touchy>500){
          board = 3
        }
      }
      var gridy = Math.floor((touchy-(board-1)*200)/(width+4))-2
       
      if (databus.getResult(board,gridx,gridy)=='-'){
        databus.humanPlays(board,gridx,gridy)
      }
    }))

    this.gameboard1 = new GameBoard(ctx,1)
    this.gameboard2 = new GameBoard(ctx,2)
    this.gameboard3 = new GameBoard(ctx,3)

    this.bg = new BackGround(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    this.hasShowEnd = false
    this.isTriggle = false

    // 清除上一局的动画

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )

  }


  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    const area = this.gameinfo.btnArea
    if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY) this.restart()
    
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.bg.render(ctx)
    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      if (!this.hasShowEnd){
        this.gameboard1.render(ctx)
        this.gameboard2.render(ctx)
        this.gameboard3.render(ctx)
        if (!this.isTriggle){
          this.isTriggle = true
          setInterval(
            ()=>{
              this.hasShowEnd = true
            },
            2000
          )
        }
      }
      else{
        this.gameinfo.renderGameOver(ctx,databus.score)
        if (!this.hasEventBind) {
          this.hasEventBind = true
          this.touchHandler = this.touchEventHandler.bind(this)
          canvas.addEventListener('touchstart', this.touchHandler)
        }
      }


    }
    else{

      this.gameboard1.render(ctx)
      this.gameboard2.render(ctx)
      this.gameboard3.render(ctx)
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver) return

    this.bg.update()

  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
