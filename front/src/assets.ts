import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { Player } from 'tone';

export interface Assets {
    nopat: PIXI.Sprite
    tmpmap: PIXI.Sprite
    baari: PIXI.Sprite
    baari_bg: PIXI.Sprite
    baari_shading: PIXI.Sprite
    counter: PIXI.Sprite
    bottle: PIXI.Sprite
    blue_bottle: PIXI.Sprite
    green_bottle: PIXI.Sprite
    opaque_bottle: PIXI.Sprite
    red_bottle: PIXI.Sprite
    yellow_bottle: PIXI.Sprite
    disco: Tone.Player,
}

export const assets: Assets = {} as any;

const images: {[k in keyof Partial<typeof assets>]: any} = {
    nopat: require('../assets/img/nopat.png'),
    tmpmap: require('../assets/img/Helmilä.png'),
    baari: require('../assets/img/baari.jpg'),
    baari_bg: require('../assets/img/baari_bg.jpg'),
    baari_shading: require('../assets/img/baari_shading.png'),
    counter: require('../assets/img/counter.png'),
    bottle: require('../assets/img/bottle.png'),
    blue_bottle: require('../assets/img/blue_bottle.png'),
    green_bottle: require('../assets/img/green_bottle.png'),
    opaque_bottle: require('../assets/img/opaque_bottle.png'),
    red_bottle: require('../assets/img/red_bottle.png'),
    yellow_bottle: require('../assets/img/yellow_bottle.png'),
};

const audioOgg: {[k in 'disco']: any} = {
    "disco": require('../assets/music/FGJ21_-_Dokausmusiikki1.ogg'),
}

const audioAac: typeof audioOgg = {
    "disco": require('../assets/music/FGJ21_-_Dokausmusiikki1.aac'),
}

const audioWav: typeof audioOgg = {
    "disco": require('../assets/music/FGJ21_-_Dokausmusiikki1.wav'),
}

const loadResource: (next: Promise<string>, key:string) => Promise<string> = (next, key) =>
    next.then(_ =>
        new Promise(resolve =>
            PIXI.Loader.shared.add(key, images[key]).load((loader, resources) => {
                console.log("Loaded", key);
                assets[key] = resources[key];
                resolve(key);
            })));

const obj = document.createElement('audio');
const oggSupported = obj.canPlayType('audio/ogg');
const aacSupported = obj.canPlayType('audio/aac');

const loadAudio: (next: Promise<string>, key: string) => Promise<string> = (next, key) =>
    next.then(_ =>
        new Promise(resolve => {
            let audio = oggSupported ? audioOgg : aacSupported ? audioAac : audioWav;
            
            let buffer = new Tone.Buffer(audio[key], () => {
                console.log("Loaded", key, audio[key]);

                assets[key] = new Player(buffer);
                resolve(key);
            });
        }));


export function loadAssets(): Promise<Assets> {
    return Object.keys(images).reduce<Promise<string>>(loadResource, new Promise(resolve => resolve("")))
        .then(_ => Object.keys(audioOgg).reduce<Promise<string>>(loadAudio, new Promise(resolve => resolve(""))))
        .then(_ => assets)
}