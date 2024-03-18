import { IBall } from "../objects/Ball";

export const position = {
  distance: (x1: number, y1: number, x2: number, y2: number): number => {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  },
  rotate: (
    velocity: { x: number; y: number },
    angle: number,
  ): { x: number; y: number } => {
    const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
    };

    return rotatedVelocities;
  },

  resolveCollision: (particle: IBall, otherParticle: IBall): void => {
    const xVelocityDiff: number =
      particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff: number =
      particle.velocity.y - otherParticle.velocity.y;

    const xDist: number = otherParticle.x - particle.x;
    const yDist: number = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
      // Grab angle between the two colliding particles
      const angle: number = -Math.atan2(
        otherParticle.y - particle.y,
        otherParticle.x - particle.x,
      );

      // Store mass in var for better readability in collision equation
      const m1: number = particle.mass;
      const m2: number = otherParticle.mass;

      // Velocity before equation
      const u1 = position.rotate(particle.velocity, angle);
      const u2 = position.rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = {
        x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
        y: u1.y,
      };
      const v2 = {
        x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
        y: u2.y,
      };

      // Final velocity after rotating axis back to original location
      const vFinal1 = position.rotate(v1, -angle);
      const vFinal2 = position.rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
    }
  },
};
