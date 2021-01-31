import { distance } from './distance';

import { hideDrunk } from './drunkCanvas';

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
export function initMorning(history: string[], initNext: (percentage: number) => void) {
    hideDrunk();
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

    return (delta: number) => {
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
            continueButton.textContent = `You got ${Math.round(100 * percentage)}% correct`;
            continueButton.onclick = () => {
                document.body.removeChild(secondContainer);
                initNext(Math.round(100 * percentage));
            };
            secondContainer.appendChild(continueButton);
            document.body.appendChild(secondContainer);

            cont = false;
        }
    };
}