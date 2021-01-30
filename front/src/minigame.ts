import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { assets } from './assets';
import { Bottle } from './bottle';
import { PressedKeys } from './interfaces';
import { Sprite } from './movables';

export function minigame(x: number, width: number, app: PIXI.Application) {
    const container = new PIXI.Container();
    container.position.x = x;
    const minigame_mask = new PIXI.Graphics().beginFill(0xFF0033).drawRect(x, 0, width, app.renderer.height).endFill();
    container.mask = minigame_mask;

    const background = new PIXI.Sprite(assets.baari.texture);
    const bg_scale = Math.min(width / background.width * 1.5, app.renderer.height / background.height);
    background.scale.set(bg_scale, bg_scale);
    container.addChild(background);

    const counter_height = app.renderer.height / 2;
    const bottle = new Bottle(counter_height);
    container.addChild(bottle);

    // const nopat = new Sprite(assets.nopat.texture, { speed: 5 });
    const pressed_keys: PressedKeys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false }

    // nopat.x = width / 2;
    // nopat.y = app.renderer.height / 2;
    // nopat.anchor.x = 0.5;
    // nopat.anchor.y = 0.5;

    // container.addChild(nopat);

    let ticks = 0;
    app.ticker.add(delta => {
        ticks += delta;
        bottle.updateGame(ticks);
        // nopat.move(pressed_keys);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key in pressed_keys) {
            pressed_keys[event.key] = true;
        }
    }, false);

    document.addEventListener('keyup', (event) => {
        if (event.key in pressed_keys) {
            pressed_keys[event.key] = false;
        }
    }, false);

    return container;
}