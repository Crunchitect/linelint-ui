<script setup>
import Inspector from '@/components/Inspector.vue';
import Editor from '@/components/Editor.vue';
</script>

<template>
    <h1 class="text-4xl text-center font-bold m-4">Linelint</h1>
    <div class="flex flex-row flex-nowrap items-center justify-center w-screen h-[90vh] gap-3">
        <Inspector />
        <Editor />
    </div>
</template>