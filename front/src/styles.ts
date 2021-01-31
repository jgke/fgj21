import * as PIXI from 'pixi.js';

export const timerStyle = new PIXI.TextStyle({
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

export const bottleStyle = new PIXI.TextStyle({
    fontFamily: "Comic Sans MS",
    fontSize: 40,
    fill: "white",
    stroke: '#000000',
    strokeThickness: 1,
    align : 'center',
  });
