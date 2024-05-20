export function calcSensor(refs: {[k: string]: HTMLElement | HTMLElement[]}, scale: [number, number]) {
    const sensorLocations = [];
    
    const canvasEl = (<HTMLElement>refs[`sensorCanvas`]);
    const canvasBBox = canvasEl.getBoundingClientRect();
    
    const originEl = (<HTMLElement>refs[`robotOrigin`]);
    const { width: originWidth, height: originHeight } = originEl.getBoundingClientRect();
    const originCSSMatrix = getComputedStyle(originEl).transform;
    let originX, originY, originR;
    if (originCSSMatrix == 'none') {
        originX = 0; originY = 0; originR = 0;
    } else {
        const originMatrix = originCSSMatrix.match(/-?\d+\.?\d*/g)?.map(val => parseFloat(val))!;
        originX = originMatrix[4] + originWidth / 2;
        originY = originMatrix[5] + originHeight / 2;
        originR = Math.atan2(originMatrix[1], originMatrix[0]);
    }

    for (let i = 0; i < 5; i++) {
        const sensorEl = (<HTMLElement[]>refs[`sensor-${i}`])[0];
        const { width: sensorWidth, height: sensorHeight } = sensorEl.getBoundingClientRect();
        const sensorCSSMatrix = getComputedStyle(sensorEl).transform;
        let sensorX, sensorY, sensorR;
        if (sensorCSSMatrix == 'none') {
            sensorX = 0; sensorY = 0; sensorR = 0;
        } else {
            const sensorMatrix = sensorCSSMatrix.match(/-?\d+\.?\d*/g)?.map(val => parseFloat(val))!;
            sensorX = sensorMatrix[4] + sensorWidth / 2;
            sensorY = sensorMatrix[5] + sensorHeight / 2;
            sensorR = Math.atan2(sensorMatrix[1], sensorMatrix[0]);
        }
        
        const sensorRotatedX = (Math.cos(-originR) * (sensorX - originX)) - (Math.sin(-originR) * (sensorY - originY));
        const sensorRotatedY = (Math.sin(-originR) * (sensorX - originX)) + (Math.cos(-originR) * (sensorY - originY));
        
        const sensorNormalizedX = sensorRotatedX / canvasBBox.width * scale[0];
        const sensorNormalizedY = sensorRotatedY / canvasBBox.height * scale[1];
        sensorLocations.push([sensorNormalizedX, sensorNormalizedY]);
    }
    console.log(sensorLocations);
    return sensorLocations;
}