import * as PIXI from 'pixi.js';

export interface Assets {
    nopat: PIXI.Sprite
}

export const assets: Assets = {} as any;

const images: {[k in keyof typeof assets]: any} = {
    "nopat": require('../assets/img/nopat.png')
};

export function loadAssets(): Promise<Assets> {
    return Promise.all(
        Object.keys(images).map(key => {
            return new Promise(resolve => {
                PIXI.Loader.shared.add(key, images[key]).load((loader, resources) => {
                    console.log("Loaded", key);
                    assets[key] = resources[key];
                    resolve(key);
                })
            })
        })).then(_res =>{
            console.log("Assets loaded!");
            return assets;
        } );
}