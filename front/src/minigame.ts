import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { assets } from './assets';
import { Bottle } from './bottle';
import { GameObject } from './GameObject';

import bottles from '../assets/json/bottles.json';
import all_cocktails from '../assets/json/cocktails.json';

interface Cocktail {
    name: string;
    pour_amount: number;
    bottles: {
        name: string;
    }[];
    description: string;
}

// from https://javascript.info/array-methods#shuffle-an-array
// Better than sorting with Math.random because Math.random is biased.
function shuffle<T extends Array<any>>(array: T): T {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export class Minigame extends GameObject {
    public score = 0;
    private bottles: Bottle[][] = [];
    public current_drink: Bottle[] = [];
    private todays_cocktails: Cocktail[] = [];
    // private pressed_keys: PressedKeys;
    // private ticks: number = 0;

    flattened_bottles = () => { return [].concat(...this.bottles); }

    constructor(x: number, width: number, app: PIXI.Application, cocktails: { name: string }[]) {
        super();

        this.position.x = x;
        const minigame_mask = new PIXI.Graphics().beginFill(0xFF0033).drawRect(x, 0, width, app.renderer.height).endFill();
        this.mask = minigame_mask;

        const background = new PIXI.Sprite(assets.baari_bg.texture);
        const counter_height = app.renderer.height / 2;
        const counter = new PIXI.Sprite(assets.counter.texture);
        counter.y = counter_height;
        const baari_shading = new PIXI.Sprite(assets.baari_shading.texture);
        const scale = Math.min(width / background.width, app.renderer.height / background.height);
        background.scale.set(scale, scale);
        counter.scale.set(scale, scale);
        baari_shading.scale.set(scale, scale);

        this.addChild(background, counter);

        const todays_cocktail_names = cocktails.map(c => c.name);

        all_cocktails.cocktails.forEach(c => { if (todays_cocktail_names.includes(c.name)) this.todays_cocktails.push(c); });

        const bottle_dictionary = bottles.bottles.reduce((a, bottle) => ({ ...a, [bottle.name]: bottle }), {})

        let i = 0;
        this.bottles = (this.todays_cocktails.map(c => {
            const tmp = c.bottles.map(b => bottle_dictionary[b.name]);
            return tmp.map(b => new Bottle(this, counter_height, this.width * .8, i++, c.pour_amount, b))
        }));

        this.addChild(...this.flattened_bottles());

        this.addChild(baari_shading);
    }

    public tick(delta: number, ticks: number) {
        this.flattened_bottles().forEach(b => b.updateGame(ticks));
    }
}