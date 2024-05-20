<script setup lang="ts">
import { selectedTab } from '@/state/Editor';
import { Tabs } from '@/lib/types';

import RobotMap from './EditView/RobotMap.vue';
import FirstVisit from './EditView/FirstVisit.vue';
import Sensors from './EditView/Sensors.vue';
import NotSupported from './EditView/NotSupported.vue';

const tabStr = <string><unknown>selectedTab;
</script>

<template>
    <KeepAlive>
        <FirstVisit v-if="tabStr == ''" />
        <RobotMap v-else-if="tabStr == 'RobotMap'" />
        <Sensors v-else-if="tabStr == 'Sensors'" />
        <NotSupported v-else />
    </KeepAlive>
</template>
