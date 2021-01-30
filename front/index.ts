import * as PIXI from 'pixi.js';
import './reset.css';
import './index.css';
import { assets, loadAssets } from './src/assets';
import { SEPARATOR_WIDTH } from './src/constants';
import { HouseMap } from "./src/map";
import { Minigame } from './src/minigame';
import * as Tone from 'tone';
import { distance } from './src/distance';

function drunkCanvas(original: HTMLCanvasElement, width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.className = "drunkCanvas"
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");

    window.setInterval(
        _ => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(original, 0, 0);
        }, 1000 / 60)

    return canvas;
}

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application({ preserveDrawingBuffer: true });

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);
let drunkContainer = document.createElement("div");
drunkContainer.className = "drunkContainer;"
let drunk = drunkCanvas(app.view, window.innerWidth, window.innerHeight);
//drunkContainer.appendChild(drunk);
//document.body.appendChild(drunk);

const divider = new PIXI.Graphics();
divider.beginFill(0xFF0000);
divider.drawRect(app.renderer.width / 2, 0, SEPARATOR_WIDTH, app.renderer.height);
divider.endFill();

let ticks = 0;
let ticker = (delta: number) => { };

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

    app.stage.addChild(left, divider, right);

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

    app.stage.addChild(msg, score_txt);

    ticker = delta => {
        ticks += delta;
        left.tick(delta, ticks);
        right.tick(delta, ticks);
        game.score = right.score;
        score_txt.text = `Score: ${game.score.toFixed(0)}`;
        time -= delta / 60;
        msg.text = `${Math.round(time)}`
        if (time <= 0) {
            app.stage.removeChildren();
            initMorning(left.getHistory());
        }
    };
}

function playSound() {
    const player = assets.disco;
    player.loop = true;

    const reverb = new Tone.Freeverb(0);
    const delay = new Tone.FeedbackDelay(0);

    //reverb.roomSize.rampTo(0.8, 10);
    //delay.feedback.rampTo(0.8, 10);

    player.chain(/*reverb, delay,*/ Tone.Destination);

    player.start();
}

function h2(text: string) {
    const elem = document.createElement("h2");
    elem.textContent = text;
    return elem;
}

function span(text: string) {
    const elem = document.createElement("span");
    elem.textContent = text;
    return elem;
}

function clamp(a: number, x: number, b: number) {
    if (a > x) {
        return a;
    } else if (b < x) {
        return b;
    }
    return x;
}

function swapNodes(node: HTMLElement, beforeIndex: number, afterIndex: number) {
    node.parentNode.insertBefore(
        node.parentNode.children[clamp(0, afterIndex, node.parentNode.children.length - 1)],
        node.parentNode.children[clamp(0, beforeIndex, node.parentNode.children.length - 1)])
};

function shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function initMorning(history: string[]) {
    let start = history[0];
    let end = history[history.length - 1];
    let middle = history.slice(1, history.length - 1);
    let scrambledMiddle = shuffle([...middle]);

    const container = document.createElement("div");
    container.id = "retraceList"
    container.appendChild(h2("Retrace your steps!"));
    container.appendChild(span(`You started from ${start}, but what happened then?`));

    const nl = document.createElement("ol");
    scrambledMiddle.forEach((element, i) => {
        const li = document.createElement("li");

        const up = document.createElement("button");
        up.textContent = "Move up";
        up.className = "moveUp";

        up.onclick = () => {
            const index = [...li.parentNode.childNodes as any as HTMLElement[]].indexOf(li);
            swapNodes(li, index - 1, index);
        }

        const down = document.createElement("button");
        down.textContent = "Move down";
        down.className = "moveDown";
        down.onclick = () => {
            const index = [...li.parentNode.childNodes as any as HTMLElement[]].indexOf(li);
            swapNodes(li, index, index + 1);
        }

        li.appendChild(span(`${element}`));
        li.appendChild(up);
        li.appendChild(down);

        nl.appendChild(li);
    });
    container.appendChild(nl);

    container.appendChild(span(`Finally you end up at ${end}`));

    let cont = false;
    const continueButton = document.createElement("button");
    continueButton.id = "continueButton";
    continueButton.textContent = "Continue";
    continueButton.onclick = () => { cont = true; };
    container.appendChild(continueButton);

    document.body.appendChild(container);



    ticker = (delta: number) => {
        if (cont) {
            let options = new Set(history);
            let indices = {};
            let index = 0;
            options.forEach(key => {
                indices[key] = index;
                index += 1;
            });

            let answers = [...nl.childNodes as any as HTMLElement[]].map(elem => elem.firstChild.textContent);
            console.log(answers)
            console.log(middle)
            console.log(scrambledMiddle)
            const dist = distance(
                answers.map(key => indices[key]),
                middle.map(key => indices[key])
            );
            const percentage = (answers.length - dist) / answers.length;
            document.body.removeChild(container);

            const secondContainer = document.createElement("div");
            secondContainer.id = "retraceList"
            const continueButton = document.createElement("button");
            continueButton.id = "continueButton";
            continueButton.textContent = `You got ${Math.round(100 * percentage)}% correctly`;
            continueButton.onclick = () => {
                document.body.removeChild(secondContainer);
                initNight();
            };
            secondContainer.appendChild(continueButton);
            document.body.appendChild(secondContainer);

            cont = false;
        }
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
        Tone.start().then(() => {
            playSound();
            initNight();
        });
        //Tone.start().then(() => initMorning(["1", "first", "second", "third", "fourth", "2"]))
    };
    div.appendChild(button);
    document.body.appendChild(div);
});