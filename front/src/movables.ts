import * as PIXI from 'pixi.js';
import { PressedKeys } from "./interfaces";

export interface SpriteOptions {
  speed?: number
}

export class Sprite extends PIXI.Sprite {
  speed = 0;
  vx = 0;
  vy = 0;

  constructor(texture: PIXI.Texture, options?: SpriteOptions) {
    super(texture);
    this.speed = options.speed || 0;
    this.vx = this.speed;
    this.vy = this.speed;
  }

  move(pressed_keys: PressedKeys) {
    if (pressed_keys.ArrowRight) this.x += this.vx;
    if (pressed_keys.ArrowLeft) this.x -= this.vx;
    if (pressed_keys.ArrowUp) this.y -= this.vy;
    if (pressed_keys.ArrowDown) this.y += this.vy;
  }
}