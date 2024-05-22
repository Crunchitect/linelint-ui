<script lang="ts" setup>
    import { generatedCode } from '@/state/Editor';
</script>


<template>
    <div class="w-full h-[95%] bg-slate-100 rounded flex flex-wrap place-content-center">
        <pre class="w-4/5 h-4/5 rounded overflow-auto bg-slate-900 text-white p-3">{{ generatedCode }}</pre>
    </div>
</template>