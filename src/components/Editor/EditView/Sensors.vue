<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { imageFile } from '@/state/Editor';
    import { clamp } from '@/lib/math';
    import { startPos, dimensions } from '@/state/Editor';

    // TODO: (2 hr.) ZOOM AT START_POS AND EDITABLE ROBOT DIR AND SENSORS.

    const sensorCanvas = ref<HTMLCanvasElement | null>();
    const reader = new FileReader();
    const hasFile = ref(false);
    const zoom = ref(5);

    watch(imageFile, () => {
        hasFile.value = !!imageFile.value;
        if(hasFile.value) {
            reader.readAsDataURL(<Blob>(imageFile.value!));
            reader.onload = function (evt) {
                if (evt.target!.readyState == FileReader.DONE) {
                    console.log("Done!!");
                }
            };
        }
    });

</script>

<template>
    <div class="rounded w-full h-[95%] bg-slate-100 flex flex-wrap place-content-center">
        <canvas v-show="hasFile" ref="sensorCanvas"></canvas>
        <div class="flex flex-col flex-wrap place-content-center" v-if="!hasFile">
            <i class="fa-solid fa-circle-xmark text-[10vw] text-center opacity-30"></i>
            <p class="font-bold text-center opacity-30">Oops! You haven't add a map yet, Please go to the Map section!</p>
        </div>
    </div>
</template>