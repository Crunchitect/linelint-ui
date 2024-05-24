<script lang="ts" setup>
    import { generatedCode } from '@/state/Editor';
    import { Codemirror } from 'vue-codemirror';
    import { cpp } from '@codemirror/lang-cpp';
    import { oneDarkTheme } from '@codemirror/theme-one-dark';
</script>


<template>
    <div class="w-full h-[95%] bg-slate-100 rounded flex flex-wrap place-content-center">
        <codemirror
            v-model="generatedCode"
            placeholder="Code goes here..."
            :style="{ height: '80%', width: '80%', 'border-radius': '4px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="4"
            :extensions="[cpp(), oneDarkTheme]"
        />
    </div>
</template>