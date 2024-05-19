<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import { imageFile } from '@/state/Editor';
    import { clamp } from '@/lib/math';
    import { startPos, dimensions } from '@/state/Editor';

    // TODO: (2 hr.) ZOOM AT START_POS AND EDITABLE ROBOT DIR AND SENSORS.

    const sensorCanvas = ref<HTMLCanvasElement | null>();
    const reader = new FileReader();
    const hasFile = ref(false);
    const zoom = ref(2);

    const zoomInSensor = () => {
        const [ x, y ] = startPos.value ?? [0, 0];
        const [ w, h ] = dimensions.value ?? [0, 0];
        const top = clamp(x, 0, w);
        const left = clamp(y, 0, h);
        const width = (w / (2 * zoom.value));
        const height = (h / (2 * zoom.value));
        const context = sensorCanvas.value?.getContext("2d");
        const imgData = context?.getImageData(top, left, width, height);
        console.log("!");
        context!.canvas.width = imgData?.width ?? 0;
        context!.canvas.height = imgData?.height ?? 0;
        context?.putImageData(imgData!, 0, 0);
    }

    const updateCanvas = async () => {
        hasFile.value = !!imageFile.value;
        const img = new Image();
        const context = sensorCanvas.value?.getContext("2d", {willReadFrequently: true});
        if(hasFile.value) {
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
                        };
                    }
                };
            } catch (e) {
                console.log(e)
            }
        }
    }

    watch([imageFile, startPos], updateCanvas);
    onMounted(updateCanvas);

</script>

<template>
    <div class="rounded w-full h-[95%] bg-slate-100 flex flex-wrap place-content-center">
        <canvas v-show="hasFile" ref="sensorCanvas" class="rounded border-2 border-black min-w-[30vw] max-w-[80vw] min-h-[30vh] max-h-[80vh] w-auto h-auto"></canvas>
        <div class="flex flex-col flex-wrap place-content-center" v-if="!hasFile">
            <i class="fa-solid fa-circle-xmark text-[10vw] text-center opacity-30"></i>
            <p class="font-bold text-center opacity-30">Oops! You haven't add a map yet, Please go to the Map section!</p>
        </div>
    </div>
</template>