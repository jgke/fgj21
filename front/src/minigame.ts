import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { assets } from './assets';
import { Bottle } from './bottle';
import { GameObject } from './GameObject';

export class Minigame extends GameObject {
    public score = 0;
    private bottle: Bottle;
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
        this.bottle = new Bottle(this, counter_height);
        this.addChild(this.bottle);
    }
    
    public tick(delta: number, ticks: number) {
        this.bottle.updateGame(ticks);
    }
}