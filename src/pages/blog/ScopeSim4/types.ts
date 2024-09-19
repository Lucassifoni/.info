export type Point = {
    x: number,
    y: number
};

export type AngledPoint = Point & {
    angle: number
};

export type Segment = {a: Point, b: Point};