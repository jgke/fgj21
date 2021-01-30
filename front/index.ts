import * as PIXI from 'pixi.js';
import './reset.css';
import './index.css';
import { assets, loadAssets } from './src/assets';
import { SEPARATOR_WIDTH } from './src/constants';
import { HouseMap } from "./src/map";
import { Minigame } from './src/minigame';
import * as Tone from 'tone';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

const divider = new PIXI.Graphics();
divider.beginFill(0xFF0000);
divider.drawRect(app.renderer.width / 2, 0, SEPARATOR_WIDTH, app.renderer.height);
divider.endFill();

let ticks = 0;
let ticker = (delta: number) => {};

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
}


function initNight() {
    const game = new Game();
    
    const subwindow_width = (app.renderer.width - SEPARATOR_WIDTH) / 2;
    const left = new HouseMap(subwindow_width, app);
    const right = new Minigame(subwindow_width + SEPARATOR_WIDTH, subwindow_width, app);

    app.stage.addChild(left);
    app.stage.addChild(divider);
    app.stage.addChild(right);

    let time = 5;
    const msg = new PIXI.Text(`${time}`, timerStyle);
    msg.position.x = app.renderer.width / 2;
    msg.position.y = 100;
    msg.anchor.x = 0.5;

    const score_txt = new PIXI.Text("60", timerStyle);
    score_txt.position.x = app.renderer.width / 2;
    score_txt.position.y = 20;
    score_txt.anchor.x = 0.5;
    score_txt.text = `Score: ${game.score}`;

    app.stage.addChild(msg);
    app.stage.addChild(score_txt);

    ticker = delta => {
        ticks += delta;
        left.tick(delta, ticks);
        right.tick(delta, ticks);
        game.score = right.score;
        score_txt.text = `Score: ${game.score.toFixed(0)}`;
        time -= delta / 60;
        msg.text = `${Math.round(time)}`
        if(time <= 0){
            app.stage.removeChildren();
            initMorning(left.getHistory());
        }
    };

    const player = assets.disco;
    player.loop = true;

    const reverb = new Tone.Freeverb(0);
    const delay = new Tone.FeedbackDelay(0);

    reverb.roomSize.rampTo(0.8, 10);
    delay.feedback.rampTo(0.8, 10);

    player.chain(reverb, delay, Tone.Destination);

    player.start();
}

function initMorning(history: number[]) {
    console.log(history);
    let msg = new PIXI.Text(`History: ${history}`, timerStyle );
    msg.position.x = app.renderer.width / 2;
    msg.position.y = 100;
    msg.anchor.x = 0.5;
    app.stage.addChild(msg);
    ticker = (delta: number) => {
    };
}

app.ticker.add((delta: number) => {
    ticker(delta);
});

loadAssets().then(_assets => {
    const div = document.createElement("div");
    div.id = "startbuttonContainer";
    const button = document.createElement("button");
    button.id = "startbutton";
    button.textContent = "Start";
    button.onclick = () => {
        document.body.removeChild(div);
        Tone.start().then(() => initNight())
    };
    div.appendChild(button);
    document.body.appendChild(div);
});