<script setup lang="ts">
    import { onMounted, onBeforeUnmount } from 'vue';
    const props = defineProps<{
        keyCode: number
    }>();
    const model = defineModel();

    const handler = (e: KeyboardEvent) => {
        if (e.keyCode != props.keyCode) return;
        switch (e.type) {
            case "keyup":
                model.value = false;
                break;
            case "keydown":
                model.value = true;
        }
    };

    onMounted(() => {
        window.addEventListener("keyup", handler)
        window.addEventListener("keydown", handler)
    });

    onBeforeUnmount(() => {
        window.removeEventListener("keyup", handler)
        window.removeEventListener("keydown", handler)
    })
</script>

<template></template>