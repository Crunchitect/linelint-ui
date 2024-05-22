import { slidingWindow } from './math';
import { sensorData, junctionData } from '@/state/Editor';
import { pathWithJunctions as pathRef } from '@/state/Editor';

let currentJunction = '';
const junctions: string[] = [''];
const pathWithJunctions: [string, string][] = [['', '']];

const setJunction = (to: string) => {
    if (to === currentJunction) return;
    currentJunction = to;
    if (junctions.length >= 17) debugger;
    junctions.push(to);
    pathWithJunctions.push([to, '']);
};

export const generatePathWithJunctions = (path: [number, number][], imgArray: number[][]) => {
    slidingWindow(path, 3).forEach(([prevLocation, currLocation, nextLocation]) => {
        const direction = Math.atan2(nextLocation[0] - currLocation[0], nextLocation[1] - currLocation[1]);
        const prevDirection = Math.atan2(currLocation[0] - prevLocation[0], currLocation[1] - prevLocation[1]);
        const sensorReadings = sensorData.value?.map(([x, y]) => {
            const sensorX = Math.round(x * Math.cos(direction) - y * Math.sin(direction));
            const sensorY = Math.round(x * Math.sin(direction) + y * Math.cos(direction));
            return !!imgArray[sensorY + currLocation[1]][sensorX + currLocation[0]];
        });
        
        let detectedJunction = false;
        junctionData.value.forEach(junction => {
            if (junction[1].every((item, index) => item == sensorReadings?.[index])) {
                setJunction(junction[0]);
                detectedJunction = true;
            }
        });
        if (!detectedJunction) setJunction('');

        const deltaDirection = Math.round((prevDirection - direction) / Math.PI * 180);
        let directionStr;
        switch (deltaDirection) {
            case -90:
            case 270:
                directionStr = 'l' as const;
                break;
            case 90:
            case -270:
                directionStr = 'r' as const;
                break;
            default:
                directionStr = 'f' as const;
                break;
        }
        pathWithJunctions[pathWithJunctions.length - 1][1] += directionStr;
    });

    const reducedPath = pathWithJunctions.map(([junctionName, steps]) => {
        const stepReduced = steps.replace(/f+/g, 'f').replace(/f?(l|r)f?/g, '$1');
        return <[string, string]>[junctionName, stepReduced]
    });
    pathRef.value = reducedPath;
    return reducedPath;
};