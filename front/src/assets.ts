import * as PIXI from 'pixi.js';

export interface Assets {
    nopat: PIXI.Sprite
    tmpmap: PIXI.Sprite
    baari: PIXI.Sprite
}

export const assets: Assets = {} as any;

const images: {[k in keyof typeof assets]: any} = {
    "nopat": require('../assets/img/nopat.png'),
    "tmpmap": require('../assets/img/tmpmap.png'),
    "baari": require('../assets/img/baari.jpg'),
};

const loadResource: (next: Promise<string>, key:string) => Promise<string> = (next, key) =>
    next.then(_ =>
        new Promise(resolve =>
            PIXI.Loader.shared.add(key, images[key]).load((loader, resources) => {
                console.log("Loaded", key);
                assets[key] = resources[key];
                resolve(key);
            })));


export function loadAssets(): Promise<Assets> {
    return Object.keys(images).reduce<Promise<string>>(loadResource, new Promise(resolve => resolve("")))
        .then(_ => assets)
}