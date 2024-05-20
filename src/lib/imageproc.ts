import type { Image, BinaryImage } from "./types";

export function reshapeBytes(im: Uint8ClampedArray, width: number, height: number) {
    const image = [] as Image;
    for (let y = 0; y < height; y++) {
        image.push([]);
        for (let x = 0; x < width; x++) {
            // @ts-ignore: Populate Later
            image[y].push([]);
            for (let c = 0; c < 4; c++) {
                image[y][x].push(im[y * width * 4 + x * 4 + c]);
            }
        }
    }
    return image;
}

export function toBinaryImage(im: Image) {
    return im.map(row => 
        row.map( pixel =>
            Number((pixel.reduce((a, b) => a + b) / 4) > 127)
        )
    );
}

export function bitwiseNot(im: BinaryImage) {
    return im.map(row =>
        row.map(pixel => 
            Number(!pixel)
        )
    );
}

export function getClosestBlackPixel(im: BinaryImage, x: number, y: number) {
    x = Math.round(x);
    y = Math.round(y);
    let sum = 0;
    while (true) {
        for (let dx = 0; dx <= sum; dx++) {
            let dy = sum - dx;
            for (const sign of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
                if (im[y + dy * sign[1]][x + dx * sign[0]] == 0)
                    return [x + dx * sign[0], y + dy * sign[1]];
            }
        }
        sum++;
    }
}