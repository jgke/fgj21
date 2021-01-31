import * as PIXI from 'pixi.js';
import * as Tone from 'tone';
import './reset.css';
import './index.css';
import { assets, loadAssets } from './src/assets';

import { drunkCanvas, hideDrunk } from './src/drunkCanvas';
import { initNight } from './src/night';
import { initMorning } from './src/morning';

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
drunkContainer.className = "drunkContainer";
let drunk = drunkCanvas(app.view, window.innerWidth, window.innerHeight);
drunkContainer.appendChild(drunk);
document.body.appendChild(drunkContainer);

let ticker = (delta: number) => { };

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


function night() {
    ticker = initNight(app, history => morning(history));
}
function morning(history: string[]) {
    ticker = initMorning(history, _percentage => night());
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
            night();
        });
        //Tone.start().then(() => initMorning(["1", "first", "second", "third", "fourth", "2"]))
    };
    div.appendChild(button);
    document.body.appendChild(div);
});