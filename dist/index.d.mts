/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

interface IPt {
    x?: number;
    y?: number;
    z?: number;
    w?: number;
}
type PtLike = Pt | Float32Array | number[];
type GroupLike = Group | Pt[];
type PtIterable = GroupLike | Pt[] | Iterable<Pt>;
type PtLikeIterable = GroupLike | PtLike[] | Iterable<PtLike>;
type AnimateCallbackFn = (time: number, frameTime: number, currentSpace: any) => void;
interface ITimer {
    prev: number;
    diff: number;
    end: number;
    min: number;
}
type TouchPointsKey = "touches" | "changedTouches" | "targetTouches";
interface MultiTouchElement {
    addEventListener(evt: any, callback: Function): any;
    removeEventListener(evt: any, callback: Function): any;
}
type CanvasSpaceOptions = {
    bgcolor?: string;
    resize?: boolean;
    retina?: boolean;
    offscreen?: boolean;
    pixelDensity?: number;
};
type ColorType = "rgb" | "hsl" | "hsb" | "lab" | "lch" | "luv" | "xyz";
type DelaunayShape = {
    i: number;
    j: number;
    k: number;
    triangle: GroupLike;
    circle: Group;
};
type DelaunayMesh = {
    [key: string]: DelaunayShape;
}[];
type DOMFormContext = {
    group: Element;
    groupID: string;
    groupCount: number;
    currentID: string;
    currentClass?: string;
    style: object;
};
type IntersectContext = {
    which: number;
    dist: number;
    normal: Pt;
    vertex: Pt;
    edge: Group;
    other?: any;
};
type WarningType = "error" | "warn" | "mute";
type ITempoStartFn = (count: number) => void | boolean;
type ITempoProgressFn = (count: number, t: number, ms: number, start: boolean) => void | boolean;
type ITempoListener = {
    name?: string;
    beats?: number | number[];
    period?: number;
    duration?: number;
    offset?: number;
    continuous?: boolean;
    index?: number;
    fn: Function;
};
type ITempoResponses = {
    start: (fn: ITempoStartFn, offset?: number, name?: string) => ITempoResponses;
    progress: (fn: ITempoProgressFn, offset?: number, name?: string) => ITempoResponses;
};
type ISoundAnalyzer = {
    node: AnalyserNode;
    size: number;
    data: Uint8Array;
};
type SoundType = "file" | "gen" | "input";
type DefaultFormStyle = {
    fillStyle?: string | CanvasGradient | CanvasPattern;
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    lineWidth?: number;
    lineJoin?: string;
    lineCap?: string;
    globalAlpha?: number;
};
type CanvasPatternRepetition = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
type RenderingContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

