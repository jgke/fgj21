import * as PIXI from 'pixi.js';
import { assets } from './assets';
import {GameObject} from './GameObject';

class Player extends PIXI.Graphics {
    constructor() {
        super();
        this.beginFill(0x9966FF);
        this.drawCircle(0, 0, 32);
        this.endFill();
    }

    public getPosition() {
        return [this.x + 800 / 2, this.y + 600 / 2];
    }

    public setPosition(x: number, y: number) {
        this.x = x - 800 / 2;
        this.y = y - 600 / 2;
    }
}

export class HouseMap extends GameObject {
    private map: PIXI.Sprite;
    private hotspots = [
        [200, 350],
        [200, 200],
        [500, 200],
        [500, 350],
        [200, 50],
        [150, 50],
        [350, 50]
    ]

    private targets = [0, 3, 5, 6];

    private routes = {
        0: [1],
        1: [0, 2, 4],
        2: [1, 3],
        3: [2],
        4: [1, 5, 6],
        5: [4],
        6: [4]
    };

    private drunkard: Player;
    private playerRoute: number[];
    private currentTarget: number;

    constructor(width: number, app: PIXI.Application) {
        super();

        this.width = width;
        this.height = app.renderer.height;

        this.drunkard = new Player();
        this.playerRoute = this.findRoute(0, 1, {});
        this.currentTarget = this.playerRoute.pop();
        this.drunkard.setPosition(this.hotspots[0][0], this.hotspots[0][1]);

        const map = new PIXI.Sprite(assets.tmpmap.texture);
        map.x = width / 2;
        map.y = app.renderer.height / 2;
        map.anchor.x = 0.5;
        map.anchor.y = 0.5;
        map.addChild(this.drunkard);
        this.addChild(map);

        for (let a = 0; a < this.hotspots.length; a++) {
            for (let b = 0; b < this.hotspots.length; b++) {
                if (this.findRoute(a, b, {}) === undefined) {
                    console.warn("Could not find route from", a, "to", b);
                }
            }
        }
    }

    private findRoute(from: number, to: number, used: any): number[] {
        if (from == to) {
            return [];
        }
        if (used[from]) {
            return undefined;
        }
        used[from] = true;
        for (const option of this.routes[from]) {
            const route = this.findRoute(option, to, used);
            if (route !== undefined) {
                route.push(option);
                return route;
            }
        }
    }

    public tick(delta: number) {
        let playerSpeed = 10;
        let target = this.hotspots[this.currentTarget];
        let pPos = this.drunkard.getPosition();
        let dx = target[0] - pPos[0];
        let dy = target[1] - pPos[1];

        if (dx * dx + dy * dy <= 10) {
            if (this.playerRoute.length === 0) {
                let curIndex = this.targets.indexOf(this.currentTarget);
                let newTarget = Math.floor(Math.random() * (this.targets.length - 1));
                if (newTarget >= this.currentTarget) {
                    newTarget += 1;
                }
                this.playerRoute = this.findRoute(this.currentTarget, this.targets[newTarget], {});
                console.log("New route from", this.currentTarget, "to", this.targets[newTarget], ": ", this.playerRoute);
            } else {
                this.currentTarget = this.playerRoute.pop();
            }
        } else {
            let x = Math.sign(dx) * Math.min(Math.abs(dx), playerSpeed * delta);
            let y = Math.sign(dy) * Math.min(Math.abs(dy), playerSpeed * delta);
            this.drunkard.setPosition(x + pPos[0], y + pPos[1]);
        }
    }
}