<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue';
import { imageFile } from '@/state/Editor';
import { clamp } from '@/lib/math';
import { startPos, dimensions, sensorGray } from '@/state/Editor';
import Moveable, { type MoveableRefTargetType, type MoveableRefType, type OnDrag, type OnRotate } from 'vue3-moveable';
import KeyModel from '@/components/Utils/KeyModel.vue';
import { calcSensor } from '@/lib/sensor';

const sensorCanvas = ref<HTMLCanvasElement | null>();
const reader = new FileReader();
const hasFile = ref(false);
const zoom = ref(4);
const updatedCanvas = ref(false);
const sensorCanvasDimensions = ref([0, 0]);
const shiftPressed = ref(false);

const robotOrigin = ref<HTMLElement | null>();

const zoomInSensor = () => {
    const [x, y] = startPos.value ?? [0, 0];
    const [w, h] = dimensions.value ?? [0, 0];
    const top = clamp(x - (w / (2 * zoom.value)), 0, w);
    const left = clamp(y - (h / (2 * zoom.value)), 0, h);
    const width = (w / zoom.value);
    const height = (h / zoom.value);
    const context = sensorCanvas.value?.getContext("2d");
    const imgData = context?.getImageData(top, left, width, height);
    context!.canvas.width = imgData?.width ?? 0;
    context!.canvas.height = imgData?.height ?? 0;
    context?.putImageData(imgData!, 0, 0);
    sensorCanvasDimensions.value = [imgData?.width ?? 0, imgData?.height ?? 0];
};

const updateCanvas = async () => {
    hasFile.value = !!imageFile.value;
    const img = new Image();
    const context = sensorCanvas.value?.getContext("2d", { willReadFrequently: true });
    if (hasFile.value) {
        try {
            reader.readAsDataURL(<Blob>(imageFile.value!));
            reader.onload = function (evt) {
                if (evt.target!.readyState == FileReader.DONE) {
                    img.src = <string>evt.target!.result ?? "";
                    img.onload = () => {
                        context!.canvas.width = img.width;
                        context!.canvas.height = img.height;
                        dimensions.value = [img.width, img.height]
                        context!.drawImage(img, 0, 0);
                        zoomInSensor();
                        updatedCanvas.value = true;
                    };
                }
            };
        } catch (e) { }
    }
};

const move = (e: OnDrag | OnRotate): void => {
    e.target.style.transform = e.transform;
};

const getVertGuidelines = () => {
    const bbox = sensorCanvas?.value?.getBoundingClientRect();
    if (!bbox) return;
    return [...Array(5).keys()].map((index) => {
        const thing = bbox.left + (bbox.width * index / 4);
        return thing;
    }
    );
};

const getHorzGuidelines = () => {
    const bbox = sensorCanvas?.value?.getBoundingClientRect();
    if (!bbox) return;
    return [...Array(5).keys()].map((index) => {
        const thing = bbox.top + (bbox.height * index / 4);
        return thing;
    }
    );
};

watch([imageFile, startPos, zoom], updateCanvas);
onMounted(updateCanvas);

</script>

<template>
    <div class="rounded w-full h-[95%] bg-slate-100 flex flex-wrap place-content-center">
        <canvas v-show="hasFile" ref="sensorCanvas"
            class="rounded border-2 border-black min-w-[30vw] max-w-[80vw] min-h-[30vh] max-h-[80vh] w-auto h-auto"></canvas>
    
        <div class="flex flex-col flex-wrap place-content-center" v-if="!hasFile">
            <i class="fa-solid fa-circle-xmark text-[10vw] text-center opacity-30"></i>
            <p class="font-bold text-center opacity-30">Oops! You haven't add a map yet, Please go to the Map section!
        </p>
        </div>
    </div>
    <div class="flex items-center justify-between w-full h-[5%]" v-if="hasFile">
        <div class="flex">
            <p class="font-bold">Scale: </p>
            <input class="rounded outline-none border-stone-400 w-14 text-right" type="number" step="0.1" v-model="zoom">
            <p class="font-bold">x</p>
        </div>
        <div class="flex">
            <p class="font-bold">Sensor Value for Gray: </p>
            <input class="rounded outline-none border-stone-400 w-14 text-right" type="number" step="0.1" v-model="sensorGray">
            <p class="font-bold">v</p>
        </div>
    </div>
    <div v-if="hasFile && updatedCanvas">
        <i class="fa-solid fa-circle-up text-[3vmin] absolute top-1/2 left-1/2 text-red-600" ref="robotOrigin"></i>
        <Moveable :target="robotOrigin" :dragArea="true" :container="sensorCanvas"
            :bounds="sensorCanvas?.getBoundingClientRect()" :draggable="true" :rotatable="true" :snappable="true"
            :origin="false" :snapRotataionThreshold="15" :snapRotationDegrees="[0, 90, 180, 270]"
            :snapDirections="{ middle: true, center: true }" :verticalGuidelines="getVertGuidelines()"
            :horizontalGuidelines="getHorzGuidelines()" @drag="move" @rotate="move" @render="calcSensor(<any>$refs, <[number, number]>sensorCanvasDimensions)" />
    </div>
    <div v-if="hasFile && updatedCanvas" v-for="index in [...Array(5).keys()]">
        <span class="fa-stack fa-sm absolute top-1/2 left-1/2" :ref="`sensor-${index}`">
            <div class="w-7 h-7 rounded bg-black text-white mx-1 font-bold text-center" v-if="shiftPressed">{{ index }}</div>
            <i :class="`fa-solid fa-square fa-stack-2x`" v-else></i>
            <i class="fa-solid fa-code-fork fa-stack-1x text-white " v-if="!shiftPressed"></i>
        </span>
        <Moveable :target="<MoveableRefTargetType>($refs[`sensor-${index}`])" :dragArea="true" :container="sensorCanvas"
            :bounds="sensorCanvas?.getBoundingClientRect()" :draggable="true" :rotatable="true" :snappable="true"
            :origin="false" :snapRotataionThreshold="15" :snapRotationDegrees="[0, 90, 180, 270]"
            :snapDirections="{ middle: true, center: true }" :verticalGuidelines="getVertGuidelines()"
            :horizontalGuidelines="getHorzGuidelines()" :elementGuidelines="[robotOrigin]"
            @drag="move" @rotate="move" @render="calcSensor(<any>$refs, <[number, number]>sensorCanvasDimensions)" />
    </div>
    <KeyModel :keyCode="16" v-model="shiftPressed" />
</template>