import Sprite from '../base/sprite'
import DataBus from '../databus';


var width = 50;

const databus = new DataBus()

export default class GameBoard extends Sprite {

  constructor(ctx,boardnum) {
    super('', 500, 500)
    this.boardnum = boardnum
    this.startX = window.innerWidth/2-75
    this.startY = this.boardnum*200-80
    this.render(ctx)
  }

  render(ctx){
    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        ctx.fillStyle  = "#0B7BA0"
        ctx.fillRect(this.startX+x*(width+4),this.startY+y*(width+4),width,width)
        if (databus.getResult(this.boardnum,x,y)!='-'){
          this.setstep(x,y,ctx)
        }
      }
    }
  }

  setstep(x,y,ctx){
    ctx.fillStyle  = "white"
      ctx.fillText(databus.getResult(this.boardnum,x,y),this.startX+x*(width+4)+width/2-8,this.startY+y*(width+4)+width/2+8)
  }

  showhint(x,y,ctx){
    ctx.fillStyle  = "white"
    ctx.strokeRect(this.startX+x*(width+4),120+this.startY+y*(width+4),width,width)
  }
}
