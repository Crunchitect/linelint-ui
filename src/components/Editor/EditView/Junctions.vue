<script lang="ts" setup>
    import { toCamelCase } from '@/lib/textproc';
    import { junctionData } from '@/state/Editor';

    const camelize = () => junctionData.value.forEach(junction => {
            junction[0] = toCamelCase(junction[0]);
    });

    const addJunction = () => {
        junctionData.value.push(
            ['junctionName', [true, true, true, true, true]]
        );
    };

</script>


<template>
    <div class="rounded w-full h-[95%] bg-slate-100 flex flex-wrap items-center justify-start gap-2 flex-col before:content-[''] after:content-['']">
        <div class="flex flex-row w-4/5 items-center justify-between" v-for="(_, index) in junctionData" :key="index" >
            <input class="rounded outline-none text-xl" type="text" v-model="junctionData[index][0]" @change="camelize">
            <div class="flex rounded border-black border-2">
                <input type="checkbox" class="appearance-none border-black bg-black checked:bg-white w-10 h-10"
                v-for="(_, sensorIndex) in junctionData[index][1]" 
                v-model="(junctionData[index][1])[sensorIndex]">
            </div>
            <i @click="junctionData.splice(index, 1)" class="fa-solid fa-trash text-red-400"></i>
        </div>
        <button @click="addJunction" class="bg-slate-200 w-4/5 p-2 rounded"><i class="fa-solid fa-add"></i> Add Sensor</button>
    </div>
</template>