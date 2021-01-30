import * as PIXI from 'pixi.js';
import { assets } from './assets';

export class Bottle extends PIXI.Sprite {
  gametime = false;
  gamegauge = 0;
  gamegaugespeed = 20;
  private g_vpos;
  private g_width;
  private g_height;
  private aim_line;
  
  constructor(counter_height: number, texture?: PIXI.Texture) {
    super(texture !== undefined ? texture : assets.bottle.texture);
    this.anchor.set(.5, 1);
    this.y = counter_height;
    this.x = 150;
    this.defineGaugeSpecs();

    this.interactive = true;
    this.on('mousedown', this.drawPourGame);
  }

  private defineGaugeSpecs = () => {
    this.g_vpos = -this.height * .7;
    this.g_width = this.width / 2 * 1.5;
    this.g_height = 20;
  }

  updateGame(tick: number) {
    if (this.gametime) {
      this.gamegauge = Math.asin(Math.cos(tick / 2 * this.gamegaugespeed / 100)) / 2;
      // console.log(this.gamegauge);
      const aim_line_pos = this.gamegauge * this.g_width;
      if (this.aim_line === undefined) {
        this.aim_line = new PIXI.Graphics().lineStyle(10, 0xFF0000, 1).moveTo(aim_line_pos, this.g_vpos - this.g_height).lineTo(aim_line_pos, this.g_vpos + this.g_height);
        this.addChild(this.aim_line);
      } else {
        this.aim_line.clear();
        this.aim_line.lineStyle(10, 0xFF0000, 1).moveTo(aim_line_pos, this.g_vpos - this.g_height / 2).lineTo(aim_line_pos, this.g_vpos + this.g_height / 2);
      }
    }
  }
  
  public drawPourGame = (event) => {
    if (this.gametime) {
      const score = 100 - Math.abs(this.gamegauge) * 100;
      console.log(`Game ended :( Your pour accuracy was ${score.toFixed(0)} %`);
      this.gametime = false;
      this.removeChildren();
      this.aim_line = undefined;
    } else {
      console.log("Game time!");
      this.gametime = true;
      const g_vpos = this.g_vpos;
      const g_width = this.g_width;
      const g_height = this.g_height;
      const gauge = new PIXI.Graphics().lineStyle(5, 0xFFFFFF, 1).moveTo(-g_width, g_vpos).lineTo(g_width, g_vpos);
      const center = new PIXI.Graphics().lineStyle(5, 0xFFFFFF, 1).moveTo(0,g_vpos - g_height / 2).lineTo(0,g_vpos + g_height / 2);
      const left = new PIXI.Graphics().lineStyle(5, 0xFFFFFF, 1).moveTo(-g_width, g_vpos - g_height).lineTo(-g_width, g_vpos + g_height);
      const right = new PIXI.Graphics().lineStyle(5, 0xFFFFFF, 1).moveTo(g_width, g_vpos - g_height).lineTo(g_width, g_vpos + g_height);
      this.addChild(gauge);
      this.addChild(center);
      this.addChild(left);
      this.addChild(right);
    }
  }
}