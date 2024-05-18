<script lang="ts" setup>
import { ref } from 'vue';
import Moveable, { type OnDrag } from 'vue3-moveable';
import { dimensions, startPos, endPos, imageFile } from '@/state/Editor';

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
    const { left, right, top, bottom } = mapCanvas.value?.getBoundingClientRect() ?? new DOMRect();
    const clamped_x = Math.min(Math.max(x, left), right);
    const clamped_y = Math.min(Math.max(y, top), bottom);
    e.target.style.transform = `translate(${clamped_x}px, ${clamped_y}px) translate(-50%, -50%)`;

    switch (item) {
        case 'start':
            startPos.value = [clamped_x, clamped_y];
            break;
        case 'finish':
            endPos.value = [clamped_x, clamped_y];
            break;
    }
};
</script>


<template>
    <div class="rounded w-full h-[95%] bg-slate-100 flex flex-wrap place-content-center">
        <input type="file" class="w-full h-full opacity-0 z-50 absolute" v-if="!hasFile" @change="updateFile"
            @click.prevent>
        <canvas ref="mapCanvas" v-show="hasFile"
            class="rounded border-black border-2 max-w-[50vw] max-h[50vh]"></canvas>
        <div id="start" v-show="hasFile">
            <i class="fa-solid fa-location-crosshairs text-[3vw] absolute top-0 left-0 text-cyan-400 -translate-x-1/2 -translate-y-1/2"
                ref="startEl"></i>
            <Moveable :target="startEl" :draggable="true" :origin="false" :hide-default-lines="true" @drag="e => onDrag(e, 'start')"/>
        </div>
        <div id="end" v-show="hasFile">
            <i class="fa-solid fa-flag-checkered text-[3vw] absolute top-0 left-0 translate-x-1/2 translate-y-full"
                ref="endEl"></i>
            <Moveable :target="endEl" :draggable="true" :origin="false" :hide-default-lines="true" @drag="e => onDrag(e, 'finish')" />
        </div>
        <div v-if="!hasFile" class="flex flex-col h-full items-center justify-center gap-2">
            <i class="fa-solid fa-file-upload text-[10vw] text-center opacity-30"></i>
            <p class="font-bold text-center opacity-30">Upload your map here.</p>
        </div>
    </div>
</template>