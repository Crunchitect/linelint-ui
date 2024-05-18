<script lang="ts" setup>
import { Tabs } from '@/lib/types'    
import { selectedTab } from '@/state/Editor'

const tabsObj = Tabs;
</script>


<template>
    <fieldset>
        <div class="flex items-center gap-2 w-full h-[5%]">
            <div class="rounded bg-slate-100 w-28 flex items-center justify-between after:content-[''] before:content-[''] opacity-25 has-[:checked]:opacity-100" v-for="(icon, tab) in tabsObj">
                <i :class="`fa-solid fa-${icon}`"></i> <p>{{ tab }}</p>
                <input class="fixed w-full opacity-0" type="radio" :value="tab"  v-model="selectedTab">
            </div>
        </div>
    </fieldset>
</template>
