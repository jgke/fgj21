import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { Player } from 'tone';

export interface Assets {
    nopat: PIXI.Sprite
    tmpmap: PIXI.Sprite
    baari: PIXI.Sprite
    disco: Tone.Player,
}

export const assets: Assets = {} as any;

const images: {[k in keyof Partial<typeof assets>]: any} = {
    "nopat": require('../assets/img/nopat.png'),
    "tmpmap": require('../assets/img/tmpmap.png'),
    "baari": require('../assets/img/baari.jpg'),
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