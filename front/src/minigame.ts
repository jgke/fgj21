import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { assets } from './assets';
import { Bottle } from './bottle';
import { GameObject } from './GameObject';

import bottles from '../assets/json/bottles.json';
import all_cocktails from '../assets/json/cocktails.json';
import { shuffle } from './functions';

interface Cocktail {
    name: string;
    pour_amount: number;
    bottles: {
        name: string;
    }[];
    description: string;
}

export class Minigame extends GameObject {
    private score = 0;
    private bottles: Bottle[] = [];
    private todays_cocktails: string[] = [];
    private current_cocktail = 0;
    private pour_amount = 0;
    private poured_amount = 0;
    private bottle_container = new PIXI.Container();
    private cocktail_dictionary: { [index: string]: Cocktail };
    private bottle_dictionary: { [index: string]: Bottle };
    private counter_height: number;

    public getScore = () => { return this.score; }

    constructor(x: number, width: number, app: PIXI.Application, cocktails: { name: string }[]) {
        super();

        this.position.x = x;
        const minigame_mask = new PIXI.Graphics().beginFill(0xFF0033).drawRect(x, 0, width, app.renderer.height).endFill();
        this.mask = minigame_mask;

        const background = new PIXI.Sprite(assets.baari_bg.texture);
        this.counter_height = app.renderer.height / 2;
        const counter = new PIXI.Sprite(assets.counter.texture);
        counter.y = this.counter_height;
        const baari_shading = new PIXI.Sprite(assets.baari_shading.texture);
        const scale = Math.min(width / background.width, app.renderer.height / background.height);
        background.scale.set(scale, scale);
        counter.scale.set(scale, scale);
        baari_shading.scale.set(scale, scale);

        this.addChild(background, counter);

        // all_cocktails.cocktails.forEach(c => { if (todays_cocktail_names.includes(c.name)) this.todays_cocktails.push(c); });
        this.todays_cocktails = cocktails.map(c => c.name);
        this.bottle_dictionary = bottles.bottles
            .reduce((a, bottle) => ({ ...a, [bottle.name]: bottle }), {})
        this.cocktail_dictionary = all_cocktails.cocktails
            .reduce((a, cocktail) => ({ ...a, [cocktail.name]: cocktail }), {})
        this.updateBottles();

        this.bottle_container.y = this.counter_height;
        this.bottle_container.x = width * .2;
        this.bottle_container.interactiveChildren = true;
        this.addChild(this.bottle_container);

        this.addChild(baari_shading);
    }

    private updateBottles = () => {
        this.bottle_container.removeChildren();
        this.bottles = [];

        const cocktail = this.cocktail_dictionary[this.todays_cocktails[this.current_cocktail]]
        this.pour_amount = cocktail.pour_amount;

        let i = 0;
        // TODO: shuffle here?
        const bottles = (cocktail.bottles.map(b => this.bottle_dictionary[b.name]));
        // this.bottles = bottles.map(b => new Bottle(this, 100 + 300 * (i), b));
        this.bottles = bottles.map(b => new Bottle(this, 50 * (i++) + 5 * Math.sin(i * 93879823.234), b));

        console.log(`rendered ${bottles.length} bottles for cocktail ${cocktail.name}`);
        this.bottle_container.addChild(...this.bottles);
    }

    public pour = (score: number) => {
        if (this.poured_amount < this.pour_amount) {
            this.score += score;
            this.poured_amount += 1;
        } else {
            this.current_cocktail += 1;
            this.poured_amount = 0;
        }
    }

    public tick(delta: number, ticks: number) {
        if (this.poured_amount < this.pour_amount) {
            this.bottles.forEach(b => b.updateGame(ticks));
        } else {
            this.updateBottles();
        }
    }
}