import * as PIXI from 'pixi.js';
import './reset.css';
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

// load the texture we need
PIXI.Loader.shared.add('bunny', require('./assets/img/bunny.png')).load((loader, resources) => {
    // This creates a texture from a 'bunny.png' image.
    const bunny = new PIXI.Sprite(resources.bunny.texture);
 
    // Setup the position of the bunny
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;
 
    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;
 
    // Add the bunny to the scene we are building.
    app.stage.addChild(bunny);
 
    // Listen for frame updates
    app.ticker.add(() => {
         // each frame we spin the bunny around a bit
        bunny.rotation += 0.01;
    });
});

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
