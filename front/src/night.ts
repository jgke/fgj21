import * as PIXI from 'pixi.js';
import { SEPARATOR_WIDTH } from './constants';
import { HouseMap } from "./map";
import { Minigame } from './minigame';

import days from '../assets/json/days.json';

interface Day {
    name: string;
    par: number;
    cocktails: {
        name: string;
    }[];
    description: string;
}

let ticks = 0;

let timerStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 70,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
});

export class Game {
    public score = 0;
    public day: Day;

    pickDay = (index?: number) => {
        const d = (index === undefined ? days.days[Math.floor((days.days.length - 1) * Math.random())] : days.days[index]);
        this.day = d;
    }
}

export function initNight(app: PIXI.Application, initMorning: (_: string[]) => void) {
    const game = new Game();
    game.pickDay();

    const subwindow_width = (app.renderer.width - SEPARATOR_WIDTH) / 2;
    const left = new HouseMap(subwindow_width, app);

    const divider = new PIXI.Graphics();
    divider.beginFill(0xFF0000);
    divider.drawRect(app.renderer.width / 2, 0, SEPARATOR_WIDTH, app.renderer.height);
    divider.endFill();

    const right = new Minigame(subwindow_width + SEPARATOR_WIDTH * 1.5, subwindow_width, app, game.day.cocktails);

    app.stage.addChild(left, divider, right);

    let time = game.day.par;
    const msg = new PIXI.Text(`${time}`, timerStyle);
    msg.position.x = app.renderer.width / 2;
    msg.position.y = 100;
    msg.anchor.x = 0.5;

    const score_txt = new PIXI.Text("60", timerStyle);
    score_txt.position.x = app.renderer.width / 2;
    score_txt.position.y = app.renderer.height * .9;
    score_txt.anchor.x = 0.5;
    score_txt.text = `Score: ${game.score}`;

    const day_txt = new PIXI.Text(`${game.day.name}`, timerStyle);
    day_txt.position.x = app.renderer.width / 2;
    day_txt.position.y = 20;
    day_txt.anchor.x = 0.5;

    app.stage.addChild(msg, score_txt, day_txt);

    return delta => {
        ticks += delta;
        left.tick(delta, ticks);
        right.tick(delta, ticks);
        game.score = right.getScore();
        score_txt.text = `Score: ${game.score.toFixed(0)}`;
        time -= delta / 60;
        msg.text = `${Math.round(time)}`
        if (time <= 0) {
            app.stage.removeChildren();
            initMorning(left.getHistory());
        }
    };
}
