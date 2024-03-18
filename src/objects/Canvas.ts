export interface ICanvas {
  readonly canvas: HTMLCanvasElement | null;
  readonly ctx: CanvasRenderingContext2D | null;
  readonly innerWidth: number;
  readonly innerHeight: number;
  reset: () => void;
  animateEnd: () => void;
  animate: (animation: () => void) => void;
}

export class Canvas implements ICanvas {
  public canvas: HTMLCanvasElement | null = null;
  public ctx: CanvasRenderingContext2D | null = null;
  public innerWidth: number = 0;
  public innerHeight: number = 0;
  private animationId: number | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    innerWidth: number,
    innerHeight: number,
  ) {
    this.innerWidth = innerWidth || window.innerWidth;
    this.innerHeight = innerHeight || window.innerHeight;
    this.init(canvas);
  }

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = this.innerWidth;
    this.canvas.height = this.innerHeight;
    this.ctx = canvas.getContext("2d");
  }

  reset() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
  }

  animate(animation: () => void) {
    if (!this.canvas || !this.ctx) return;

    this.animationId = requestAnimationFrame(() => this.animate(animation));
    this.reset();
    animation();
  }

  animateEnd() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
