import * as PIXI from 'pixi.js';
import { assets } from './assets';

class Sprite extends PIXI.Sprite {
    move(pressed_keys: PressedKeys) {
        if (pressed_keys.ArrowRight) this.x += 5;
        if (pressed_keys.ArrowLeft) this.x -= 5;
        if (pressed_keys.ArrowUp) this.y -= 5;
        if (pressed_keys.ArrowDown) this.y += 5;
    }
}

interface PressedKeys {
    ArrowLeft: boolean
    ArrowRight: boolean
    ArrowUp: boolean
    ArrowDown: boolean
}

export function minigame(width: number, app: PIXI.Application) {
    const container = new PIXI.Container();
    const nopat = new Sprite(assets.nopat.texture);
    const pressed_keys: PressedKeys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false }

    nopat.x = width / 2;
    nopat.y = app.renderer.height / 2;
    nopat.anchor.x = 0.5;
    nopat.anchor.y = 0.5;

    container.addChild(nopat);

    let ticks = 0;
    app.ticker.add(delta => {
        ticks += delta;
        // nopat.y = app.renderer.height / 2 + 100 * Math.sin(ticks / 100);
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