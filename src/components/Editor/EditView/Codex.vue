<script lang="ts" setup>
    import { generatedCode } from '@/state/Editor';
    import { Codemirror } from 'vue-codemirror';
    import { cpp } from '@codemirror/lang-cpp';
    import { birdsOfParadise, dracula } from 'thememirror';

    const copy = () => {
        navigator.clipboard.writeText(generatedCode.value);
    }

    const cRobot = () => {
        const save = document.createElement("a");
        const blob = new Blob([generatedCode.value], { type: "text/plain" })
        save.setAttribute("href", window.URL.createObjectURL(blob));
        save.setAttribute("download", "code.c");

        document.body.appendChild(save);
        save.click();
        document.body.removeChild(save);
    }
    
</script>


<template>
    <div class="w-full h-[95%] bg-slate-100 rounded flex flex-col flex-wrap place-content-center gap-2">
        <Codemirror
            v-model="generatedCode"
            placeholder="Wait for code to generate..."
            :style="{ height: '80%', width: '80%', 'border-radius': '4px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="4"
            :extensions="[cpp(), dracula]"
        />
        <div class="flex w-4/5 justify-between">
            <button class="bg-slate-200 w-2/5 p-4 rounded text-xl active:bg-slate-300" @click="copy"><i class="fa-solid fa-copy"></i> Copy</button>
            <button class="bg-slate-200 w-2/5 p-4 rounded text-xl active:bg-slate-300" @click="cRobot"><i class="fa-solid fa-download flex-grow"></i> Export to C Robot</button>
        </div>
    </div>
</template>