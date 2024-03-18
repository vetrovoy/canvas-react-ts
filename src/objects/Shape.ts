class Shape {
  public id: number;
  public x: number;
  public y: number;
  public color: string;
  public strokeColor: string;

  constructor(x: number, y: number) {
    this.id = Math.floor(Math.random() * 9999);
    this.x = x;
    this.y = y;
    this.color = "navy";
    this.strokeColor = "navy";
  }

  move(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  fill(color: string) {
    this.color = color;
  }
}

export default Shape;
