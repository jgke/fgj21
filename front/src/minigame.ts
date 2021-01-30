import * as PIXI from 'pixi.js';
import { assets } from './assets';

export function minigame (width: number, app: PIXI.Application) { 
    const container = new PIXI.Container();
    const nopat = new PIXI.Sprite(assets.nopat.texture);

    nopat.x = width / 2;
    nopat.y = app.renderer.height / 2;
    nopat.anchor.x = 0.5;
    nopat.anchor.y = 0.5;

    container.addChild(nopat);
 
    let ticks = 0;
    app.ticker.add(delta => {
        ticks += delta;
        nopat.y = app.renderer.height/2 + 100 * Math.sin(ticks/100);
    });
    return container;
}