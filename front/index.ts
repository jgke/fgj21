import * as PIXI from 'pixi.js';
import './reset.css';
import { assets, loadAssets } from './src/assets';
import { SEPARATOR_WIDTH } from './src/constants';
import {map} from "./src/map";
import { minigame } from './src/minigame';

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

app.stage.addChild(map((app.renderer.width - SEPARATOR_WIDTH)/2));
app.stage.addChild(divider);
app.stage.addChild(minigame((app.renderer.width - SEPARATOR_WIDTH)/2));

loadAssets().then(assets => {
    const nopat = new PIXI.Sprite(assets.nopat.texture);

    nopat.x = app.renderer.width / 2;
    nopat.y = app.renderer.height / 2;
 
    nopat.anchor.x = 0.5;
    nopat.anchor.y = 0.5;
 
    app.stage.addChild(nopat);
 
    app.ticker.add(() => {
        nopat.rotation += 0.01;
    });
})

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

    app.stage.addChild(msg);
}
