export type Image = [number, number, number, number][][];
export type BinaryImage = number[][];

export enum Tabs {
    RobotMap = 'map',
    Sensors = 'screwdriver-wrench',
    Junctions = 'code-fork',
    Options = 'gear'
}

export type Vec2D = [number, number];

export type FixedLengthArray<Type, Length extends number, Temp extends readonly Type[] = []> = Length extends Temp['length'] ? Temp : FixedLengthArray<Type, Length, [Type, ...Temp]>;
