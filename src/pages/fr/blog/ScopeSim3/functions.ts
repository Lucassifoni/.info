import type { Point, Segment } from './types';

const x_coord_on_parabola = (focal_length: number, y: number) => {
    return y * y / 4 / focal_length;
};

export const parabola_coords = (radius: number, focal_length: number): Point[] => {
    const out = [];
    for (let y = -1 * radius; y < radius; y += 1) {
        const x = x_coord_on_parabola(focal_length, y);
        out.push({ x, y });
    }
    return out;
};

export const parallel_rayfan_coords = (radius: number, focal_length: number, rays: number): Segment[] => {
    const out: Segment[] = [];
    let base_y = -radius;
    let step = Math.abs(radius) / rays * 2;
    for (let i = 0; i <= rays; i++) {
        let y = base_y + i * step;
        let x = x_coord_on_parabola(focal_length, y);
        out.push({
            a: {
                x: x,
                y: y,
            },
            b: {
                x: 9999999999999,
                y: y,
            },
        });
        out.push({
            a: {
                x,
                y,
            },
            b: {
                x: focal_length,
                y: 0,
            },
        });
    };
    return out;
}

export const normal_coords = (focal_length: number, y: number): Segment => {
    const x = x_coord_on_parabola(focal_length, y);
    const dx = -2 * x;
    const dy = -y;
    return {
        a: {
            x: -dy + x,
            y: dx + y,
        },
        b: {
            x: dy + x,
            y: -dx + y,
        }
    };
};

export const tangent_coords = (focal_length: number, y: number): Segment => {
    const x = x_coord_on_parabola(focal_length, y);
    const dx = -2 * x;
    const dy = -y;
    return {
        a: {
            x: -x,
            y: 0,
        },
        b: {
            x: x - dx,
            y: y - dy,
        }
    };
};

export const non_parallel_rayfan_coords = (focal_length: number, radius: number, source_distance: number, rays: number): Segment[] => {
    const out: Segment[] = [];
    const base_y = -radius;
    const base_x = source_distance;
    const step = Math.abs(radius) / rays * 2;
    for (let i = 0; i <= rays; i++) {
        const y = base_y + i * step;
        const x = x_coord_on_parabola(focal_length, y);
        out.push({
            a: {
                x,
                y,
            },
            b: {
                x: base_x,
                y: 0,
            }
        });
    }
    return out;
};

const segment_delta = (s: Segment) : Segment => {
    return {
        a: {
            x: 0,
            y: 0,
        },
        b: {
            x: s.b.x - s.a.x,
            y: s.b.y - s.a.y
        },
    };
};

const angle_with_x_axis = (s: Segment) : number => {
    const derived = segment_delta(s);
    return Math.atan2(derived.b.y, derived.b.x);
};

const angle_between_segments = (a: Segment, b: Segment) : number => {
    return angle_with_x_axis(b) - angle_with_x_axis(a);
};

export const point_and_angle_to_x_coord = (p: Point, angle: number) => {
    let slope = Math.tan(angle);
    let x = ((slope * p.x) - p.y) / slope;
    return x;
};

export const reflection_coords = (focal_length: number, y: number, source_distance: number) : Segment => {
    const x = x_coord_on_parabola(focal_length, y);
    const v1 : Segment = {
        b: {
            x,
            y,
        },
        a: {
            x: source_distance,
            y: 0,
        },
    };
    const normal = normal_coords(focal_length, y);
    const angle = angle_between_segments(v1, normal);
    const output_angle = angle_with_x_axis(v1) + (2 * angle);
    const x_coord = point_and_angle_to_x_coord({x, y}, output_angle);
    return {
        a: {
            x,
            y,
        },
        b: {
            x: x_coord,
            y: 0
        }
    };
};