<script setup>
import Tabs from './Editor/Tabs.vue';
import EditView from './Editor/EditView.vue';
</script>

<template>
    <div class="w-2/3 h-full rounded flex flex-col justify-between">
        <Tabs />
        <EditView />
    </div>
</template>