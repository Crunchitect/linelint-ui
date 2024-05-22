<script setup lang="ts">
import { selectedTab } from '@/state/Editor';
import { Tabs } from '@/lib/types';

import RobotMap from './EditView/RobotMap.vue';
import FirstVisit from './EditView/FirstVisit.vue';
import Sensors from './EditView/Sensors.vue';
import Junctions from './EditView/Junctions.vue';
import NotSupported from './EditView/NotSupported.vue';
import Codex from './EditView/Codex.vue';

const tabStr = <string><unknown>selectedTab;
</script>

<template>
    <KeepAlive>
        <FirstVisit v-if="tabStr == ''" />
        <RobotMap v-else-if="tabStr == 'RobotMap'" />
        <Sensors v-else-if="tabStr == 'Sensors'" />
        <Junctions v-else-if="tabStr == 'Junctions'" />
        <Codex v-else-if="tabStr == 'Code'" />
        <NotSupported v-else />
    </KeepAlive>
</template>
