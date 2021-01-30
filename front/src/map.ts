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
        return [this.x + 113 / 2, this.y + 121 / 2];
    }

    public setPosition(x: number, y: number) {
        this.x = x - 113 / 2;
        this.y = y - 121 / 2;
    }
}

//senkin homonaama

export class HouseMap extends GameObject {
    private hotspots = [
        [15, 25],
        [15, 60],
        [30, 60],
        [30, 25],
         [30, 70],
        [25, 70],
        [30, 80],
        [10, 80],
        [10, 90],
         [15, 90],
        [20, 110],
        [60, 80],
        [60, 30],
        [80, 80],
         [80, 105],
        [90,105],
        [80, 30],
        [90, 30],
        [100, 80]
    ]

    private routes = {
        0: [1],
        1: [0, 2,],
        2: [1, 3, 5, 6, 12],
        3: [2, 4],
        4: [3],
        5: [2],
        6: [5, 7, 11],
        7: [6, 8],
        8: [7, 9, 10],
        9: [8],
        10: [8],
        11: [6, 12, 13, 14, 17, 18],
        12: [2, 11],
        13: [11],
        14: [11, 17, 18],
        17: [11, 14, 18],
        18: [11, 14, 17]
    };

    private targets = [0, 3, 5, 6, 9, 10 ,11, 12, 14, 17, 18];

    private targetNames = {
        0: "Kitchen",
        3: "Larder",
        5: "Powder Room",
        6: "Entry Hall",
        9: "Servant's Bathroom",
        10: "Servant's Room",
        11: "Foyer",
        12: "Parlor",
        13: "Drawing room",
        14: "Boudoir",
        17: "Master Bedroom",
        18: "Master Bathroom"


    };

    

    private house: PIXI.Sprite;
    private drunkard: Player;
    private playerRoute: number[];
    private currentTarget: number;
    private history: number[];

    constructor(width: number, app: PIXI.Application) {
        super();

        this.width = width;
        this.height = app.renderer.height;

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF);
        bg.drawRect(0, 0, width, app.renderer.height);
        bg.endFill();

        this.addChild(bg);

        this.drunkard = new Player();
        this.history = [0];
        this.playerRoute = this.findRoute(this.history[0], 3, {});
        this.currentTarget = this.playerRoute.pop();
        this.drunkard.setPosition(this.hotspots[0][0], this.hotspots[0][1]);

        this.house = new PIXI.Sprite(assets.tmpmap.texture);
        this.house.x = width / 2;
        this.house.y = app.renderer.height / 2;
        this.house.scale.x = 5;
        this.house.scale.y = 5;
        this.house.anchor.x = 0.5;
        this.house.anchor.y = 0.5;
        this.house.addChild(this.drunkard);
        this.addChild(this.house);
        this.drunkard.scale.x = 1/5;
        this.drunkard.scale.y = 1/5;

        console.log(this.house.getGlobalPosition());
        console.log(this.drunkard.getGlobalPosition());

        // for (let a = 0; a < this.hotspots.length; a++) {
        //     for (let b = 0; b < this.hotspots.length; b++) {
        //         if (this.findRoute(a, b, {}) === undefined) {
        //             console.warn("Could not find route from", a, "to", b);
        //         }
        //     }
        // }
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

    public tick(delta: number, ticks: number) {
        let playerSpeed = 1;
        let target = this.hotspots[this.currentTarget];
        let pPos = this.drunkard.getPosition();
        let dx = target[0] - pPos[0];
        let dy = target[1] - pPos[1];


        if (dx * dx + dy * dy <= 10) {
            if (this.playerRoute.length === 0) {
                this.history.push(this.currentTarget);
                let curIndex = this.targets.indexOf(this.currentTarget);
                let newTarget = Math.floor(Math.random() * (this.targets.length - 1));
                if (newTarget >= curIndex) {
                    newTarget += 1;
                }
                this.playerRoute = this.findRoute(this.currentTarget, this.targets[newTarget], {});
                //console.log("New route from", this.currentTarget, "to", this.targets[newTarget], ": ", this.playerRoute);
                this.currentTarget = this.playerRoute.pop();
            } else {
                this.currentTarget = this.playerRoute.pop();
            }
        } else {
            let x = Math.sign(dx) * Math.min(Math.abs(dx), playerSpeed * delta);
            let y = Math.sign(dy) * Math.min(Math.abs(dy), playerSpeed * delta);
            this.drunkard.setPosition(x + pPos[0], y + pPos[1]);
        }
    }

    public getHistory(): string[] {
        return this.history.map(n => this.targetNames[n]);
    }
}