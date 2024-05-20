import { ref, watch } from 'vue';
import { Tabs, type Vec2D, type FixedLengthArray } from '@/lib/types';

export const selectedTab = ref<Tabs | ''>('');
export const imageFile = ref<File | null>(null);

export const startPos = ref<Vec2D | null>(null);
export const endPos = ref<Vec2D | null>(null);
export const dimensions = ref<Vec2D | null>(null);

export const sensorGray = ref<number>(500);
export const sensorData = ref<[number, number][]>();

export const junctionData = ref<[string, FixedLengthArray<boolean, 5>][]>([
    ['leftTack', [true, true, false, false, false]],
    ['rightTack', [false, false, false, true, true]],
    ['cross', [false, false, false, false, false]],
]);

// watch(selectedTab, (val) => console.log(val));