declare class Pt extends Float32Array implements IPt, Iterable<number> {
    protected _id: string;
    constructor(...args: Array<number | number[] | IPt | Float32Array>);
    static make(dimensions: number, defaultValue?: number, randomize?: boolean): Pt;
    get id(): string;
    set id(s: string);
    get x(): number;
    set x(n: number);
    get y(): number;
    set y(n: number);
    get z(): number;
    set z(n: number);
    get w(): number;
    set w(n: number);
    clone(): Pt;
    equals(p: PtLike, threshold?: number): boolean;
    to(...args: any[]): this;
    $to(...args: any[]): Pt;
    toAngle(radian: number, magnitude?: number, anchorFromPt?: boolean): this;
    op(fn: (p1: PtLike, ...rest: any[]) => any): (...rest: any[]) => any;
    ops(fns: ((p1: PtLike, ...rest: any[]) => any)[]): ((...rest: any[]) => any)[];
    $take(axis: string | number[]): Pt;
    $concat(...args: any[]): Pt;
    add(...args: any[]): this;
    $add(...args: any[]): Pt;
    subtract(...args: any[]): this;
    $subtract(...args: any[]): Pt;
    multiply(...args: any[]): this;
    $multiply(...args: any[]): Pt;
    divide(...args: any[]): this;
    $divide(...args: any[]): Pt;
    magnitudeSq(): number;
    magnitude(): number;
    unit(magnitude?: number): Pt;
    $unit(magnitude?: number): Pt;
    dot(...args: any[]): number;
    $cross2D(...args: any[]): number;
    $cross(...args: any[]): Pt;
    $project(...args: any[]): Pt;
    projectScalar(...args: any[]): number;
    abs(): Pt;
    $abs(): Pt;
    floor(): Pt;
    $floor(): Pt;
    ceil(): Pt;
    $ceil(): Pt;
    round(): Pt;
    $round(): Pt;
    minValue(): {
        value: number;
        index: number;
    };
    maxValue(): {
        value: number;
        index: number;
    };
    $min(...args: any[]): Pt;
    $max(...args: any[]): Pt;
    angle(axis?: string | number[]): number;
    angleBetween(p: Pt, axis?: string | number[]): number;
    scale(scale: number | number[] | PtLike, anchor?: PtLike): this;
    rotate2D(angle: number, anchor?: PtLike, axis?: string): this;
    shear2D(scale: number | number[] | PtLike, anchor?: PtLike, axis?: string): this;
    reflect2D(line: GroupLike, axis?: string): this;
    toString(): string;
    toArray(): number[];
    toGroup(): Group;
    toBound(): Bound;
}
declare class Group extends Array<Pt> {
    protected _id: string;
    constructor(...args: Pt[]);
    get id(): string;
    set id(s: string);
    get p1(): Pt;
    get p2(): Pt;
    get p3(): Pt;
    get p4(): Pt;
    get q1(): Pt;
    get q2(): Pt;
    get q3(): Pt;
    get q4(): Pt;
    clone(): Group;
    static fromArray(list: PtLikeIterable): Group;
    static fromPtArray(list: PtIterable): Group;
    split(chunkSize: number, stride?: number, loopBack?: boolean): Group[];
    insert(pts: PtIterable, index?: number): this;
    remove(index?: number, count?: number): Group;
    segments(pts_per_segment?: number, stride?: number, loopBack?: boolean): Group[];
    lines(): Group[];
    centroid(): Pt;
    boundingBox(): Group;
    anchorTo(ptOrIndex?: PtLike | number): void;
    anchorFrom(ptOrIndex?: PtLike | number): void;
    op(fn: (g1: PtIterable, ...rest: any[]) => any): (...rest: any[]) => any;
    ops(fns: ((g1: PtIterable, ...rest: any[]) => any)[]): ((...rest: any[]) => any)[];
    interpolate(t: number): Pt;
    moveBy(...args: any[]): this;
    moveTo(...args: any[]): this;
    scale(scale: number | number[] | PtLike, anchor?: PtLike): this;
    rotate2D(angle: number, anchor?: PtLike, axis?: string): this;
    shear2D(scale: number | number[] | PtLike, anchor?: PtLike, axis?: string): this;
    reflect2D(line: PtLikeIterable, axis?: string): this;
    sortByDimension(dim: number, desc?: boolean): this;
    forEachPt(ptFn: string, ...args: any[]): this;
    add(...args: any[]): this;
    subtract(...args: any[]): this;
    multiply(...args: any[]): this;
    divide(...args: any[]): this;
    $matrixAdd(g: GroupLike | number[][] | number): Group;
    $matrixMultiply(g: GroupLike | number, transposed?: boolean, elementwise?: boolean): Group;
    zipSlice(index: number, defaultValue?: number | boolean): Pt;
    $zip(defaultValue?: number | boolean, useLongest?: boolean): Group;
    toBound(): Bound;
    toString(): string;
}
declare class Bound extends Group implements IPt {
    protected _center: Pt;
    protected _size: Pt;
    protected _inited: boolean;
    constructor(...args: Pt[]);
    static fromBoundingRect(rect: ClientRect): Bound;
    static fromGroup(g: PtLikeIterable): Bound;
    protected init(): void;
    clone(): Bound;
    protected _updateSize(): void;
    protected _updateCenter(): void;
    protected _updatePosFromTop(): void;
    protected _updatePosFromBottom(): void;
    protected _updatePosFromCenter(): void;
    get size(): Pt;
    set size(p: Pt);
    get center(): Pt;
    set center(p: Pt);
    get topLeft(): Pt;
    set topLeft(p: Pt);
    get bottomRight(): Pt;
    set bottomRight(p: Pt);
    get width(): number;
    set width(w: number);
    get height(): number;
    set height(h: number);
    get depth(): number;
    set depth(d: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get inited(): boolean;
    update(): this;
}

/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

declare class Create {
    static distributeRandom(bound: Bound, count: number, dimensions?: number): Group;
    static distributeLinear(line: PtIterable, count: number): Group;
    static gridPts(bound: Bound, columns: number, rows: number, orientation?: PtLike): Group;
    static gridCells(bound: Bound, columns: number, rows: number): Group[];
    static radialPts(center: PtLike, radius: number, count: number, angleOffset?: number): Group;
    static noisePts(pts: PtIterable, dx?: number, dy?: number, rows?: number, columns?: number): Group;
    static delaunay(pts: GroupLike): Delaunay;
}
declare class Noise extends Pt {
    protected perm: number[];
    private _n;
    constructor(...args: any[]);
    initNoise(...args: any[]): this;
    step(x?: number, y?: number): this;
    seed(s: any): this;
    noise2D(): number;
}
declare class Delaunay extends Group {
    private _mesh;
    delaunay(triangleOnly?: boolean): GroupLike[] | DelaunayShape[];
    voronoi(): Group[];
    mesh(): DelaunayMesh;
    neighborPts(i: number, sort?: boolean): GroupLike;
    neighbors(i: number): DelaunayShape[];
    protected _cache(o: any): void;
    protected _superTriangle(): Group;
    protected _triangle(i: number, j: number, k: number, pts?: GroupLike): Group;
    protected _circum(i: number, j: number, k: number, tri: GroupLike | false, pts?: GroupLike): DelaunayShape;
    protected static _dedupe(edges: number[]): number[];
}

/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

declare class Vec {
    static add(a: PtLike, b: PtLike | number): PtLike;
    static subtract(a: PtLike, b: PtLike | number): PtLike;
    static multiply(a: PtLike, b: PtLike | number): PtLike;
    static divide(a: PtLike, b: PtLike | number): PtLike;
    static dot(a: PtLike, b: PtLike): number;
    static cross2D(a: PtLike, b: PtLike): number;
    static cross(a: PtLike, b: PtLike): Pt;
    static magnitude(a: PtLike): number;
    static unit(a: PtLike, magnitude?: number): PtLike;
    static abs(a: PtLike): PtLike;
    static floor(a: PtLike): PtLike;
    static ceil(a: PtLike): PtLike;
    static round(a: PtLike): PtLike;
    static max(a: PtLike): {
        value: any;
        index: any;
    };
    static min(a: PtLike): {
        value: any;
        index: any;
    };
    static sum(a: PtLike): number;
    static map(a: PtLike, fn: (n: number, index: number, arr: any) => number): PtLike;
}
declare class Mat {
    protected _33: GroupLike;
    constructor();
    get value(): GroupLike;
    get domMatrix(): DOMMatrix;
    reset(): void;
    scale2D(val: PtLike, at?: PtLike): this;
    rotate2D(ang: number, at?: PtLike): this;
    translate2D(val: PtLike): this;
    shear2D(val: PtLike, at?: PtLike): this;
    static add(a: GroupLike, b: GroupLike | number[][] | number): Group;
    static multiply(a: GroupLike, b: GroupLike | number[][] | number, transposed?: boolean, elementwise?: boolean): Group;
    static zipSlice(g: GroupLike | number[][], index: number, defaultValue?: number | boolean): Pt;
    static zip(g: GroupLike | number[][], defaultValue?: number | boolean, useLongest?: boolean): Group;
    static transpose(g: GroupLike | number[][], defaultValue?: number | boolean, useLongest?: boolean): Group;
    static toDOMMatrix(m: GroupLike | number[][]): number[];
    static transform2D(pt: PtLike, m: GroupLike | number[][]): Pt;
    static scale2DMatrix(x: number, y: number): GroupLike;
    static rotate2DMatrix(cosA: number, sinA: number): GroupLike;
    static shear2DMatrix(tanX: number, tanY: number): GroupLike;
    static translate2DMatrix(x: number, y: number): GroupLike;
    static scaleAt2DMatrix(sx: number, sy: number, at: PtLike): GroupLike;
    static rotateAt2DMatrix(cosA: number, sinA: number, at: PtLike): GroupLike;
    static shearAt2DMatrix(tanX: number, tanY: number, at: PtLike): GroupLike;
    static reflectAt2DMatrix(p1: PtLike, p2: PtLike): Pt[];
}

/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

declare class Num {
    static generator: any;
    static equals(a: number, b: number, threshold?: number): boolean;
    static lerp(a: number, b: number, t: number): number;
    static clamp(val: number, min: number, max: number): number;
    static boundValue(val: number, min: number, max: number): number;
    static within(p: number, a: number, b: number): boolean;
    static randomRange(a: number, b?: number): number;
    static randomPt(a: PtLike, b?: PtLike): Pt;
    static normalizeValue(n: number, a: number, b: number): number;
    static sum(pts: PtLikeIterable): Pt;
    static average(pts: PtLikeIterable): Pt;
    static cycle(t: number, method?: (t: number) => number): number;
    static mapToRange(n: number, currA: number, currB: number, targetA: number, targetB: number): number;
    static seed(seed: string): void;
    static random(): number;
}
declare class Geom {
    static boundAngle(angle: number): number;
    static boundRadian(radian: number): number;
    static toRadian(angle: number): number;
    static toDegree(radian: number): number;
    static boundingBox(pts: PtIterable): Group;
    static centroid(pts: PtLikeIterable): Pt;
    static anchor(pts: PtLikeIterable, ptOrIndex?: PtLike | number, direction?: ("to" | "from")): void;
    static interpolate(a: PtLike, b: PtLike, t?: number): Pt;
    static perpendicular(pt: PtLike, axis?: string | PtLike): Group;
    static isPerpendicular(p1: PtLike, p2: PtLike): boolean;
    static withinBound(pt: PtLike, boundPt1: PtLike, boundPt2: PtLike): boolean;
    static sortEdges(pts: PtIterable): GroupLike;
    static scale(ps: Pt | PtIterable, scale: number | PtLike, anchor?: PtLike): Geom;
    static rotate2D(ps: Pt | PtIterable, angle: number, anchor?: PtLike, axis?: string | PtLike): Geom;
    static shear2D(ps: Pt | PtIterable, scale: number | PtLike, anchor?: PtLike, axis?: string | PtLike): Geom;
    static reflect2D(ps: Pt | PtIterable, line: PtLikeIterable, axis?: string | PtLike): Geom;
    static cosTable(): {
        table: Float64Array;
        cos: (rad: number) => number;
    };
    static sinTable(): {
        table: Float64Array;
        sin: (rad: number) => number;
    };
}
declare class Shaping {
    static linear(t: number, c?: number): number;
    static quadraticIn(t: number, c?: number): number;
    static quadraticOut(t: number, c?: number): number;
    static quadraticInOut(t: number, c?: number): number;
    static cubicIn(t: number, c?: number): number;
    static cubicOut(t: number, c?: number): number;
    static cubicInOut(t: number, c?: number): number;
    static exponentialIn(t: number, c?: number, p?: number): number;
    static exponentialOut(t: number, c?: number, p?: number): number;
    static sineIn(t: number, c?: number): number;
    static sineOut(t: number, c?: number): number;
    static sineInOut(t: number, c?: number): number;
    static cosineApprox(t: number, c?: number): number;
    static circularIn(t: number, c?: number): number;
    static circularOut(t: number, c?: number): number;
    static circularInOut(t: number, c?: number): number;
    static elasticIn(t: number, c?: number, p?: number): number;
    static elasticOut(t: number, c?: number, p?: number): number;
    static elasticInOut(t: number, c?: number, p?: number): number;
    static bounceIn(t: number, c?: number): number;
    static bounceOut(t: number, c?: number): number;
    static bounceInOut(t: number, c?: number): number;
    static sigmoid(t: number, c?: number, p?: number): number;
    static logSigmoid(t: number, c?: number, p?: number): number;
    static seat(t: number, c?: number, p?: number): number;
    static quadraticBezier(t: number, c?: number, p?: number | PtLike): number;
    static cubicBezier(t: number, c?: number, p1?: PtLike, p2?: PtLike): number;
    static quadraticTarget(t: number, c?: number, p1?: PtLike): number;
    static cliff(t: number, c?: number, p?: number): number;
    static step(fn: Function, steps: number, t: number, c: number, ...args: any[]): any;
}
declare class Range {
    protected _source: Group;
    protected _max: Pt;
    protected _min: Pt;
    protected _mag: Pt;
    protected _dims: number;
    constructor(g: PtIterable);
    get max(): Pt;
    get min(): Pt;
    get magnitude(): Pt;
    calc(): this;
    mapTo(min: number, max: number, exclude?: boolean[]): Group;
    append(pts: PtLikeIterable, update?: boolean): this;
    ticks(count: number): Group;
}

/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

declare class Line {
    static fromAngle(anchor: PtLike, angle: number, magnitude: number): Group;
    static slope(p1: PtLike, p2: PtLike): number;
    static intercept(p1: PtLike, p2: PtLike): {
        slope: number;
        xi: number;
        yi: number;
    };
    static sideOfPt2D(line: PtLikeIterable, pt: PtLike): number;
    static collinear(p1: PtLike, p2: PtLike, p3: PtLike, threshold?: number): boolean;
    static magnitude(line: PtIterable): number;
    static magnitudeSq(line: PtIterable): number;
    static perpendicularFromPt(line: PtIterable, pt: PtLike, asProjection?: boolean): Pt;
    static distanceFromPt(line: GroupLike, pt: PtLike | number[]): number;
    static intersectRay2D(la: PtIterable, lb: PtIterable): Pt;
    static intersectLine2D(la: PtIterable, lb: PtIterable): Pt;
    static intersectLineWithRay2D(line: PtIterable, ray: PtIterable): Pt;
    static intersectPolygon2D(lineOrRay: PtIterable, poly: PtIterable, sourceIsRay?: boolean): Group;
    static intersectLines2D(lines1: Iterable<PtIterable>, lines2: Iterable<PtIterable>, isRay?: boolean): Group;
    static intersectGridWithRay2D(ray: PtIterable, gridPt: PtLike): Group;
    static intersectGridWithLine2D(line: GroupLike, gridPt: PtLike | number[]): Group;
    static intersectRect2D(line: GroupLike, rect: GroupLike): Group;
    static subpoints(line: PtLikeIterable, num: number): Group;
    static crop(line: PtIterable, size: PtLike, index?: number, cropAsCircle?: boolean): Pt;
    static marker(line: PtIterable, size: PtLike, graphic?: ("arrow" | "line"), atTail?: boolean): Group;
    static toRect(line: GroupLike): Group;
}
declare class Rectangle {
    static from(topLeft: PtLike, widthOrSize: number | PtLike, height?: number): Group;
    static fromTopLeft(topLeft: PtLike, widthOrSize: number | PtLike, height?: number): Group;
    static fromCenter(center: PtLike, widthOrSize: number | PtLike, height?: number): Group;
    static toCircle(pts: PtIterable, enclose?: boolean): Group;
    static toSquare(pts: PtIterable, enclose?: boolean): Group;
    static size(pts: PtIterable): Pt;
    static center(pts: PtIterable): Pt;
    static corners(rect: PtIterable): Group;
    static sides(rect: PtIterable): Group[];
    static boundingBox(rects: Iterable<PtLikeIterable>): Group;
    static polygon(rect: PtIterable): Group;
    static quadrants(rect: PtIterable, center?: PtLike): Group[];
    static halves(rect: PtIterable, ratio?: number, asRows?: boolean): Group[];
    static withinBound(rect: GroupLike, pt: PtLike): boolean;
    static hasIntersectRect2D(rect1: GroupLike, rect2: GroupLike, resetBoundingBox?: boolean): boolean;
    static intersectRect2D(rect1: GroupLike, rect2: GroupLike): Group;
}
declare class Circle {
    static fromRect(pts: PtLikeIterable, enclose?: boolean): Group;
    static fromTriangle(pts: PtIterable, enclose?: boolean): Group;
    static fromCenter(pt: PtLike, radius: number): Group;
    static withinBound(pts: PtIterable, pt: PtLike, threshold?: number): boolean;
    static intersectRay2D(circle: PtIterable, ray: PtIterable): Group;
    static intersectLine2D(circle: PtIterable, line: PtIterable): Group;
    static intersectCircle2D(circle1: PtIterable, circle2: PtIterable): Group;
    static intersectRect2D(circle: PtIterable, rect: PtIterable): Group;
    static toRect(circle: PtIterable, within?: boolean): Group;
    static toTriangle(circle: PtIterable, within?: boolean): Group;
}
declare class Triangle {
    static fromRect(rect: PtIterable): Group;
    static fromCircle(circle: PtIterable): Group;
    static fromCenter(pt: PtLike, size: number): Group;
    static medial(tri: PtIterable): Group;
    static oppositeSide(tri: PtIterable, index: number): Group;
    static altitude(tri: PtIterable, index: number): Group;
    static orthocenter(tri: PtIterable): Pt;
    static incenter(tri: PtIterable): Pt;
    static incircle(tri: PtIterable, center?: Pt): Group;
    static circumcenter(tri: PtIterable): Pt;
    static circumcircle(tri: PtIterable, center?: Pt): Group;
}
declare class Polygon {
    static centroid(pts: PtLikeIterable): Pt;
    static rectangle(center: PtLike, widthOrSize: number | PtLike, height?: number): Group;
    static fromCenter(center: PtLike, radius: number, sides: number): Group;
    static lineAt(pts: PtLikeIterable, index: number): Group;
    static lines(poly: PtIterable, closePath?: boolean): Group[];
    static midpoints(poly: PtIterable, closePath?: boolean, t?: number): Group;
    static adjacentSides(poly: PtIterable, index: number, closePath?: boolean): Group[];
    static bisector(poly: PtIterable, index: number): Pt;
    static perimeter(poly: PtIterable, closePath?: boolean): {
        total: number;
        segments: Pt;
    };
    static area(pts: PtLikeIterable): any;
    static convexHull(pts: PtLikeIterable, sorted?: boolean): Group;
    static network(poly: PtIterable, originIndex?: number): Group[];
    static nearestPt(poly: PtIterable, pt: PtLike): number;
    static projectAxis(poly: PtIterable, unitAxis: Pt): Pt;
    protected static _axisOverlap(poly1: PtIterable, poly2: PtIterable, unitAxis: Pt): number;
    static hasIntersectPoint(poly: PtLikeIterable, pt: PtLike): boolean;
    static hasIntersectCircle(poly: PtIterable, circle: PtIterable): IntersectContext;
    static hasIntersectPolygon(poly1: PtIterable, poly2: PtIterable): IntersectContext;
    static intersectPolygon2D(poly1: PtIterable, poly2: PtIterable): Group;
    static toRects(polys: Iterable<PtIterable>): Group[];
}
declare class Curve {
    static getSteps(steps: number): Group;
    static controlPoints(pts: PtLikeIterable, index?: number, copyStart?: boolean): Group;
    static _calcPt(ctrls: GroupLike, params: PtLike): Pt;
    static catmullRom(pts: PtLikeIterable, steps?: number): Group;
    static catmullRomStep(step: Pt, ctrls: GroupLike): Pt;
    static cardinal(pts: PtLikeIterable, steps?: number, tension?: number): Group;
    static cardinalStep(step: Pt, ctrls: GroupLike, tension?: number): Pt;
    static bezier(pts: GroupLike, steps?: number): Group;
    static bezierStep(step: Pt, ctrls: GroupLike): Pt;
    static bspline(pts: GroupLike, steps?: number, tension?: number): Group;
    static bsplineStep(step: Pt, ctrls: GroupLike): Pt;
    static bsplineTensionStep(step: Pt, ctrls: GroupLike, tension?: number): Pt;
}

/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

declare const Const: {
    xy: string;
    yz: string;
    xz: string;
    xyz: string;
    horizontal: number;
    vertical: number;
    identical: number;
    right: number;
    bottom_right: number;
    bottom: number;
    bottom_left: number;
    left: number;
    top_left: number;
    top: number;
    top_right: number;
    epsilon: number;
    max: number;
    min: number;
    pi: number;
    two_pi: number;
    half_pi: number;
    quarter_pi: number;
    one_degree: number;
    rad_to_deg: number;
    deg_to_rad: number;
    gravity: number;
    newton: number;
    gaussian: number;
};
declare class Util {
    static _warnLevel: WarningType;
    static warnLevel(lv?: WarningType): WarningType;
    static getArgs(args: any[]): Array<number>;
    static warn(message?: string, defaultReturn?: any): any;
    static randomInt(range: number, start?: number): number;
    static split(pts: any[], size: number, stride?: number, loopBack?: boolean, matchSize?: boolean): any[][];
    static flatten(pts: any[], flattenAsGroup?: boolean): any;
    static combine<T>(a: T[], b: T[], op: (a: T, b: T) => T): T[];
    static zip(arrays: Array<any>[]): any[];
    static stepper(max: number, min?: number, stride?: number, callback?: (n: number) => void): (() => number);
    static forRange(fn: (index: number) => any, range: number, start?: number, step?: number): any[];
    static performance(avgFrames?: number): () => number;
    static arrayCheck(pts: PtLikeIterable, minRequired?: number): boolean;
    static iterToArray(it: Iterable<any>): any[];
    static uniqueId(useCrypto?: boolean): string;
}

export { type AnimateCallbackFn, Bound, type CanvasPatternRepetition, type CanvasSpaceOptions, Circle, type ColorType, Const, Create, Curve, type DOMFormContext, type DefaultFormStyle, Delaunay, type DelaunayMesh, type DelaunayShape, Geom, Group, type GroupLike, type IPt, type ISoundAnalyzer, type ITempoListener, type ITempoProgressFn, type ITempoResponses, type ITempoStartFn, type ITimer, type IntersectContext, Line, Mat, type MultiTouchElement, Noise, Num, Polygon, Pt, type PtIterable, type PtLike, type PtLikeIterable, Range, Rectangle, type RenderingContext2D, Shaping, type SoundType, type TouchPointsKey, Triangle, Util, Vec, type WarningType };
