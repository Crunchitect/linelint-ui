<script lang="ts" setup>
import { ref } from 'vue';
import Moveable, { type OnDrag } from 'vue3-moveable';
import { dimensions, startPos, endPos, imageFile, sensorData, junctionData } from '@/state/Editor';
import { reshapeBytes, toBinaryImage, getClosestBlackPixel } from '@/lib/imageproc';
import { AStarFinder } from 'astar-typescript';

const hasFile = ref(false);
const mapCanvas = ref(null as null | HTMLCanvasElement);
const startEl = ref(null as null | HTMLElement);
const endEl = ref(null as null | HTMLElement);

const updateFile = function (evt: Event) {
    const context = mapCanvas.value!.getContext("2d");
    const img = new Image();
    //@ts-ignore
    const files = evt.target!.files;
    const file = files![0];
    imageFile.value = file;
    if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            if (evt.target!.readyState == FileReader.DONE) {
                img.src = <string>evt.target!.result ?? "";
                img.onload = () => {
                    context!.canvas.width = img.width;
                    context!.canvas.height = img.height;
                    dimensions.value = [img.width, img.height]
                    context!.drawImage(img, 0, 0);
                    const { left, top } = mapCanvas.value?.getBoundingClientRect() ?? new DOMRect();
                    startEl.value!.style.transform = `translate(${left}px, ${top}px`;
                    endEl.value!.style.transform = `translate(${left}px, ${top}px)`;
                };
                hasFile.value = true;
                
            }
        }

    } else {
        alert("Not an image!");
    }
};

const onDrag = (e: OnDrag, item: string) => {
    const [x, y, _, _2] = e.translate;
    const { width: elWidth, height: elHeight } = e.target.getBoundingClientRect() ?? new DOMRect();
    const [ width, height ] = dimensions.value ?? [0, 0];
    const { left, right, top, bottom, width: cwidth, height: cheight } = mapCanvas.value?.getBoundingClientRect() ?? new DOMRect();
    const clamped_x = Math.min(Math.max(x, left), right);
    const clamped_y = Math.min(Math.max(y, top), bottom);
    e.target.style.transform = `translate(${clamped_x}px, ${clamped_y}px)`;
    const tuned_x = (clamped_x - left + elWidth / 2) / cwidth * width;
    const tuned_y = (clamped_y - top + elHeight / 2) / cheight * height;

    switch (item) {
        case 'start':
            startPos.value = [tuned_x, tuned_y];
            break;
        case 'finish':
            endPos.value = [tuned_x, tuned_y];
            break;
    }
};

const generatePath = () => {
    const context = mapCanvas.value?.getContext("2d", {willReadFrequently: true})!;
    const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    const imgArray = toBinaryImage(reshapeBytes(imgData.data, imgData.width, imgData.height));
    const aStarInstance = new AStarFinder({
        grid: {
            matrix: imgArray
        },
        diagonalAllowed: false
    });
    if (!startPos.value || !endPos.value) return;
    const start = getClosestBlackPixel(imgArray, ...startPos.value);
    const end = getClosestBlackPixel(imgArray, ...endPos.value);
    const path = aStarInstance.findPath(
        {x: start[0], y: start[1]},
        {x: end[0], y: end[1]},
    );

    const currentJunction = ref('');

    path.forEach(location => {
        
    });
};
</script>


<template>
    <div class="rounded w-full h-[90%] bg-slate-100 flex flex-wrap place-content-center">
        <input type="file" class="w-full h-full opacity-0 z-50 absolute" v-if="!hasFile" @change="updateFile"
            @click.prevent>
        <canvas ref="mapCanvas" v-show="hasFile"
            class="rounded border-black border-2 max-w-[50vmin] max-h[50vmin]"></canvas>
        <div id="start" v-show="hasFile">
            <i class="fa-solid fa-location-crosshairs text-[3vmin] absolute top-0 left-0 text-cyan-400"
                ref="startEl"></i>
            <Moveable :target="startEl" :draggable="true" :origin="false" :hide-default-lines="true" @drag="e => onDrag(e, 'start')"/>
        </div>
        <div id="end" v-show="hasFile">
            <i class="fa-solid fa-flag-checkered text-[3vmin] absolute top-0 left-0"
                ref="endEl"></i>
            <Moveable :target="endEl" :draggable="true" :origin="false" :hide-default-lines="true" @drag="e => onDrag(e, 'finish')" />
        </div>
        <div v-if="!hasFile" class="flex flex-col h-full items-center justify-center gap-2">
            <i class="fa-solid fa-file-upload text-[10vw] text-center opacity-30"></i>
            <p class="font-bold text-center opacity-30">Upload your map here.</p>
        </div>
    </div>
    <button class="w-full h-[5%] bg-slate-100" @click="generatePath">
        <i class="fa-solid fa-map-location-dot"></i> Generate Path
    </button>
</template>