import { ref, watch } from 'vue';
import { Tabs, type Vec2D, type FixedLengthArray } from '@/lib/types';

export const selectedTab = ref<Tabs | ''>('');
export const imageFile = ref<File | null>(null);

export const startPos = ref<Vec2D | null>(null);
export const endPos = ref<Vec2D | null>(null);
export const dimensions = ref<Vec2D | null>(null);

export const sensorGray = ref<number>(500);
export const sensorData = ref<[number, number][]>([
    [-20, 0], [-10, 0], [0, 0], [10, 0], [20, 0]
]);

export const junctionData = ref<[string, FixedLengthArray<boolean, 5>][]>([
    ['leftTack', [false, false, false, true, true]],
    ['rightTack', [true, true, false, false, false]],
    ['cross', [false, false, false, false, false]],
]);

export const pathWithJunctions = ref<[string, string][]>([['', '']]);

export const generatedCode = ref('');

// watch(selectedTab, (val) => console.log(val));
