import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import { assets } from './assets';
import { Bottle, BottleOptions, Pour } from './bottle';
import { GameObject } from './GameObject';

import bottles from '../assets/json/bottles.json';
import all_cocktails from '../assets/json/cocktails.json';
import { shuffle } from './functions';
import { MovableSprite } from './movables';

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
    private current_pours: Pour[] = [];
    private bar_container: PIXI.Sprite;
    private bottle_container = new PIXI.Container();
    private cocktail_dictionary: { [index: string]: Cocktail };
    private bottle_dictionary: { [index: string]: BottleOptions };
    private counter_height: number;
    private bottle_name: PIXI.Text;
    private bottle_text: PIXI.Text;

    public getScore = () => { return this.score; }

    constructor(x: number, width: number, app: PIXI.Application, cocktails: { name: string }[]) {
        super();

        this.position.x = x;
        const minigame_mask = new PIXI.Graphics().beginFill(0xFF0033).drawRect(x, 0, width, app.renderer.height).endFill();
        this.mask = minigame_mask;

        this.bar_container = new MovableSprite(assets.baari_bg.texture);

        this.counter_height = this.bar_container.height * .55;
        const counter = new PIXI.Sprite(assets.counter.texture);
        counter.y = this.counter_height;
        const bar_lighting = new PIXI.Sprite(assets.baari_shading.texture);

        this.bar_container.addChild(counter)

        // all_cocktails.cocktails.forEach(c => { if (todays_cocktail_names.includes(c.name)) this.todays_cocktails.push(c); });
        this.todays_cocktails = cocktails.map(c => c.name);
        this.bottle_dictionary = bottles.bottles
            .reduce((a, bottle) => ({ ...a, [bottle.name]: bottle }), {})
        this.cocktail_dictionary = all_cocktails.cocktails
            .reduce((a, cocktail) => ({ ...a, [cocktail.name]: cocktail }), {})
        this.updateBottles();

        this.bottle_container.y = this.counter_height;
        // Bottles start rendering on the counter from this x position
        this.bottle_container.x = width * .3;
        this.bottle_container.interactiveChildren = true;
        this.bar_container.addChild(this.bottle_container);

        this.bar_container.addChild(bar_lighting);

        const laatikko = new PIXI.Container();

        this.bottle_name = this.bottleText(width, app.renderer.height, 1);
        this.bottle_text = this.bottleText(width, app.renderer.height, 0);

        const scale = app.renderer.height / this.bar_container.height;
        this.bar_container.scale.set(scale, scale);
        this.addChild(this.bar_container);
    }

    private bottleText(width: number, height: number, y: number): PIXI.Text {
        const fontSize = 30;
        const text = new PIXI.Text("", {
            fontFamily: "Arial",
            fontSize: fontSize,
            fill: "white",
            stroke: '#000000',
        });
        text.anchor.x = 1;
        text.anchor.y = 1;
        text.x = width;
        text.y = height - 50 * y;
        this.addChild(text);
        return text;
    }

    private showScoreText(score: string): PIXI.Text {
        console.log(score);
        const text = new PIXI.Text(`${score}`, {
            fontFamily: "Arial",
            fontSize: 50,
            fill: "white",
            stroke: '#000000',
        });
        text.anchor.x = 0;
        text.anchor.y = 1;
        text.x = 100;
        text.y = this.bottle_name.y - 100;
        this.addChild(text);
        setTimeout(() => this.removeChild(text), 500);
        return text;
    }

    private destroyBottles = () => {
        console.log("Destroying bottles! (╯°□°）╯︵ ┻━┻")
        this.bottles.forEach(b => b.destroy())
        this.bottle_container.removeChildren();
        this.bottles = [];
    }

    private updateBottles = () => {
        this.destroyBottles();

        const cocktail = this.cocktail_dictionary[this.todays_cocktails[this.current_cocktail]]
        this.pour_amount = cocktail.pour_amount;

        let i = 0;
        // TODO: shuffle here?
        const bottles = shuffle(cocktail.bottles.map(b => this.bottle_dictionary[b.name]));

        if (bottles.includes(undefined)) {
            console.log("Cocktail is broken! Check that the bottle names are exactly as written in bottles.json");
        } else {
            // this.bottles = bottles.map(b => new Bottle(this, 100 + 300 * (i), b));
            this.bottles = bottles.map(b => new Bottle(this, 100 * (i++) + 5 * Math.sin(i * 93879823.234), b, (_: any) => {
                this.bottle_name.text = `${b.name} (${b.alcvol}%)`;
                this.bottle_text.text = b.description;
            }));

            console.log(`Cocktail number ${this.current_cocktail}: ${cocktail.name} with ${bottles.length} bottles. Available pours: ${this.pour_amount}`);
            this.bottle_container.addChild(...this.bottles);
        }
    }

    public pour = (pour: Pour) => {
        this.showScoreText(pour.judgement);
        if (this.poured_amount < this.pour_amount) {
            this.score += pour.score || 0;
            this.poured_amount += 1;
            this.current_pours.push(pour);
        }
        if (this.poured_amount >= this.pour_amount) {
            this.current_cocktail += 1;
            this.poured_amount = 0;
            this.updateBottles();
        }
    }

    public tick(delta: number, ticks: number) {
        if (this.poured_amount < this.pour_amount) {
            this.bottles.forEach(b => b.updateGame(ticks));
        }
    }
}