import * as PIXI from 'pixi.js';
import { assets } from './assets';
import { Minigame } from './minigame';

let bottleStyle = new PIXI.TextStyle({
  fontFamily: "Comic Sans MS",
  fontSize: 40,
  fill: "white",
  stroke: '#000000',
  strokeThickness: 1,
});

export class Bottle extends PIXI.Sprite {
  gametime = false;
  gamegauge = 0;
  gamegaugespeed = 20;
  private g_vpos;
  private g_width;
  private g_height;
  private aim_line;
  private minigame: Minigame;
  private options;
  private pour_amount: number = 0;
  private poured_amount: number = 0;

  constructor(minigame: Minigame, counter_height: number, counter_width: number, bottle_index: number, pour_amount: number, options) {
    super(options.bottle_name === undefined || assets[options.bottle_name] === undefined ? assets.bottle.texture : assets[options.bottle_name].texture);
    this.minigame = minigame;
    this.options = options;
    this.pour_amount = pour_amount;
    
    this.anchor.set(.5, 1);
    this.scale.set(.15, .15)
    this.y = counter_height;
    this.x = 100 + 30 * (bottle_index) + 5 * Math.sin(bottle_index * 93879823.234);

    this.g_vpos = -this.height * .7 / this.scale.y;
    this.g_width = this.width / 2 * 1.5 / this.scale.x;
    this.g_height = this.height / 10 / this.scale.y;

    this.interactive = true;
    this.on('mousedown', this.drawPourGame);

    const name = new PIXI.Text(`${this.options.name}`, bottleStyle);
    name.position.x = this.x;
    name.position.y = this.y + 20;
    this.addChild(name);
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

  drawGauge = (g_vpos: number, g_width: number, g_height: number) => {
    const gauge = new PIXI.Graphics().lineStyle(5, 0xFFFFFF, 1).moveTo(-g_width, g_vpos).lineTo(g_width, g_vpos);
    const center = new PIXI.Graphics().lineStyle(5, 0xFFFFFF, 1).moveTo(0, g_vpos - g_height / 2).lineTo(0, g_vpos + g_height / 2);
    const left = new PIXI.Graphics().lineStyle(5, 0xFFFFFF, 1).moveTo(-g_width, g_vpos - g_height).lineTo(-g_width, g_vpos + g_height);
    const right = new PIXI.Graphics().lineStyle(5, 0xFFFFFF, 1).moveTo(g_width, g_vpos - g_height).lineTo(g_width, g_vpos + g_height);
    this.addChild(gauge, center, left, right);
  }

  public drawPourGame = (event) => {
    if (this.pour_amount === this.poured_amount) {
      // TODO: play sound that bottle is empty
      return;
    }
    if (this.gametime) {
      // Game ends
      const score = 100 - Math.abs(this.gamegauge) * 100;
      this.gametime = false;
      this.removeChildren();
      this.aim_line = undefined;

      // TODO: play pour sound
      this.poured_amount += 1;
      this.minigame.score += score;
    } else {
      // Game starts
      // TODO? Play sound which sounds like the person is thinking?
      this.gametime = true;
      this.drawGauge(this.g_vpos, this.g_width, this.g_height);
    }
  }
}