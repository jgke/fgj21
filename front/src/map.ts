import * as PIXI from 'pixi.js';
import { assets } from './assets';

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

export function map (width: number, app: PIXI.Application) { 
    const container = new PIXI.Container();
    container.width = width;
    container.height = app.renderer.height;
    const map = new PIXI.Sprite(assets.tmpmap.texture);

    const hotspots = [
        [200, 350],
        [200, 200],
        [500, 200],
        [500, 350],
        [200, 50],
        [150, 50],
        [350, 50]
    ]

    const targets = [0, 3, 5, 6];

    const routes = {
        0: [1],
        1: [0, 2, 4],
        2: [1, 3],
        3: [2],
        4: [1, 5, 6],
        5: [4],
        6: [4]
    };

    map.x = width / 2;
    map.y = app.renderer.height / 2;
 
    map.anchor.x = 0.5;
    map.anchor.y = 0.5;

    const drunkard = new Player();
 
    map.addChild(drunkard);
    container.addChild(map);

    let position = 0;

    const findRoute = (from: number, to: number, used: any): number[] => {
        if(from == to) {
            return [];
        }
        if(used[from]) {
            return undefined;
        }
        used[from] = true;
        for(const option of routes[from]) {
            const route = findRoute(option, to, used);
            if(route !== undefined) {
                route.push(option);
                return route;
            }
        }
    }

    let playerRoute = findRoute(0, 1, {});
    let currentTarget = playerRoute.pop();
    drunkard.setPosition(hotspots[0][0], hotspots[0][1]);

    for (let a = 0; a < hotspots.length; a++) {
        for (let b = 0; b < hotspots.length; b++) {
            if (findRoute(a, b, {}) === undefined) {
                console.warn("Could not find route from", a, "to", b);
            }
        }
    }

    let playerSpeed = 10;
 
    app.ticker.add(delta => {
        let target = hotspots[currentTarget];
        let pPos = drunkard.getPosition();
        let dx = target[0] - pPos[0];
        let dy = target[1] - pPos[1];

        if(dx*dx + dy * dy <= 10) {
            if (playerRoute.length === 0)  {
                let curIndex = targets.indexOf(currentTarget);
                let newTarget = Math.floor(Math.random() * (targets.length - 1));
                if(newTarget >= currentTarget) {
                    newTarget += 1;
                }
                playerRoute = findRoute(currentTarget, targets[newTarget], {});
                console.log("New route from", currentTarget, "to", targets[newTarget], ": ", playerRoute);
            } else {
                currentTarget = playerRoute.pop();
            }
        } else {
            let x = Math.sign(dx) * Math.min(Math.abs(dx), playerSpeed * delta);
            let y = Math.sign(dy) * Math.min(Math.abs(dy), playerSpeed * delta);
            drunkard.setPosition(x + pPos[0], y + pPos[1]);
        }
    });
    return container;
}