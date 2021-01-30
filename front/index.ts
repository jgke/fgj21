import * as PIXI from 'pixi.js';
import './reset.css';
import './index.css';
import { assets, loadAssets } from './src/assets';
import { SEPARATOR_WIDTH } from './src/constants';
import {map} from "./src/map";
import { minigame } from './src/minigame';
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
divider.drawRect(app.renderer.width/2, 0, SEPARATOR_WIDTH, app.renderer.height);
divider.endFill();


function init() {
    const left = map((app.renderer.width - SEPARATOR_WIDTH) / 2, app);
    const right = minigame((app.renderer.width - SEPARATOR_WIDTH) / 2, app);
    right.position.x = app.renderer.width / 2 + SEPARATOR_WIDTH / 2;
    app.stage.addChild(left);
    app.stage.addChild(divider);
    app.stage.addChild(right);
    
    

    {
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fill: "white",
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });
        const msg = new PIXI.Text("Quo vadis?", style);
        msg.position.x = app.renderer.width / 2;
        msg.position.y = 100;
        msg.anchor.x = 0.5;

        app.stage.addChild(msg);
    }
        const player = assets.disco;
        player.loop = true;

        const reverb = new Tone.Freeverb(0);
        const delay = new Tone.FeedbackDelay(0);

        reverb.roomSize.rampTo(0.8, 10);
        delay.feedback.rampTo(0.8, 10);

        player.chain(reverb, delay, Tone.Destination);

        player.start();
}

loadAssets().then(_assets => {
    const div = document.createElement("div");
    div.id = "startbuttonContainer";
    const button = document.createElement("button");
    button.id = "startbutton";
    button.textContent = "Start";
    button.onclick = () => {
        document.body.removeChild(div);
        Tone.start().then(() => init())
    };
    div.appendChild(button);
    document.body.appendChild(div);
});