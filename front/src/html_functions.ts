import { clamp } from './functions';

export function h2(text: string) {
    const elem = document.createElement("h2");
    elem.textContent = text;
    return elem;
}
export function span(text: string) {
    const elem = document.createElement("span");
    elem.textContent = text;
    return elem;
}
export function swapNodes(node: HTMLElement, beforeIndex: number, afterIndex: number) {
    node.parentNode.insertBefore(
        node.parentNode.children[clamp(0, afterIndex, node.parentNode.children.length - 1)],
        node.parentNode.children[clamp(0, beforeIndex, node.parentNode.children.length - 1)]);
}
;
