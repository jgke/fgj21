import * as PIXI from 'pixi.js';
import { assets } from './assets';
import { showDrunk } from './drunkCanvas';
import { Minigame } from './minigame';
import { bottleStyle } from './styles';

export interface BottleOptions {
  name: string;
  shortname: string;
  pourvol: number;
  alcvol: number;
  sweetvol: number;
  description: string;
  bottle_name: string;
}

export interface Pour {
  pourvol: number;
  alcvol: number;
  sweetvol: number;
  accuracy: number;
  score?: number;
  judgement?: string;
}

export class Bottle extends PIXI.Sprite {
  gametime = false;
  gauge = new PIXI.Graphics();
  gauge_value = 0;
  gauge_speed = 20;
  private g_vpos: number;
  private g_width: number;
  private g_height: number;
  private aim_line = new PIXI.Graphics();
  private minigame: Minigame;
  private options: BottleOptions;

  constructor(minigame: Minigame, x: number, options: BottleOptions, onHover) {
    super(options.bottle_name === undefined || assets[options.bottle_name] === undefined ? assets.bottle.texture : assets[options.bottle_name].texture);
    this.minigame = minigame;
    this.options = options;

    this.anchor.set(.5, 1);
    [this.x, this.y] = [x, 0];
    
    this.g_vpos = -this.height * .7;
    this.g_width = this.width / 2 * 1.5;
    this.g_height = this.height / 10;

    this.addChild(this.gauge, this.aim_line);
    
    this.interactive = true;
    this.on('mousedown', this.togglePourGame);
    this.on('mouseover', onHover);

    this.scale.set(.15, .15)
    
    const bottle_text = `${this.options.shortname}\n${this.options.pourvol}cl ${this.options.alcvol}g ${this.options.sweetvol}g`;
    const name = new PIXI.Text(bottle_text, bottleStyle);
    name.anchor.x = .5;
    name.position.y = 10;

    this.addChild(name);
  }

  updateGame(tick: number) {
    if (this.gametime) {
      this.gauge_value = Math.asin(Math.cos(tick / 2 * this.gauge_speed / 100)) / 2;
      const aim_line_pos = this.gauge_value * this.g_width;
      this.aim_line.clear();
      this.drawAimLine(aim_line_pos);
    }
  }

  private drawAimLine = (pos: number) => {
    this.aim_line.lineStyle(10, 0xFF0000, 1).moveTo(pos, this.g_vpos - this.g_height / 2).lineTo(pos, this.g_vpos + this.g_height / 2);
  }

  private drawGauge = (g_vpos: number, g_width: number, g_height: number) => {
    this.gauge
      .lineStyle(5, 0xFFFFFF, 1).moveTo(-g_width, g_vpos).lineTo(g_width, g_vpos)
      .moveTo(0, g_vpos - g_height / 2).lineTo(0, g_vpos + g_height / 2)
      .moveTo(-g_width, g_vpos - g_height).lineTo(-g_width, g_vpos + g_height)
      .moveTo(g_width, g_vpos - g_height).lineTo(g_width, g_vpos + g_height);
  }

  private togglePourGame = (event) => {
    if (this.gametime) {
      // Game ends
      const score = 100 - Math.abs(this.gauge_value) * 100;
      let judgement;
      if (this.gauge_value < .3) {
        judgement = "Poor";
      } 
      else if (this.gauge_value < .6) {
        judgement = "Decent";
      }
      else if (this.gauge_value < .9) {
        judgement = "Great!";
      } else {
        judgement = "Excellent!";
      }
      const pour: Pour = {
        pourvol: this.options.pourvol,
        alcvol: this.options.alcvol,
        sweetvol: this.options.sweetvol,
        accuracy: this.gauge_value,
        judgement: judgement,
      }
      this.gametime = false;
      this.aim_line.clear();
      this.gauge.clear();

      // TODO: play pour sound
      this.minigame.pour(pour);
    } else {
      // Game starts
      // TODO? Play sound which sounds like the person is thinking?
      this.gametime = true;
      this.drawGauge(this.g_vpos, this.g_width, this.g_height);
    }
  }
}