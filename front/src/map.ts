import * as PIXI from 'pixi.js';

export function map (width: number) { 
    const container = new PIXI.Container();
    container.width = width;
    return new PIXI.Container();
}