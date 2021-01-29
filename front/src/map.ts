import * as PIXI from 'pixi.js';
import { assets } from './assets';

export function map (width: number, app: PIXI.Application) { 
    const container = new PIXI.Container();
    container.width = width;
    container.height = app.renderer.height;
    const nopat = new PIXI.Sprite(assets.nopat.texture);

    nopat.x = width / 2;
    nopat.y = app.renderer.height / 2;
 
    nopat.anchor.x = 0.5;
    nopat.anchor.y = 0.5;
 
    container.addChild(nopat);
 
    app.ticker.add(() => {
        nopat.rotation += 0.01;
    });
    return container;
}