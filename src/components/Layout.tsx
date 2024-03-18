import React, { useRef, useEffect, useState } from "react";

import Ball from "../objects/Ball";

import { random } from "../helpers/random";

import { ICanvas, Canvas } from "../objects/Canvas";

import { TMouseDirection, TMouseDirectionVelocity } from "../types";

import ColorMenu from "./ColorMenu";

const Layout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<ICanvas | null>(null);

  const [mouseDirection, setMouseDirection] = useState<TMouseDirection>({
    prevX: null,
    prevY: null,
  });

  const [ballSelected, setBallSelected] = useState<Ball | null>(null);
  const [balls, setBalls] = useState<Ball[]>([]);

  const [isColorMenuVisible, setIsColorMenuVisible] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  const onBallClick = (canvas: ICanvas, canvasX: number, canvasY: number) => {
    if (balls.length === 0) return;

    let clickedBall: Ball | null = null;

    setBallSelected(null);
    setIsColorMenuVisible(false);
    setColor("");

    balls.forEach((ball) => {
      if (!canvas.ctx) return;

      if (
        canvasX >= ball.x - ball.radius &&
        canvasX <= ball.x + ball.radius &&
        canvasY >= ball.y - ball.radius &&
        canvasY <= ball.y + ball.radius
      ) {
        clickedBall = ball;
        setColor(ball.color);
      }
    });

    if (clickedBall) {
      setBallSelected(clickedBall);
      setIsColorMenuVisible(true);
    }
  };

  const onBallMouseMove = (
    canvas: ICanvas,
    canvasX: number,
    canvasY: number,
    direction: TMouseDirectionVelocity,
  ) => {
    if (balls.length === 0) return;

    balls.forEach((ball) => {
      if (!canvas.ctx) return;
      if (
        canvasX >= ball.x - ball.radius &&
        canvasX <= ball.x + ball.radius &&
        canvasY >= ball.y - ball.radius &&
        canvasY <= ball.y + ball.radius
      ) {
        ball.velocity = direction;
      }
    });
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas || !canvas.canvas || balls.length === 0) return;

    const rect = canvas.canvas.getBoundingClientRect();

    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    onBallClick(canvas, canvasX, canvasY);
  };

  const onCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas || !canvas.canvas || balls.length === 0) return;

    const rect = canvas.canvas.getBoundingClientRect();

    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    let direction: TMouseDirectionVelocity = {
      x: 0,
      y: 0,
    };

    if (mouseDirection.prevX !== null && mouseDirection.prevY !== null) {
      // Сравниваем текущие координаты с предыдущими
      const deltaX = canvasX - mouseDirection.prevX;
      const deltaY = canvasY - mouseDirection.prevY;

      // Определяем направление по изменению координат
      if (deltaX > 0) {
        direction.x = -1;
      } else if (deltaX < 0) {
        direction.x = 1;
      }

      if (deltaY > 0) {
        direction.y = 1;
      } else if (deltaY < 0) {
        direction.y = -1;
      }
    }

    setMouseDirection({ prevX: canvasX, prevY: canvasY });

    onBallMouseMove(canvas, canvasX, canvasY, direction);
  };

  // INIT CANVAS
  useEffect(() => {
    const canvasElement = canvasRef.current;
    const { innerHeight, innerWidth } = window;

    if (!canvasElement || !innerHeight || !innerWidth) return;

    const canvas = new Canvas(canvasElement, innerWidth, innerHeight);

    setCanvas(canvas);
  }, []);

  // INIT BALLS
  useEffect(() => {
    if (!canvas || !canvas.ctx) return;

    const balls = random.balls(50, canvas.innerWidth, canvas.innerHeight);

    for (let i = 0; i < balls.length; i++) {
      const ball = new Ball(balls[i].x, balls[i].y, balls[i].radius);

      ball.fill(balls[i].color);
      ball.draw(canvas.ctx);

      setBalls((prevBalls) => [...prevBalls, ball]);
    }
  }, [canvas]);

  // INIT ANIMATION
  useEffect(() => {
    if (!canvas || !canvas.canvas || balls.length === 0) return;
    const startAnimation = () => {
      for (let i = 0; i < balls.length; i++) {
        if (!canvas.ctx) return;

        balls[i].update(
          canvas.ctx,
          canvas.innerWidth,
          canvas.innerHeight,
          balls,
        );
      }
    };
    canvas.animate(startAnimation);
  }, [canvas, balls]);

  // CHANGE COLOR
  useEffect(() => {
    if (!color || !ballSelected) return;
    ballSelected.color = color;
  }, [color, ballSelected]);

  return (
    <>
      <ColorMenu
        selectedColor={color}
        isColorMenuVisible={isColorMenuVisible}
        onColorSelect={setColor}
      />
      <canvas
        onMouseMove={onCanvasMouseMove}
        onClick={onCanvasClick}
        ref={canvasRef}
      />
    </>
  );
};

export default Layout;
