import * as PIXI from 'pixi.js';
import { assets } from './assets';
import { PressedKeys } from './interfaces';
import { Sprite } from './movables';

export function minigame(width: number, app: PIXI.Application) {
    const container = new PIXI.Container();
    const nopat = new Sprite(assets.nopat.texture, { speed: 5 });
    const pressed_keys: PressedKeys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false }

    nopat.x = width / 2;
    nopat.y = app.renderer.height / 2;
    nopat.anchor.x = 0.5;
    nopat.anchor.y = 0.5;

    container.addChild(nopat);

    let ticks = 0;
    app.ticker.add(delta => {
        ticks += delta;
        nopat.move(pressed_keys);
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