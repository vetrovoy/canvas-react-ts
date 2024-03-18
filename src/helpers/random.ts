import { palette } from "../constants/palette";

import { TBallParams } from "../types";

import { position } from "./position";

export const random = {
  index: (max: number): number => {
    return Math.floor(Math.random() * max);
  },
  color: (): string => {
    const colors: string[] = Object.values(palette);

    const randomIndex: number = random.index(colors.length);

    return colors[randomIndex];
  },
  pos: (max: number, radius: number = 1): number => {
    return Math.random() * (max - radius * 2) + radius;
  },
  ball: (maxW: number, maxH: number): TBallParams => {
    const radius = Math.random() * 100;
    return {
      x: random.pos(maxW, radius),
      y: random.pos(maxH, radius),
      radius: radius,
      color: random.color(),
    };
  },
  balls: (amount: number = 10, maxW: number, maxH: number) => {
    const result = [];

    for (let i = 0; i < amount; i++) {
      let ball = random.ball(maxW, maxH);

      if (i !== 0) {
        for (let j = 0; j < result.length; j++) {
          if (
            position.distance(ball.x, ball.y, result[j].x, result[j].y) -
              ball.radius -
              result[j].radius * 2 <
            0
          ) {
            ball = random.ball(maxW, maxH);
            j = -1;
          }
        }
      }

      result.push(ball);
    }

    return result;
  },
};
