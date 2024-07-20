export default class Tool {
  canvas: HTMLCanvasElement;
  socket: WebSocket;
  id: string;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    this.canvas = canvas;
    this.socket = socket;
    this.id = id;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.destroyEvents();
  }

  set fillColor(color: string | CanvasGradient | CanvasPattern) {
    this.ctx.fillStyle = color;
  }

  set strokeColor(color: string | CanvasGradient | CanvasPattern) {
    this.ctx.strokeStyle = color;
  }

  set lineWidth(width: number) {
    this.ctx.lineWidth = width;
  }

  destroyEvents() {
    this.canvas.onmousemove = null;
    this.canvas.onmousedown = null;
    this.canvas.onmouseup = null;
  }
}
