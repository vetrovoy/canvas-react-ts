import React, { useRef, useEffect, useState, useCallback } from "react";

import Ball from "../objects/Ball";
import { random } from "../helpers/random";
import { ICanvas, Canvas } from "../objects/Canvas";

import { TMouseDirection, TMouseDirectionVelocity } from "../types";

import ColorMenu from "./ColorMenu";

export const Layout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<ICanvas | null>(null);

  // Состояние для направления движения мыши
  const [mouseDirection, setMouseDirection] = useState<TMouseDirection>({
    prevX: null,
    prevY: null,
  });

  const [ballSelected, setBallSelected] = useState<Ball | null>(null);
  const [balls, setBalls] = useState<Ball[]>([]);

  const [isColorMenuVisible, setIsColorMenuVisible] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");

  // Функция для проверки коллизий
  const checkCollision = useCallback(
    (ball: Ball, canvasX: number, canvasY: number) => {
      return (
        canvasX >= ball.x - ball.radius &&
        canvasX <= ball.x + ball.radius &&
        canvasY >= ball.y - ball.radius &&
        canvasY <= ball.y + ball.radius
      );
    },
    [],
  );

  // Обработчик клика на шар
  const handleBallClick = useCallback(
    (canvas: ICanvas, canvasX: number, canvasY: number) => {
      if (balls.length === 0) return;

      let clickedBall: Ball | null = null;

      setBallSelected(null);
      setIsColorMenuVisible(false);
      setColor("");

      balls.forEach((ball) => {
        if (!canvas.ctx) return;

        if (checkCollision(ball, canvasX, canvasY)) {
          clickedBall = ball;
          setColor(ball.color);
        }
      });

      if (clickedBall) {
        setBallSelected(clickedBall);
        setIsColorMenuVisible(true);
      }
    },
    [balls, checkCollision],
  );

  // Обработчик движения мыши на шар
  const handleBallMouseMove = useCallback(
    (
      canvas: ICanvas,
      canvasX: number,
      canvasY: number,
      direction: TMouseDirectionVelocity,
    ) => {
      if (balls.length === 0) return;
      balls.forEach((ball) => {
        if (!canvas.ctx) return;

        if (checkCollision(ball, canvasX, canvasY)) {
          ball.velocity = direction;
        }
      });
    },
    [balls, checkCollision],
  );

  // Обработчик клика по canvas
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvas || !canvas.canvas || balls.length === 0) return;

      const rect = canvas.canvas.getBoundingClientRect();

      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      handleBallClick(canvas, canvasX, canvasY);
    },
    [canvas, balls, handleBallClick],
  );

  // Обработчик движения мыши по canvas
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvas || !canvas.canvas || balls.length === 0) return;

      const rect = canvas.canvas.getBoundingClientRect();

      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      let direction: TMouseDirectionVelocity = { x: 0, y: 0 };

      if (mouseDirection.prevX !== null && mouseDirection.prevY !== null) {
        const deltaX = canvasX - mouseDirection.prevX;
        const deltaY = canvasY - mouseDirection.prevY;

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
      handleBallMouseMove(canvas, canvasX, canvasY, direction);
    },
    [canvas, balls, mouseDirection, handleBallMouseMove],
  );

  // Эффект для инициализации canvas
  useEffect(() => {
    const canvasElement = canvasRef.current;
    const { innerHeight, innerWidth } = window;

    if (!canvasElement || !innerHeight || !innerWidth) return;

    const canvas = new Canvas(canvasElement, innerWidth, innerHeight);
    setCanvas(canvas);
  }, []);

  // Эффект для создания случайных шаров
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

  // Эффект для запуска анимации
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

  // Эффект для обновления цвета выбранного шара
  useEffect(() => {
    if (!color || !ballSelected) return;
    ballSelected.color = color;
  }, [color, ballSelected]);

  return (
    <>
      {/* Меню выбора цвета */}
      <ColorMenu
        selectedColor={color}
        isColorMenuVisible={isColorMenuVisible}
        onColorSelect={setColor}
      />
      {/* Canvas */}
      <canvas
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
        ref={canvasRef}
      />
    </>
  );
};
