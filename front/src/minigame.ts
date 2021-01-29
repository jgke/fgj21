import * as PIXI from 'pixi.js';

export function minigame (width: number) { 
    const container = new PIXI.Container();
    container.width = width;
    return new PIXI.Container();
}