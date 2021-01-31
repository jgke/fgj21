export function drunkCanvas(original: HTMLCanvasElement, width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.className = "drunkCanvas"
    canvas.id = "drunkCanvas"
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");

    window.setInterval(
        _ => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(original, 0, 0);
        }, 1000 / 60)

    return canvas;
}

export function showDrunk() {
    document.getElementById("drunkCanvas").className = "drunkCanvas showDrunkCanvas";
}

export function hideDrunk() {
    document.getElementById("drunkCanvas").className = "drunkCanvas";
}