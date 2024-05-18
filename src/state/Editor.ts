import { ref, watch } from 'vue';
import { Tabs, type Vec2D } from '@/lib/types';

export const selectedTab = ref<Tabs | ''>('');
export const imageFile = ref<File | null>(null);

export const startPos = ref<Vec2D | null>(null);
export const endPos = ref<Vec2D | null>(null);
export const dimensions = ref<Vec2D | null>(null);

// watch(selectedTab, (val) => console.log(val));
