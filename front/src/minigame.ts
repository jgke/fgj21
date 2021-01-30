import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { assets } from './assets';
import { Bottle } from './bottle';
import { PressedKeys } from './interfaces';
import { Sprite } from './movables';
import { GameObject } from './GameObject';

export class Minigame extends GameObject {
    private nopat: Sprite;
    private bottle: Bottle;
    private pressed_keys: PressedKeys;
    private ticks: number = 0;

    constructor(x: number, width: number, app: PIXI.Application) {
        super();

    this.position.x = x;
    const minigame_mask = new PIXI.Graphics().beginFill(0xFF0033).drawRect(x, 0, width, app.renderer.height).endFill();
    this.mask = minigame_mask;

    const background = new PIXI.Sprite(assets.baari.texture);
    const bg_scale = Math.min(width / background.width * 1.5, app.renderer.height / background.height);
    background.scale.set(bg_scale, bg_scale);
    this.addChild(background);

    const counter_height = app.renderer.height / 2;
    this.bottle = new Bottle(counter_height);
    this.addChild(this.bottle);

    // const nopat = new Sprite(assets.nopat.texture, { speed: 5 });
    this.pressed_keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false }

    // nopat.x = width / 2;
    // nopat.y = app.renderer.height / 2;
    // nopat.anchor.x = 0.5;
    // nopat.anchor.y = 0.5;

    // container.addChild(nopat);

    document.addEventListener('keydown', (event) => {
        if (event.key in this.pressed_keys) {
            this.pressed_keys[event.key] = true;
        }
    }, false);

    document.addEventListener('keyup', (event) => {
        if (event.key in this.pressed_keys) {
            this.pressed_keys[event.key] = false;
        }
    }, false);

    }
    public tick(delta: number) {
        this.ticks += delta;
        this.bottle.updateGame(this.ticks);
    }
}