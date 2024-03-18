import { position } from "../helpers/position";

import Shape from "./Shape";

export interface IBall {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  mass: number;
  radius: number;
}

class Ball extends Shape implements IBall {
  public radius: number;
  public velocity: { x: number; y: number };
  public mass: number;

  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this.radius = radius;
    this.velocity = {
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
    };
    this.mass = 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = this.strokeColor;
    ctx.stroke();
    ctx.closePath();
  }

  update(
    ctx: CanvasRenderingContext2D,
    innerWidth: number,
    innerHeight: number,
    particles?: IBall[],
  ) {
    if (particles) {
      for (let i = 0; i < particles.length; i++) {
        if (this.x === particles[i].x) continue; // Пропустить текущую частицу

        if (
          position.distance(this.x, this.y, particles[i].x, particles[i].y) -
            (this.radius + particles[i].radius) <
          0
        ) {
          position.resolveCollision(this, particles[i]);
        }
      }
    }

    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.draw(ctx);
  }
}

export default Ball;
