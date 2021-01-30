import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { assets } from './assets';
import { Bottle } from './bottle';
import { GameObject } from './GameObject';

import bottles from '../assets/json/bottles.json';

export class Minigame extends GameObject {
    public score = 0;
    private bottles: Bottle[] = [];
    // private pressed_keys: PressedKeys;
    // private ticks: number = 0;

    constructor(x: number, width: number, app: PIXI.Application) {
        super();

        this.position.x = x;
        const minigame_mask = new PIXI.Graphics().beginFill(0xFF0033).drawRect(x, 0, width, app.renderer.height).endFill();
        this.mask = minigame_mask;

        const background = new PIXI.Sprite(assets.baari.texture);
        const scale = Math.min(width / background.width * 1.5, app.renderer.height / background.height);
        background.scale.set(scale, scale);
        this.addChild(background);

        const counter_height = app.renderer.height / 2;
        this.bottles = bottles.bottles.map(b => new Bottle(this, counter_height, b));
        this.addChild(this.bottles[6]);
        // this.bottles.forEach(b => this.addChild(b));
    }
    
    public tick(delta: number, ticks: number) {
        this.bottles.forEach(b => b.updateGame(ticks));
    }
}