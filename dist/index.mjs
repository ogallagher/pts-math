// src/LinearAlgebra.ts
var Vec = class _Vec {
  /**
   * Add `b` to vector `a`.
   * @returns vector `a`
   */
  static add(a, b) {
    if (typeof b == "number") {
      for (let i = 0, len = a.length; i < len; i++)
        a[i] += b;
    } else {
      for (let i = 0, len = a.length; i < len; i++)
        a[i] += b[i] || 0;
    }
    return a;
  }
  /**
   * Subtract `b` from vector `a`.
   * @returns vector `a`
   */
  static subtract(a, b) {
    if (typeof b == "number") {
      for (let i = 0, len = a.length; i < len; i++)
        a[i] -= b;
    } else {
      for (let i = 0, len = a.length; i < len; i++)
        a[i] -= b[i] || 0;
    }
    return a;
  }
  /**
   * Multiply `b` with vector `a`.
   * @returns vector `a`
   */
  static multiply(a, b) {
    if (typeof b == "number") {
      for (let i = 0, len = a.length; i < len; i++)
        a[i] *= b;
    } else {
      if (a.length != b.length) {
        throw new Error(`Cannot do element-wise multiply since the array lengths don't match: ${a.toString()} multiply-with ${b.toString()}`);
      }
      for (let i = 0, len = a.length; i < len; i++)
        a[i] *= b[i];
    }
    return a;
  }
  /**
   * Divide `a` over `b`.
   * @returns vector `a`
   */
  static divide(a, b) {
    if (typeof b == "number") {
      if (b === 0)
        throw new Error("Cannot divide by zero");
      for (let i = 0, len = a.length; i < len; i++)
        a[i] /= b;
    } else {
      if (a.length != b.length) {
        throw new Error(`Cannot do element-wise divide since the array lengths don't match. ${a.toString()} divide-by ${b.toString()}`);
      }
      for (let i = 0, len = a.length; i < len; i++)
        a[i] /= b[i];
    }
    return a;
  }
  /**
   * Dot product of `a` and `b`.
   */
  static dot(a, b) {
    if (a.length != b.length)
      throw new Error("Array lengths don't match");
    let d = 0;
    for (let i = 0, len = a.length; i < len; i++) {
      d += a[i] * b[i];
    }
    return d;
  }
  /**
   * 2D cross product of `a` and `b`.
   */
  static cross2D(a, b) {
    return a[0] * b[1] - a[1] * b[0];
  }
  /**
   * 3D Cross product of `a` and `b`.
   */
  static cross(a, b) {
    return new Pt(a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]);
  }
  /**
   * Magnitude of `a`.
   */
  static magnitude(a) {
    return Math.sqrt(_Vec.dot(a, a));
  }
  /**
   * Unit vector of `a`. If magnitude of `a` is already known, pass it in the second paramter to optimize calculation.
   */
  static unit(a, magnitude = void 0) {
    const m = magnitude === void 0 ? _Vec.magnitude(a) : magnitude;
    if (m === 0)
      return Pt.make(a.length);
    return _Vec.divide(a, m);
  }
  /**
   * Set `a` to its absolute value in each dimension.
   * @returns vector `a`
   */
  static abs(a) {
    return _Vec.map(a, Math.abs);
  }
  /**
   * Set `a` to its floor value in each dimension.
   * @returns vector `a`
   */
  static floor(a) {
    return _Vec.map(a, Math.floor);
  }
  /**
   * Set `a` to its ceiling value in each dimension.
   * @returns vector `a`
   */
  static ceil(a) {
    return _Vec.map(a, Math.ceil);
  }
  /**
   * Set `a` to its rounded value in each dimension.
   * @returns vector `a`
   */
  static round(a) {
    return _Vec.map(a, Math.round);
  }
  /**
   * Find the max value within a vector's dimensions.
   * @returns an object with `value` and `index` that specifies the max value and its corresponding dimension.
   */
  static max(a) {
    let m = Number.MIN_VALUE;
    let index = 0;
    for (let i = 0, len = a.length; i < len; i++) {
      m = Math.max(m, a[i]);
      if (m === a[i])
        index = i;
    }
    return { value: m, index };
  }
  /**
   * Find the min value within a vector's dimensions.
   * @returns an object with `value` and `index` that specifies the min value and its corresponding dimension.
   */
  static min(a) {
    let m = Number.MAX_VALUE;
    let index = 0;
    for (let i = 0, len = a.length; i < len; i++) {
      m = Math.min(m, a[i]);
      if (m === a[i])
        index = i;
    }
    return { value: m, index };
  }
  /**
   * Add up all the dimensions' values and returns a scalar of the sum.
   */
  static sum(a) {
    let s = 0;
    for (let i = 0, len = a.length; i < len; i++)
      s += a[i];
    return s;
  }
  /**
   * Given a mapping function, update `a`'s value in each dimension.
   * @returns vector `a`
   */
  static map(a, fn) {
    for (let i = 0, len = a.length; i < len; i++) {
      a[i] = fn(a[i], i, a);
    }
    return a;
  }
};
var Mat = class _Mat {
  constructor() {
    this.reset();
  }
  /**
   * Get the current value of its stored 3x3 matrix
   */
  get value() {
    return this._33;
  }
  /**
   * Convert the value of its stored 3x3 matrix to a 2D [`DOMMatrix`](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) instance
   */
  get domMatrix() {
    return new DOMMatrix(_Mat.toDOMMatrix(this._33));
  }
  /**
   * Reset the internal 3x3 matrix to its identity
   */
  reset() {
    this._33 = _Mat.scale2DMatrix(1, 1);
  }
  /**
   * Scale the internal 3x3 matrix. You can chain this function with other related functions.
   * @param val [x, y] scale factors
   * @param at Optional origin location to scale from. 
   */
  scale2D(val, at = [0, 0]) {
    const m = _Mat.scaleAt2DMatrix(val[0] || 1, val[1] || 1, at);
    this._33 = _Mat.multiply(this._33, m);
    return this;
  }
  /**
   * Scale the internal 3x3 matrix. You can chain this function with other related functions.
   * @param ang Angle of rotation
   * @param at Optional origin location to rotate from. 
   */
  rotate2D(ang, at = [0, 0]) {
    const m = _Mat.rotateAt2DMatrix(Math.cos(ang), Math.sin(ang), at);
    this._33 = _Mat.multiply(this._33, m);
    return this;
  }
  /**
   * Translate the internal 3x3 matrix. You can chain this function with other related functions.
   * @param val [x, y] offset values
   */
  translate2D(val) {
    const m = _Mat.translate2DMatrix(val[0] || 0, val[1] || 0);
    this._33 = _Mat.multiply(this._33, m);
    return this;
  }
  /**
   * Shear the internal 3x3 matrix. You can chain this function with other related functions.
   * @param val [x, y] shear factors (before tan() operation)
   * @param at Optional origin location to scale from. 
   */
  shear2D(val, at = [0, 0]) {
    const m = _Mat.shearAt2DMatrix(Math.tan(val[0] || 0), Math.tan(val[1] || 1), at);
    this._33 = _Mat.multiply(this._33, m);
    return this;
  }
  /**
   * Matrix addition. Matrices should have the same rows and columns.
   * @param a a group of Pt
   * @param b a scalar number, an array of numeric arrays, or a group of Pt
   * @returns a new group with the same rows and columns as a and b
   */
  static add(a, b) {
    if (typeof b != "number") {
      if (a[0].length != b[0].length)
        throw new Error("Cannot add matrix if rows' and columns' size don't match.");
      if (a.length != b.length)
        throw new Error("Cannot add matrix if rows' and columns' size don't match.");
    }
    const g = new Group();
    const isNum = typeof b == "number";
    for (let i = 0, len = a.length; i < len; i++) {
      g.push(a[i].$add(isNum ? b : b[i]));
    }
    return g;
  }
  /**
   * Matrix multiplication.
   * @param a a Group of M Pts, each with K dimensions (M-rows, K-columns)
   * @param b a scalar number, an array of numeric arrays, or a Group of K Pts, each with N dimensions (K-rows, N-columns) -- or if transposed is true, then N Pts with K dimensions
   * @param transposed (Only applicable if it's not elementwise multiplication) If true, then a and b's columns should match (ie, each Pt should have the same dimensions). Default is `false`.
   * @param elementwise if true, then the multiplication is done element-wise. Default is `false`.
   * @returns If not elementwise, this will return a new group with M Pt, each with N dimensions (M-rows, N-columns).
   */
  static multiply(a, b, transposed = false, elementwise = false) {
    const g = new Group();
    if (typeof b != "number") {
      if (elementwise) {
        if (a.length != b.length)
          throw new Error("Cannot multiply matrix element-wise because the matrices' sizes don't match.");
        for (let ai = 0, alen = a.length; ai < alen; ai++) {
          g.push(a[ai].$multiply(b[ai]));
        }
      } else {
        if (!transposed && a[0].length != b.length)
          throw new Error("Cannot multiply matrix if rows in matrix-a don't match columns in matrix-b.");
        if (transposed && a[0].length != b[0].length)
          throw new Error("Cannot multiply matrix if transposed and the columns in both matrices don't match.");
        if (!transposed)
          b = _Mat.transpose(b);
        for (let ai = 0, alen = a.length; ai < alen; ai++) {
          const p = Pt.make(b.length, 0);
          for (let bi = 0, blen = b.length; bi < blen; bi++) {
            p[bi] = Vec.dot(a[ai], b[bi]);
          }
          g.push(p);
        }
      }
    } else {
      for (let ai = 0, alen = a.length; ai < alen; ai++) {
        g.push(a[ai].$multiply(b));
      }
    }
    return g;
  }
  /**
   * Zip one slice of an array of Pts. For example, if the input `g` are organized in rows, then this function will take the values in a specific column.
   * @param g a group of Pt
   * @param idx index to zip at
   * @param defaultValue a default value to fill if index out of bound. If not provided, it will throw an error instead.
   */
  static zipSlice(g, index, defaultValue = false) {
    const z = [];
    for (let i = 0, len = g.length; i < len; i++) {
      if (g[i].length - 1 < index && defaultValue === false)
        throw `Index ${index} is out of bounds`;
      z.push(g[i][index] || defaultValue);
    }
    return new Pt(z);
  }
  /**
   * Zip a group of Pt. For example, `[[1,2],[3,4],[5,6]]` will become `[[1,3,5],[2,4,6]]`.
   * @param g a group of Pt
   * @param defaultValue a default value to fill if index out of bound. If not provided, it will throw an error instead.
   * @param useLongest If true, find the longest list of values in a Pt and use its length for zipping. Default is false, which uses the first item's length for zipping.
   */
  static zip(g, defaultValue = false, useLongest = false) {
    const ps = new Group();
    const len = useLongest ? g.reduce((a, b) => Math.max(a, b.length), 0) : g[0].length;
    for (let i = 0; i < len; i++) {
      ps.push(_Mat.zipSlice(g, i, defaultValue));
    }
    return ps;
  }
  /**
   * Same as `zip` function.
   */
  static transpose(g, defaultValue = false, useLongest = false) {
    return _Mat.zip(g, defaultValue, useLongest);
  }
  static toDOMMatrix(m) {
    return [m[0][0], m[0][1], m[1][0], m[1][1], m[2][0], m[2][1]];
  }
  /**
   * Transform a 2D point given a 2x3 or 3x3 matrix.
   * @param pt a Pt to be transformed
   * @param m 2x3 or 3x3 matrix
   * @returns a new transformed Pt
   */
  static transform2D(pt, m) {
    const x = pt[0] * m[0][0] + pt[1] * m[1][0] + m[2][0];
    const y = pt[0] * m[0][1] + pt[1] * m[1][1] + m[2][1];
    return new Pt(x, y);
  }
  /**
   * Get a scale matrix for use in `transform2D`.
   */
  static scale2DMatrix(x, y) {
    return new Group(
      new Pt(x, 0, 0),
      new Pt(0, y, 0),
      new Pt(0, 0, 1)
    );
  }
  /**
   * Get a rotate matrix for use in `transform2D`.
   */
  static rotate2DMatrix(cosA, sinA) {
    return new Group(
      new Pt(cosA, sinA, 0),
      new Pt(-sinA, cosA, 0),
      new Pt(0, 0, 1)
    );
  }
  /**
   * Get a shear matrix for use in `transform2D`.
   */
  static shear2DMatrix(tanX, tanY) {
    return new Group(
      new Pt(1, tanX, 0),
      new Pt(tanY, 1, 0),
      new Pt(0, 0, 1)
    );
  }
  /**
   * Get a translate matrix for use in `transform2D`.
   */
  static translate2DMatrix(x, y) {
    return new Group(
      new Pt(1, 0, 0),
      new Pt(0, 1, 0),
      new Pt(x, y, 1)
    );
  }
  /**
   * Get a matrix to scale a point from an origin point. For use in `transform2D`.
   */
  static scaleAt2DMatrix(sx, sy, at) {
    const m = _Mat.scale2DMatrix(sx, sy);
    m[2][0] = -at[0] * sx + at[0];
    m[2][1] = -at[1] * sy + at[1];
    return m;
  }
  /**
   * Get a matrix to rotate a point from an origin point. For use in `transform2D`.
   */
  static rotateAt2DMatrix(cosA, sinA, at) {
    const m = _Mat.rotate2DMatrix(cosA, sinA);
    m[2][0] = at[0] * (1 - cosA) + at[1] * sinA;
    m[2][1] = at[1] * (1 - cosA) - at[0] * sinA;
    return m;
  }
  /**
   * Get a matrix to shear a point from an origin point. For use in `transform2D`.
   */
  static shearAt2DMatrix(tanX, tanY, at) {
    const m = _Mat.shear2DMatrix(tanX, tanY);
    m[2][0] = -at[1] * tanY;
    m[2][1] = -at[0] * tanX;
    return m;
  }
  /**
   * Get a matrix to reflect a point along a line. For use in `transform2D`.
   * @param p1 first end point to define the reflection line
   * @param p1 second end point to define the reflection line
   */
  static reflectAt2DMatrix(p1, p2) {
    const intercept = Line.intercept(p1, p2);
    if (intercept == void 0) {
      return [
        new Pt([-1, 0, 0]),
        new Pt([0, 1, 0]),
        new Pt([p1[0] + p2[0], 0, 1])
      ];
    } else {
      const yi = intercept.yi;
      const ang2 = Math.atan(intercept.slope) * 2;
      const cosA = Math.cos(ang2);
      const sinA = Math.sin(ang2);
      return [
        new Pt([cosA, sinA, 0]),
        new Pt([sinA, -cosA, 0]),
        new Pt([-yi * sinA, yi + yi * cosA, 1])
      ];
    }
  }
};

// src/Op.ts
var _errorLength = (obj, param = "expected") => Util.warn("Group's length is less than " + param, obj);
var _errorOutofBound = (obj, param = "") => Util.warn(`Index ${param} is out of bound in Group`, obj);
var Line = class _Line {
  /**
   * Create a line that originates from an anchor point, given an angle and a magnitude.
   * @param anchor an anchor Pt
   * @param angle an angle in radian
   * @param magnitude magnitude of the line
   * @return a Group of 2 Pts representing a line segement
   */
  static fromAngle(anchor, angle, magnitude) {
    let g = new Group(new Pt(anchor), new Pt(anchor));
    g[1].toAngle(angle, magnitude, true);
    return g;
  }
  /**
   * Calculate the slope of a line.
   * @param p1 line's first end point
   * @param p2 line's second end point
   */
  static slope(p1, p2) {
    return p2[0] - p1[0] === 0 ? void 0 : (p2[1] - p1[1]) / (p2[0] - p1[0]);
  }
  /**
   * Calculate the slope and xy intercepts of a line.
   * @param p1 line's first end point
   * @param p2 line's second end point
   * @returns an object with `slope`, `xi`, `yi` properties 
   */
  static intercept(p1, p2) {
    if (p2[0] - p1[0] === 0) {
      return void 0;
    } else {
      let m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
      let c = p1[1] - m * p1[0];
      return { slope: m, yi: c, xi: m === 0 ? void 0 : -c / m };
    }
  }
  /**
   * Given a 2D path and a point, find whether the point is on left or right side of the line.
   * @param line  a Group or an Iterable<PtLike> representing a line
   * @param pt a Pt or numeric array
   * @returns a negative value if on left and a positive value if on right. If collinear, then the return value is 0.
   */
  static sideOfPt2D(line, pt) {
    let _line = Util.iterToArray(line);
    return (_line[1][0] - _line[0][0]) * (pt[1] - _line[0][1]) - (pt[0] - _line[0][0]) * (_line[1][1] - _line[0][1]);
  }
  /**
   * Check if three Pts are collinear, ie, on the same straight path.
   * @param p1 first Pt
   * @param p2 second Pt
   * @param p3 third Pt
   * @param threshold a threshold where a smaller value means higher precision threshold for the straight line. Default is 0.01.
   */
  static collinear(p1, p2, p3, threshold = 0.01) {
    let a = new Pt(0, 0, 0).to(p1).$subtract(p2);
    let b = new Pt(0, 0, 0).to(p1).$subtract(p3);
    return a.$cross(b).divide(1e3).equals(new Pt(0, 0, 0), threshold);
  }
  /**
   * Get magnitude of a line segment.
   * @param line a Group or an Iterable<Pt> with at least 2 Pt
   */
  static magnitude(line) {
    let _line = Util.iterToArray(line);
    return _line.length >= 2 ? _line[1].$subtract(_line[0]).magnitude() : 0;
  }
  /**
   * Get squared magnitude of a line segment.
   * @param _line a Group or an Iterable<Pt> with at least 2 Pt
   */
  static magnitudeSq(line) {
    let _line = Util.iterToArray(line);
    return _line.length >= 2 ? _line[1].$subtract(_line[0]).magnitudeSq() : 0;
  }
  /**
   * Find a point on a line that is perpendicular (shortest distance) to a target point.
   * @param line a Group or an Iterable<Pt> that defines a line
   * @param pt a target Pt 
   * @param asProjection if true, this returns the projection vector instead. Default is false.
   * @returns a Pt on the line that is perpendicular to the target Pt, or a projection vector if `asProjection` is true.
   */
  static perpendicularFromPt(line, pt, asProjection = false) {
    let _line = Util.iterToArray(line);
    if (_line[0].equals(_line[1]))
      return void 0;
    let a = _line[0].$subtract(_line[1]);
    let b = _line[1].$subtract(pt);
    let proj = b.$subtract(a.$project(b));
    return asProjection ? proj : proj.$add(pt);
  }
  /**
   * Given a line and a point, find the shortest distance from the point to the line.
   * @param line a Group of 2 Pts
   * @param pt a Pt
   * @see `Line.perpendicularFromPt`
   */
  static distanceFromPt(line, pt) {
    let _line = Util.iterToArray(line);
    let projectionVector = _Line.perpendicularFromPt(_line, pt, true);
    if (projectionVector) {
      return projectionVector.magnitude();
    } else {
      return _line[0].$subtract(pt).magnitude();
    }
  }
  /**
   * Given two lines as rays (infinite lines), find their intersection point if any.
   * @param la a Group or an Iterable<Pt> with 2 Pt representing a ray
   * @param lb a Group or an Iterable<Pt> with 2 Pts representing another ray
   * @returns an intersection Pt or undefined if no intersection
   */
  static intersectRay2D(la, lb) {
    let _la = Util.iterToArray(la);
    let _lb = Util.iterToArray(lb);
    let a = _Line.intercept(_la[0], _la[1]);
    let b = _Line.intercept(_lb[0], _lb[1]);
    let pa = _la[0];
    let pb = _lb[0];
    if (a == void 0) {
      if (b == void 0)
        return void 0;
      let y1 = -b.slope * (pb[0] - pa[0]) + pb[1];
      return new Pt(pa[0], y1);
    } else {
      if (b == void 0) {
        let y1 = -a.slope * (pa[0] - pb[0]) + pa[1];
        return new Pt(pb[0], y1);
      } else if (b.slope != a.slope) {
        let px = (a.slope * pa[0] - b.slope * pb[0] + pb[1] - pa[1]) / (a.slope - b.slope);
        let py = a.slope * (px - pa[0]) + pa[1];
        return new Pt(px, py);
      } else {
        if (a.yi == b.yi) {
          return new Pt(pa[0], pa[1]);
        } else {
          return void 0;
        }
      }
    }
  }
  /**
   * Given two line segemnts, find their intersection point if any.
   * @param la a Group or an Iterable<Pt> with 2 Pt representing a line segment
   * @param lb a Group or an Iterable<Pt> with 2 Pt representing a line segment
   * @returns an intersection Pt or undefined if no intersection
   */
  static intersectLine2D(la, lb) {
    let _la = Util.iterToArray(la);
    let _lb = Util.iterToArray(lb);
    let pt = _Line.intersectRay2D(_la, _lb);
    return pt && Geom.withinBound(pt, _la[0], _la[1]) && Geom.withinBound(pt, _lb[0], _lb[1]) ? pt : void 0;
  }
  /**
   * Given a line segemnt and a ray (infinite line), find their intersection point if any.
   * @param line a Group of 2 Pts representing a line segment
   * @param ray a Group of 2 Pts representing a ray
   * @returns an intersection Pt or undefined if no intersection
   */
  static intersectLineWithRay2D(line, ray) {
    let _line = Util.iterToArray(line);
    let _ray = Util.iterToArray(ray);
    let pt = _Line.intersectRay2D(_line, _ray);
    return pt && Geom.withinBound(pt, _line[0], _line[1]) ? pt : void 0;
  }
  /**
   * Given a line segemnt or a ray (infinite line), find its intersection point(s) with a polygon.
   * @param lineOrRay a Group or an Iterable<Pt> with 2 Pt representing a line or ray
   * @param poly a Group or an Iterable<Pt> representing a polygon
   * @param sourceIsRay a boolean value to treat the line as a ray (infinite line). Default is `false`.
   */
  static intersectPolygon2D(lineOrRay, poly, sourceIsRay = false) {
    let _lineOrRay = Util.iterToArray(lineOrRay);
    let _poly = Util.iterToArray(poly);
    let fn = sourceIsRay ? _Line.intersectLineWithRay2D : _Line.intersectLine2D;
    let pts = new Group();
    for (let i = 0, len = _poly.length; i < len; i++) {
      let next = i === len - 1 ? 0 : i + 1;
      let d = fn([_poly[i], _poly[next]], _lineOrRay);
      if (d)
        pts.push(d);
    }
    return pts.length > 0 ? pts : void 0;
  }
  /**
   * Find intersection points of 2 sets of lines. This checks all line segments in the two lists. Consider using a bounding-box check before calling this. If you are checking convex polygon intersections, using [`Polygon.intersectPolygon2D`](#link) will be more efficient.
   * @param lines1 an Array/Iterable of (Groups or Iterables<Pt>)
   * @param lines2 an Array/Iterable of (Groups or Iterables<Pt>)
   * @param isRay a boolean value to treat the line as a ray (infinite line). Default is `false`.
   */
  static intersectLines2D(lines1, lines2, isRay = false) {
    let group = new Group();
    let fn = isRay ? _Line.intersectLineWithRay2D : _Line.intersectLine2D;
    for (let l1 of lines1) {
      for (let l2 of lines2) {
        let _ip = fn(l1, l2);
        if (_ip)
          group.push(_ip);
      }
    }
    return group;
  }
  /**
   * Get two points of a ray that intersects with a point on a 2D grid.
   * @param ray a Group or an Iterable<Pt> representing a ray
   * @param gridPt a Pt on the grid
   * @returns a group of two intersecting Pts. The first one is horizontal intersection and the second one is vertical intersection.
   */
  static intersectGridWithRay2D(ray, gridPt) {
    let _ray = Util.iterToArray(ray);
    let t = _Line.intercept(new Pt(_ray[0]).subtract(gridPt), new Pt(_ray[1]).subtract(gridPt));
    let g = new Group();
    if (t && t.xi)
      g.push(new Pt(gridPt[0] + t.xi, gridPt[1]));
    if (t && t.yi)
      g.push(new Pt(gridPt[0], gridPt[1] + t.yi));
    return g;
  }
  /**
   * Get two intersection Pts of a line segment with a 2D grid point.
   * @param line a ray specified by 2 Pts
   * @param gridPt a Pt on the grid
   * @returns a group of two intersecting Pts. The first one is horizontal intersection and the second one is vertical intersection.
   */
  static intersectGridWithLine2D(line, gridPt) {
    let _line = Util.iterToArray(line);
    let g = _Line.intersectGridWithRay2D(_line, gridPt);
    let gg = new Group();
    for (let i = 0, len = g.length; i < len; i++) {
      if (Geom.withinBound(g[i], _line[0], _line[1]))
        gg.push(g[i]);
    }
    return gg;
  }
  /**
   * An easy way to get rectangle-line intersection points. For more optimized implementation, store the rectangle's sides separately (eg, `Rectangle.sides()`) and use `Polygon.intersectPolygon2D()`.
   * @param line a Group representing a line
   * @param rect a Group representing a rectangle
   * @returns a Group of intersecting Pts
   */
  static intersectRect2D(line, rect) {
    let _line = Util.iterToArray(line);
    let _rect = Util.iterToArray(rect);
    let box = Geom.boundingBox(Group.fromPtArray(_line));
    if (!Rectangle.hasIntersectRect2D(box, _rect))
      return new Group();
    return _Line.intersectLines2D([_line], Rectangle.sides(_rect));
  }
  /**
   * Get evenly distributed points on a line. Similar to [`Create.distributeLinear`](#link) but excluding end points.
   * @param line a Group or an Iterable<PtLike> representing a line
   * @param num number of points to get
   */
  static subpoints(line, num) {
    let _line = Util.iterToArray(line);
    let pts = new Group();
    for (let i = 1; i <= num; i++) {
      pts.push(Geom.interpolate(_line[0], _line[1], i / (num + 1)));
    }
    return pts;
  }
  /**
   * Crop this line by a circle or rectangle at end points. This can be useful for creating arrows that connect to an object's edge.
   * @param line a Group or an Iterable<Pt> representing a line to crop
   * @param size size of circle or rectangle as Pt
   * @param index line's end point index, ie, 0 = start and 1 = end.
   * @param cropAsCircle a boolean to specify whether the `size` parameter should be treated as circle. Default is `true`.
   * @return an intersecting point on the line that can be used for cropping.
   */
  static crop(line, size, index = 0, cropAsCircle = true) {
    let _line = Util.iterToArray(line);
    let tdx = index === 0 ? 1 : 0;
    let ls = _line[tdx].$subtract(_line[index]);
    if (ls[0] === 0 || size[0] === 0)
      return _line[index];
    if (cropAsCircle) {
      let d = ls.unit().multiply(size[1]);
      return _line[index].$add(d);
    } else {
      let rect = Rectangle.fromCenter(_line[index], size);
      let sides = Rectangle.sides(rect);
      let sideIdx = 0;
      if (Math.abs(ls[1] / ls[0]) > Math.abs(size[1] / size[0])) {
        sideIdx = ls[1] < 0 ? 0 : 2;
      } else {
        sideIdx = ls[0] < 0 ? 3 : 1;
      }
      return _Line.intersectRay2D(sides[sideIdx], _line);
    }
  }
  /**
   * Create an marker arrow or line, placed at an end point of this line.
   * @param line a Group or an Iterable<Pt> representing a line to place marker
   * @param size size of the marker as Pt
   * @param graphic either "arrow" or "line"
   * @param atTail a boolean, if `true`, the marker will be positioned at tail of the line (ie, index = 1). Default is `true`.
   * @returns a Group that defines the marker's shape
   */
  static marker(line, size, graphic = "arrow", atTail = true) {
    let _line = Util.iterToArray(line);
    let h = atTail ? 0 : 1;
    let t = atTail ? 1 : 0;
    let unit = _line[h].$subtract(_line[t]);
    if (unit.magnitudeSq() === 0)
      return new Group();
    unit.unit();
    let ps = Geom.perpendicular(unit).multiply(size[0]).add(_line[t]);
    if (graphic == "arrow") {
      ps.add(unit.$multiply(size[1]));
      return new Group(_line[t], ps[0], ps[1]);
    } else {
      return new Group(ps[0], ps[1]);
    }
  }
  /**
   * Convert this line to a new rectangle representation.
   * @param line a Group representing a line
   */
  static toRect(line) {
    let _line = Util.iterToArray(line);
    return new Group(_line[0].$min(_line[1]), _line[0].$max(_line[1]));
  }
};
var Rectangle = class _Rectangle {
  /**
   * Create a rectangle from top-left anchor point. Same as [`Rectangle.fromTopLeft`](#link).
   * @param topLeft top-left point
   * @param widthOrSize width as a number, or a Pt that defines its size
   * @param height optional height as a number
   * @returns a Group of 2 Pts representing a rectangle
   */
  static from(topLeft, widthOrSize, height) {
    return _Rectangle.fromTopLeft(topLeft, widthOrSize, height);
  }
  /**
   * Create a rectangle given a top-left position and a size.
   * @param topLeft top-left point
   * @param widthOrSize width as a number, or a Pt that defines its size
   * @param height optional height as a number
   * @returns a Group of 2 Pts representing a rectangle
   */
  static fromTopLeft(topLeft, widthOrSize, height) {
    let size = typeof widthOrSize == "number" ? [widthOrSize, height || widthOrSize] : widthOrSize;
    return new Group(new Pt(topLeft), new Pt(topLeft).add(size));
  }
  /**
   * Create a rectangle given a center position and a size.
   * @param topLeft top-left point
   * @param widthOrSize width as a number, or a Pt that defines its size
   * @param height optional height as a number
   * @returns a Group of 2 Pts representing a rectangle
   */
  static fromCenter(center, widthOrSize, height) {
    let half = typeof widthOrSize == "number" ? [widthOrSize / 2, (height || widthOrSize) / 2] : new Pt(widthOrSize).divide(2);
    return new Group(new Pt(center).subtract(half), new Pt(center).add(half));
  }
  /**
   * Create a new circle that either fits within or encloses the rectangle. Same as [`Circle.fromRect`](#link).
   * @param pts a Group or an Iterable<Pt> with 2 Pt representing a rectangle
   * @param enclose if `true`, the circle will enclose the rectangle. If `false`, the circle will fit inside the rectangle. 
   * @returns a Group that represents a circle
   */
  static toCircle(pts, enclose = true) {
    return Circle.fromRect(pts, enclose);
  }
  /**
   * Create a square that either fits within or encloses a rectangle.
   * @param pts a Group or an Iterable<Pt> with 2 Pt representing a rectangle
   * @param enclose if `true`, the square will enclose the rectangle. Default is `false`, which will fit the square inside the rectangle.
   * @returns a Group of 2 Pts representing a rectangle
   */
  static toSquare(pts, enclose = false) {
    let _pts = Util.iterToArray(pts);
    let s = _Rectangle.size(_pts);
    let m = enclose ? s.maxValue().value : s.minValue().value;
    return _Rectangle.fromCenter(_Rectangle.center(_pts), m, m);
  }
  /**
   * Get the size of this rectangle as a Pt.
   * @param p a Group or an Iterable<Pt> with 2 Pt representing a Rectangle
   */
  static size(pts) {
    let p = Util.iterToArray(pts);
    return p[0].$max(p[1]).subtract(p[0].$min(p[1]));
  }
  /**
   * Get the center of this rectangle.
   * @param p a Group or an Iterable<Pt> with 2 Pt representing a Rectangle
   */
  static center(pts) {
    let p = Util.iterToArray(pts);
    let min = p[0].$min(p[1]);
    let max = p[0].$max(p[1]);
    return min.add(max.$subtract(min).divide(2));
  }
  /**
   * Get the 4 corners of this rectangle as a Group.
   * @param rect a Group or an Iterable<Pt> with 2 Pt representing a Rectangle
   */
  static corners(rect) {
    let _rect = Util.iterToArray(rect);
    let p0 = _rect[0].$min(_rect[1]);
    let p2 = _rect[0].$max(_rect[1]);
    return new Group(p0, new Pt(p2.x, p0.y), p2, new Pt(p0.x, p2.y));
  }
  /**
   * Get the 4 sides of this rectangle as an array of 4 Groups.
   * @param rect a Group or an Iterable<Pt> with 2 Pt representing a Rectangle
   * @returns an array of 4 Groups, each of which represents a line segment
   */
  static sides(rect) {
    let [p0, p1, p2, p3] = _Rectangle.corners(rect);
    return [
      new Group(p0, p1),
      new Group(p1, p2),
      new Group(p2, p3),
      new Group(p3, p0)
    ];
  }
  /**
   * Given an array of rectangles, get a rectangle that bounds all of them.
   * @param rects an array of (Groups or Iterables<PtLike>) that represents a set of rectangles
   * @returns the bounding rectangle as a Group
   */
  static boundingBox(rects) {
    let _rects = Util.iterToArray(rects);
    let merged = Util.flatten(_rects, false);
    let min = Pt.make(2, Number.MAX_VALUE);
    let max = Pt.make(2, Number.MIN_VALUE);
    for (let i = 0, len = merged.length; i < len; i++) {
      let k = 0;
      for (let m of merged[i]) {
        min[k] = Math.min(min[k], m[k]);
        max[k] = Math.max(max[k], m[k]);
        if (++k >= 2)
          break;
      }
    }
    return new Group(min, max);
  }
  /**
   * Convert this rectangle into a Group representing a polygon. An alias for [`Rectangle.corners`](#link)
   * @param rect a Group or an Iterable<Pt> with 2 Pt representing a Rectangle
   */
  static polygon(rect) {
    return _Rectangle.corners(rect);
  }
  /**
   * Subdivide a rectangle into 4 rectangles, one for each quadrant.
   * @param rect a Group or an Iterable<Pt> with 2 Pt representing a Rectangle
   * @returns an array of 4 Groups of rectangles
   */
  static quadrants(rect, center) {
    let _rect = Util.iterToArray(rect);
    let corners = _Rectangle.corners(_rect);
    let _center = center != void 0 ? new Pt(center) : _Rectangle.center(_rect);
    return corners.map((c) => new Group(c, _center).boundingBox());
  }
  /**
   * Subdivde a rectangle into 2 rectangles, by row or by column.
   * @param rect a Group or an Iterable<Pt> with 2 Pt representing a Rectangle
   * @param ratio a value between 0 to 1 to indicate the split ratio
   * @param asRows if `true`, split into 2 rows. Default is `false` which splits into 2 columns.
   * @returns an array of 2 Groups of rectangles
   */
  static halves(rect, ratio = 0.5, asRows = false) {
    let _rect = Util.iterToArray(rect);
    let min = _rect[0].$min(_rect[1]);
    let max = _rect[0].$max(_rect[1]);
    let mid = asRows ? Num.lerp(min[1], max[1], ratio) : Num.lerp(min[0], max[0], ratio);
    return asRows ? [new Group(min, new Pt(max[0], mid)), new Group(new Pt(min[0], mid), max)] : [new Group(min, new Pt(mid, max[1])), new Group(new Pt(mid, min[1]), max)];
  }
  /**
   * Check if a point is within a rectangle.
   * @param rect a Group of 2 Pts representing a Rectangle
   * @param pt the point to check
   */
  static withinBound(rect, pt) {
    let _rect = Util.iterToArray(rect);
    return Geom.withinBound(pt, _rect[0], _rect[1]);
  }
  /**
   * Check if a rectangle is within the bounds of another rectangle.
   * @param rect1 a Group of 2 Pts representing a rectangle
   * @param rect2 a Group of 2 Pts representing a rectangle
   * @param resetBoundingBox if `true`, reset the bounding box. Default is `false` which assumes the rect's first Pt at is its top-left corner.
   */
  static hasIntersectRect2D(rect1, rect2, resetBoundingBox = false) {
    let _rect1 = Util.iterToArray(rect1);
    let _rect2 = Util.iterToArray(rect2);
    if (resetBoundingBox) {
      _rect1 = Geom.boundingBox(_rect1);
      _rect2 = Geom.boundingBox(_rect2);
    }
    if (_rect1[0][0] > _rect2[1][0] || _rect2[0][0] > _rect1[1][0])
      return false;
    if (_rect1[0][1] > _rect2[1][1] || _rect2[0][1] > _rect1[1][1])
      return false;
    return true;
  }
  /**
   * An easy way to get rectangle-rectangle intersection points. For more optimized implementation, store the rectangle's sides separately (eg, `Rectangle.sides()`) and use `Polygon.intersectPolygon2D()`.
   * @param rect1 a Group of 2 Pts representing a rectangle
   * @param rect2 a Group of 2 Pts representing a rectangle
   */
  static intersectRect2D(rect1, rect2) {
    let _rect1 = Util.iterToArray(rect1);
    let _rect2 = Util.iterToArray(rect2);
    if (!_Rectangle.hasIntersectRect2D(_rect1, _rect2))
      return new Group();
    return Line.intersectLines2D(_Rectangle.sides(_rect1), _Rectangle.sides(_rect2));
  }
};
var Circle = class _Circle {
  /**
   * Create a circle that either fits within, or encloses, a rectangle.
   * @param pts a Group or an Iterable<PtLike> with 2 Pt representing a rectangle
   * @param enclose if `true`, the circle will enclose the rectangle. Default is `false`, which will fit the circle inside the rectangle.
   * @returns a Group that represents a circle
   */
  static fromRect(pts, enclose = false) {
    let _pts = Util.iterToArray(pts);
    let r = 0;
    let min = r = Rectangle.size(_pts).minValue().value / 2;
    if (enclose) {
      let max = Rectangle.size(_pts).maxValue().value / 2;
      r = Math.sqrt(min * min + max * max);
    } else {
      r = min;
    }
    return new Group(Rectangle.center(_pts), new Pt(r, r));
  }
  /**
   * Create a circle that either fits within, or encloses, a triangle. Same as [`Triangle.circumcircle`](#link) or [`Triangle.incircle`](#link).
   * @param pts a Group or an Iterable<Pt> with 3 Pt representing a rectangle
   * @param enclose if `true`, the circle will enclose the triangle. Default is `false`, which will fit the circle inside the triangle.
   * @returns a Group that represents a circle
   */
  static fromTriangle(pts, enclose = false) {
    if (enclose) {
      return Triangle.circumcircle(pts);
    } else {
      return Triangle.incircle(pts);
    }
  }
  /**
   * Create a circle based on a center point and a radius.
   * @param pt center point of circle
   * @param radius radius of circle
   * @returns a Group that represents a circle
   */
  static fromCenter(pt, radius) {
    return new Group(new Pt(pt), new Pt(radius, radius));
  }
  /**
   * Check if a point is within a circle.
   * @param pts a Group or an Iterable<Pt> with 2 Pt representing a circle
   * @param pt the point to checks
   * @param threshold an optional small number to set threshold. Default is 0.
   */
  static withinBound(pts, pt, threshold = 0) {
    let _pts = Util.iterToArray(pts);
    let d = _pts[0].$subtract(pt);
    return d.dot(d) + threshold < _pts[1].x * _pts[1].x;
  }
  /**
   * Get the intersection points between a circle and a ray (infinite line).
   * @param circle a Group or an Iterable<Pt> with 2 Pt representing a circle
   * @param ray a Group or an Iterable<Pt> with 2 Pt representing a ray 
   * @returns a Group of intersection points, or an empty Group if no intersection is found
   */
  static intersectRay2D(circle, ray) {
    let _pts = Util.iterToArray(circle);
    let _ray = Util.iterToArray(ray);
    let d = _ray[0].$subtract(_ray[1]);
    let f = _pts[0].$subtract(_ray[0]);
    let a = d.dot(d);
    let b = f.dot(d);
    let c = f.dot(f) - _pts[1].x * _pts[1].x;
    let p = b / a;
    let q = c / a;
    let disc = p * p - q;
    if (disc < 0) {
      return new Group();
    } else {
      let discSqrt = Math.sqrt(disc);
      let t1 = -p + discSqrt;
      let p1 = _ray[0].$subtract(d.$multiply(t1));
      if (disc === 0)
        return new Group(p1);
      let t2 = -p - discSqrt;
      let p2 = _ray[0].$subtract(d.$multiply(t2));
      return new Group(p1, p2);
    }
  }
  /**
   * Get the intersection points between a circle and a line segment.
   * @param circle a Group or an Iterable<Pt> with Pt representing a circle
   * @param line a Group or an Iterable<Pt> with 2 Pt representing a line
   * @returns a Group of intersection points, or an empty Group if no intersection is found
   */
  static intersectLine2D(circle, line) {
    let _pts = Util.iterToArray(circle);
    let _line = Util.iterToArray(line);
    let ps = _Circle.intersectRay2D(_pts, _line);
    let g = new Group();
    if (ps.length > 0) {
      for (let i = 0, len = ps.length; i < len; i++) {
        if (Rectangle.withinBound(_line, ps[i]))
          g.push(ps[i]);
      }
    }
    return g;
  }
  /**
   * Get the intersection points between two circles.
   * @param circle1 a Group or an Iterable<Pt> with 2 Pt representing a circle
   * @param circle2 a Group or an Iterable<Pt> with 2 Pt representing a circle
   * @returns a Group of intersection points, or an empty Group if no intersection is found
   */
  static intersectCircle2D(circle1, circle2) {
    let _pts = Util.iterToArray(circle1);
    let _circle = Util.iterToArray(circle2);
    let dv = _circle[0].$subtract(_pts[0]);
    let dr2 = dv.magnitudeSq();
    let dr = Math.sqrt(dr2);
    let ar = _pts[1].x;
    let br = _circle[1].x;
    let ar2 = ar * ar;
    let br2 = br * br;
    if (dr > ar + br) {
      return new Group();
    } else if (dr < Math.abs(ar - br)) {
      return new Group(_pts[0].clone());
    } else {
      let a = (ar2 - br2 + dr2) / (2 * dr);
      let h = Math.sqrt(ar2 - a * a);
      let p = dv.$multiply(a / dr).add(_pts[0]);
      return new Group(
        new Pt(p.x + h * dv.y / dr, p.y - h * dv.x / dr),
        new Pt(p.x - h * dv.y / dr, p.y + h * dv.x / dr)
      );
    }
  }
  /**
   * Quick way to check rectangle intersection with a circle. 
   * For more optimized implementation, store the rectangle's sides separately (eg, [`Rectangle.sides`](#link)) and use [`Polygon.intersectPolygon2D()`](#link).
   * @param circle a Group or an Iterable<Pt> with 2 Pt representing a circle
   * @param rect a Group or an Iterable<Pt> with 2 Pt representing a rectangle
   * @returns a Group of intersection points, or an empty Group if no intersection is found
   */
  static intersectRect2D(circle, rect) {
    let _pts = Util.iterToArray(circle);
    let _rect = Util.iterToArray(rect);
    let sides = Rectangle.sides(_rect);
    let g = [];
    for (let i = 0, len = sides.length; i < len; i++) {
      let ps = _Circle.intersectLine2D(_pts, sides[i]);
      if (ps.length > 0)
        g.push(ps);
    }
    return Util.flatten(g);
  }
  /**
   * Get a rectangle that either fits within or encloses this circle. See also [`Rectangle.toCircle`](#link)
   * @param circle a Group or an Iterable<Pt> with 2 Pt representing a circle
   * @param within if `true`, the rectangle will be within the circle. If `false`, the rectangle will enclose the circle. 
   * @returns a Group representing a rectangle
   */
  static toRect(circle, within = false) {
    let _pts = Util.iterToArray(circle);
    let r = _pts[1][0];
    if (within) {
      let half = Math.sqrt(r * r) / 2;
      return new Group(_pts[0].$subtract(half), _pts[0].$add(half));
    } else {
      return new Group(_pts[0].$subtract(r), _pts[0].$add(r));
    }
  }
  /**
   * Get a triangle that fits within this circle.
   * @param circle a Group or an Iterable<Pt> with 2 Pt representing a circle
   * @param within if `true`, the triangle will be within the circle. If `false`, the triangle will enclose the circle. 
   */
  static toTriangle(circle, within = true) {
    let _pts = Util.iterToArray(circle);
    if (within) {
      let ang = -Math.PI / 2;
      let inc = Math.PI * 2 / 3;
      let g = new Group();
      for (let i = 0; i < 3; i++) {
        g.push(_pts[0].clone().toAngle(ang, _pts[1][0], true));
        ang += inc;
      }
      return g;
    } else {
      return Triangle.fromCenter(_pts[0], _pts[1][0]);
    }
  }
};
var Triangle = class _Triangle {
  /**
   * Create a triangle from a rectangle. The triangle will be isosceles, with the bottom of the rectangle as its base.
   * @param rect a Group or an Iterable<Pt> with 2 Pt representing a rectangle
   */
  static fromRect(rect) {
    let _rect = Util.iterToArray(rect);
    let top = _rect[0].$add(_rect[1]).divide(2);
    top.y = _rect[0][1];
    let left = _rect[1].clone();
    left.x = _rect[0][0];
    return new Group(top, _rect[1].clone(), left);
  }
  /**
   * Create a triangle that fits within a circle.
   * @param circle a Group or an Iterable<Pt> with 2 Pt representing a circle
   */
  static fromCircle(circle) {
    return Circle.toTriangle(circle, true);
  }
  /**
   * Create an equilateral triangle based on a center point and a size.
   * @param pt the center point
   * @param size size is the magnitude of lines from center to the triangle's vertices, like a "radius".
   */
  static fromCenter(pt, size) {
    return _Triangle.fromCircle(Circle.fromCenter(pt, size));
  }
  /**
   * Get the medial, which is an inner triangle formed by connecting the midpoints of this triangle's sides.
   * @param tri a Group or an Iterable<Pt> representing a triangle
   * @returns a Group representing a medial triangle
   */
  static medial(tri) {
    let _pts = Util.iterToArray(tri);
    if (_pts.length < 3)
      return _errorLength(new Group(), 3);
    return Polygon.midpoints(_pts, true);
  }
  /**
   * Given a point of the triangle, the opposite side is the side which the point doesn't touch.
   * @param tri a Group or an Iterable<Pt> representing a triangle
   * @param index a Pt on the triangle group
   * @returns a Group that represents a line of the opposite side
   */
  static oppositeSide(tri, index) {
    let _pts = Util.iterToArray(tri);
    if (_pts.length < 3)
      return _errorLength(new Group(), 3);
    if (index === 0) {
      return Group.fromPtArray([_pts[1], _pts[2]]);
    } else if (index === 1) {
      return Group.fromPtArray([_pts[0], _pts[2]]);
    } else {
      return Group.fromPtArray([_pts[0], _pts[1]]);
    }
  }
  /**
   * Get a triangle's altitude, which is a line from a triangle's point to its opposite side, and perpendicular to its opposite side.
   * @param tri a Group or an Iterable<Pt> representing a triangle
   * @param index a Pt on the triangle group
   * @returns a Group that represents the altitude line
   */
  static altitude(tri, index) {
    let _pts = Util.iterToArray(tri);
    let opp = _Triangle.oppositeSide(_pts, index);
    if (opp.length > 1) {
      return new Group(_pts[index], Line.perpendicularFromPt(opp, _pts[index]));
    } else {
      return new Group();
    }
  }
  /**
   * Get orthocenter, which is the intersection point of a triangle's 3 altitudes (the 3 lines that are perpendicular to its 3 opposite sides).
   * @param tri a Group or an Iterable<Pt> representing a triangle
   * @returns the orthocenter as a Pt
   */
  static orthocenter(tri) {
    let _pts = Util.iterToArray(tri);
    if (_pts.length < 3)
      return _errorLength(void 0, 3);
    let a = _Triangle.altitude(_pts, 0);
    let b = _Triangle.altitude(_pts, 1);
    return Line.intersectRay2D(a, b);
  }
  /**
   * Get incenter, which is the center point of its inner circle, and also the intersection point of its 3 angle bisector lines (each of which cuts one of the 3 angles in half).
   * @param tri a Group or an Iterable<Pt> representing a triangle
   * @returns the incenter as a Pt
   */
  static incenter(tri) {
    let _pts = Util.iterToArray(tri);
    if (_pts.length < 3)
      return _errorLength(void 0, 3);
    let a = Polygon.bisector(_pts, 0).add(_pts[0]);
    let b = Polygon.bisector(_pts, 1).add(_pts[1]);
    return Line.intersectRay2D(new Group(_pts[0], a), new Group(_pts[1], b));
  }
  /**
   * Get an interior circle, which is the largest circle completed enclosed by this triangle.
   * @param tri a Group or an Iterable<Pt> representing a triangle
   * @param center Optional parameter if the incenter is already known. Otherwise, leave it empty and the incenter will be calculated
   */
  static incircle(tri, center) {
    let _pts = Util.iterToArray(tri);
    let c = center ? center : _Triangle.incenter(_pts);
    let area = Polygon.area(_pts);
    let perim = Polygon.perimeter(_pts, true);
    let r = 2 * area / perim.total;
    return Circle.fromCenter(c, r);
  }
  /**
   * Get circumcenter, which is the intersection point of its 3 perpendicular bisectors lines ( each of which divides a side in half and is perpendicular to the side).
   * @param tri a Group or an Iterable<Pt> representing a triangle
   * @returns the circumcenter as a Pt
   */
  static circumcenter(tri) {
    let _pts = Util.iterToArray(tri);
    let md = _Triangle.medial(_pts);
    let a = [md[0], Geom.perpendicular(_pts[0].$subtract(md[0])).p1.$add(md[0])];
    let b = [md[1], Geom.perpendicular(_pts[1].$subtract(md[1])).p1.$add(md[1])];
    return Line.intersectRay2D(a, b);
  }
  /**
   * Get circumcenter, which is the intersection point of its 3 perpendicular bisectors lines ( each of which divides a side in half and is perpendicular to the side).
   * @param tri a Group or an Iterable<Pt> representing a triangle
   * @param center Optional parameter if the circumcenter is already known. Otherwise, leave it empty and the circumcenter will be calculated 
   */
  static circumcircle(tri, center) {
    let _pts = Util.iterToArray(tri);
    let c = center ? center : _Triangle.circumcenter(_pts);
    let r = _pts[0].$subtract(c).magnitude();
    return Circle.fromCenter(c, r);
  }
};
var Polygon = class _Polygon {
  /**
   * Get the centroid of a polygon, which is the average of all its points.
   * @param pts a Group or an Iterable<PtLike> representing a polygon
   */
  static centroid(pts) {
    return Geom.centroid(pts);
  }
  /**
   * Create a rectangular polygon. Same as creating a Rectangle and then getting its corners via [`Rectangle.corners`](#link).
   * @param center center point of the rectangle
   * @param widthOrSize width as number, or a Pt representing the size of the rectangle
   * @param height optional height
   */
  static rectangle(center, widthOrSize, height) {
    return Rectangle.corners(Rectangle.fromCenter(center, widthOrSize, height));
  }
  /**
   * Create a regular polygon.
   * @param center The center position of the polygon
   * @param radius The radius, ie, a length from the center position to one of the polygon's corners.
   * @param sides Number of sides
   */
  static fromCenter(center, radius, sides) {
    let g = new Group();
    for (let i = 0; i < sides; i++) {
      let ang = Math.PI * 2 * i / sides;
      g.push(new Pt(Math.cos(ang) * radius, Math.sin(ang) * radius).add(center));
    }
    return g;
  }
  /**
   * Given a polygon, get one edge using an index.
   * @param pts a Group or an Iterable<PtLike> representing a polygon
   * @param index index of a Pt in the Group
   */
  static lineAt(pts, index) {
    let _pts = Util.iterToArray(pts);
    if (index < 0 || index >= _pts.length)
      throw new Error("index out of the Polygon's range");
    return new Group(_pts[index], index === _pts.length - 1 ? _pts[0] : _pts[index + 1]);
  }
  /**
   * Get the line segments in this polygon.
   * @param poly a Group or an Iterable<Pt>
   * @param closePath a boolean to specify whether the polygon should be closed (ie, whether the final segment should be counted).
   * @returns an array of Groups which has 2 Pts in each group
   */
  static lines(poly, closePath = true) {
    let _pts = Util.iterToArray(poly);
    if (_pts.length < 2)
      return _errorLength(new Group(), 2);
    let sp = Util.split(_pts, 2, 1);
    if (closePath)
      sp.push(new Group(_pts[_pts.length - 1], _pts[0]));
    return sp.map((g) => g);
  }
  /**
   * Get a new polygon group that is derived from midpoints in this polygon.
   * @param poly a Group or an Iterable<Pt>
   * @param closePath a boolean to specify whether the polygon should be closed (ie, whether the final segment should be counted).
   * @param t a value between 0 to 1 for interpolation. Default to 0.5 which will get the middle point.
   */
  static midpoints(poly, closePath = false, t = 0.5) {
    let sides = _Polygon.lines(poly, closePath);
    let mids = sides.map((s) => Geom.interpolate(s[0], s[1], t));
    return mids;
  }
  /**
   * Given a Pt in the polygon group, the adjacent sides are the two sides which the Pt touches.
   * @param poly a Group or an Iterable<Pt>
   * @param index the target Pt
   * @param closePath a boolean to specify whether the polygon should be closed (ie, whether the final segment should be counted).
   */
  static adjacentSides(poly, index, closePath = false) {
    let _pts = Util.iterToArray(poly);
    if (_pts.length < 2)
      return _errorLength(new Group(), 2);
    if (index < 0 || index >= _pts.length)
      return _errorOutofBound(new Group(), index);
    let gs = [];
    let left = index - 1;
    if (closePath && left < 0)
      left = _pts.length - 1;
    if (left >= 0)
      gs.push(new Group(_pts[index], _pts[left]));
    let right = index + 1;
    if (closePath && right > _pts.length - 1)
      right = 0;
    if (right <= _pts.length - 1)
      gs.push(new Group(_pts[index], _pts[right]));
    return gs;
  }
  /**
   * Get a bisector which is a line that split between two sides of a polygon equally. 
   * @param poly a Group or an Iterable<Pt>
   * @param index the Pt in the polygon to bisect from
   * @param closePath a boolean to specify whether the polygon should be closed (ie, whether the final segment should be counted).
   * @returns a bisector Pt that's a normalized unit vector
   */
  static bisector(poly, index) {
    let sides = _Polygon.adjacentSides(poly, index, true);
    if (sides.length >= 2) {
      let a = sides[0][1].$subtract(sides[0][0]).unit();
      let b = sides[1][1].$subtract(sides[1][0]).unit();
      return a.add(b).divide(2);
    } else {
      return void 0;
    }
  }
  /**
   * Find the perimeter of this polygon, ie, the lengths of its sides.
   * @param poly a Group or an Iterable<Pt>
   * @param closePath a boolean to specify whether the polygon should be closed (ie, whether the final segment should be counted).
   * @returns an object with `total` length, and `segments` which is a Pt that stores each segment's length
   */
  static perimeter(poly, closePath = false) {
    let lines = _Polygon.lines(poly, closePath);
    let mag = 0;
    let p = Pt.make(lines.length, 0);
    for (let i = 0, len = lines.length; i < len; i++) {
      let m = Line.magnitude(lines[i]);
      mag += m;
      p[i] = m;
    }
    return {
      total: mag,
      segments: p
    };
  }
  /**
   * Find the area of a *convex* polygon.
   * @param pts a Group or an Iterable<PtLike> representing a polygon
   */
  static area(pts) {
    let _pts = Util.iterToArray(pts);
    if (_pts.length < 3)
      return _errorLength(new Group(), 3);
    let det = (a, b) => a[0] * b[1] - a[1] * b[0];
    let area = 0;
    for (let i = 0, len = _pts.length; i < len; i++) {
      if (i < _pts.length - 1) {
        area += det(_pts[i], _pts[i + 1]);
      } else {
        area += det(_pts[i], _pts[0]);
      }
    }
    return Math.abs(area / 2);
  }
  /**
   * Get a convex hull of a set of points, using Melkman's algorithm. ([Reference](http://geomalgorithms.com/a12-_hull-3.html)).
   * @param pts a Group or an Iterable<PtLike>
   * @param sorted a boolean value to indicate if the group is pre-sorted by x position. Default is false.
   * @returns a group of Pt that defines the convex hull polygon
   */
  static convexHull(pts, sorted = false) {
    let _pts = Util.iterToArray(pts);
    if (_pts.length < 3)
      return _errorLength(new Group(), 3);
    if (!sorted) {
      _pts = _pts.slice();
      _pts.sort((a, b) => a[0] - b[0]);
    }
    let left = (a, b, c) => {
      return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]) > 0;
    };
    let dq = [];
    let bot = _pts.length - 2;
    let top = bot + 3;
    dq[bot] = _pts[2];
    dq[top] = _pts[2];
    if (left(_pts[0], _pts[1], _pts[2])) {
      dq[bot + 1] = _pts[0];
      dq[bot + 2] = _pts[1];
    } else {
      dq[bot + 1] = _pts[1];
      dq[bot + 2] = _pts[0];
    }
    for (let i = 3, len = _pts.length; i < len; i++) {
      let pt = _pts[i];
      if (left(dq[bot], dq[bot + 1], pt) && left(dq[top - 1], dq[top], pt)) {
        continue;
      }
      while (!left(dq[bot], dq[bot + 1], pt)) {
        bot += 1;
      }
      bot -= 1;
      dq[bot] = pt;
      while (!left(dq[top - 1], dq[top], pt)) {
        top -= 1;
      }
      top += 1;
      dq[top] = pt;
    }
    let hull = new Group();
    for (let h = 0; h < top - bot; h++) {
      hull.push(dq[bot + h]);
    }
    return hull;
  }
  /**
   * Given a point in the polygon as an origin, get an array of lines that connect all the remaining points to the origin point.
   * @param poly a Group or an Iterable<Pt> representing a polygon
   * @param originIndex the origin point's index in the polygon
   * @returns an array of Groups of line segments
   */
  static network(poly, originIndex = 0) {
    let _pts = Util.iterToArray(poly);
    let g = [];
    for (let i = 0, len = _pts.length; i < len; i++) {
      if (i != originIndex)
        g.push(new Group(_pts[originIndex], _pts[i]));
    }
    return g;
  }
  /**
   * Given a target Pt, find a Pt in the polygon's corners that's nearest to it.
   * @param poly a Group or an Iterable<Pt>
   * @param pt Pt to check
   * @returns an index in the pts indicating the nearest Pt, or -1 if none found
   */
  static nearestPt(poly, pt) {
    let _near = Number.MAX_VALUE;
    let _item = -1;
    let i = 0;
    for (let p of poly) {
      let d = p.$subtract(pt).magnitudeSq();
      if (d < _near) {
        _near = d;
        _item = i;
      }
      i++;
    }
    return _item;
  }
  /**
   * Project axis (eg, for use in Separation Axis Theorem).
   * @param poly a Group or an Iterable<Pt>
   * @param unitAxis unit axis for calculating dot product
   */
  static projectAxis(poly, unitAxis) {
    let _poly = Util.iterToArray(poly);
    let dot = unitAxis.dot(_poly[0]);
    let d = new Pt(dot, dot);
    for (let n = 1, len = _poly.length; n < len; n++) {
      dot = unitAxis.dot(_poly[n]);
      d = new Pt(Math.min(dot, d[0]), Math.max(dot, d[1]));
    }
    return d;
  }
  /**
   * Check overlap distance from projected axis.
   * @param poly1 a Group or an Iterable<Pt> representing the first polygon
   * @param poly2 a Group or an Iterable<Pt> representing the second polygon
   * @param unitAxis unit axis
   */
  static _axisOverlap(poly1, poly2, unitAxis) {
    let pa = _Polygon.projectAxis(poly1, unitAxis);
    let pb = _Polygon.projectAxis(poly2, unitAxis);
    return pa[0] < pb[0] ? pb[0] - pa[1] : pa[0] - pb[1];
  }
  /**
   * Check if a Pt is inside a convex polygon.
   * @param poly a Group or an Iterable<PtLike> representing a convex polygon
   * @param pt the Pt to check
   */
  static hasIntersectPoint(poly, pt) {
    let _poly = Util.iterToArray(poly);
    let c = false;
    for (let i = 0, len = _poly.length; i < len; i++) {
      let ln = _Polygon.lineAt(_poly, i);
      if (ln[0][1] > pt[1] != ln[1][1] > pt[1] && pt[0] < (ln[1][0] - ln[0][0]) * (pt[1] - ln[0][1]) / (ln[1][1] - ln[0][1]) + ln[0][0]) {
        c = !c;
      }
    }
    return c;
  }
  /**
   * Check if a convex polygon and a circle has intersections using Separating Axis Theorem. 
   * @param poly a Group or an Iterable<Pt> representing a convex polygon
   * @param circle a Group or an Iterable<Pt> representing a circle
   * @returns an `IntersectContext` object that stores the intersection info, or undefined if there's no intersection
   */
  static hasIntersectCircle(poly, circle) {
    let _poly = Util.iterToArray(poly);
    let _circle = Util.iterToArray(circle);
    let info = {
      which: -1,
      // 0 if vertex is on second polygon and edge is on first polygon. 1 if the other way round.
      dist: 0,
      normal: null,
      // perpendicular to edge
      edge: null,
      // the edge where the intersection occur
      vertex: null
      // the vertex on a polygon that has intersected
    };
    let c = _circle[0];
    let r = _circle[1][0];
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let i = 0, len = _poly.length; i < len; i++) {
      let edge = _Polygon.lineAt(_poly, i);
      let axis = new Pt(edge[0].y - edge[1].y, edge[1].x - edge[0].x).unit();
      let poly2 = new Group(c.$add(axis.$multiply(r)), c.$subtract(axis.$multiply(r)));
      let dist = _Polygon._axisOverlap(_poly, poly2, axis);
      if (dist > 0) {
        return null;
      } else if (Math.abs(dist) < minDist) {
        let check = Rectangle.withinBound(edge, Line.perpendicularFromPt(edge, c)) || Circle.intersectLine2D(circle, edge).length > 0;
        if (check) {
          info.edge = edge;
          info.normal = axis;
          minDist = Math.abs(dist);
          info.which = i;
        }
      }
    }
    if (!info.edge)
      return null;
    let dir = c.$subtract(_Polygon.centroid(_poly)).dot(info.normal);
    if (dir < 0)
      info.normal.multiply(-1);
    info.dist = minDist;
    info.vertex = c;
    return info;
  }
  /**
   * Check if two convex polygons have intersections using Separating Axis Theorem. 
   * @param poly1 a Group or an Iterable<Pt> representing a convex polygon
   * @param poly2 a Group or an Iterable<Pt> representing another convex polygon
   * @return an `IntersectContext` object that stores the intersection info, or undefined if there's no intersection
   */
  static hasIntersectPolygon(poly1, poly2) {
    let _poly1 = Util.iterToArray(poly1);
    let _poly2 = Util.iterToArray(poly2);
    let info = {
      which: -1,
      // 0 if vertex is on second polygon and edge is on first polygon. 1 if the other way round.
      dist: 0,
      normal: new Pt(),
      // perpendicular to edge
      edge: new Group(),
      // the edge where the intersection occur
      vertex: new Pt()
      // the vertex on a polygon that has intersected
    };
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let i = 0, plen = _poly1.length + _poly2.length; i < plen; i++) {
      let edge = i < _poly1.length ? _Polygon.lineAt(_poly1, i) : _Polygon.lineAt(_poly2, i - _poly1.length);
      let axis = new Pt(edge[0].y - edge[1].y, edge[1].x - edge[0].x).unit();
      let dist = _Polygon._axisOverlap(_poly1, _poly2, axis);
      if (dist > 0) {
        return null;
      } else if (Math.abs(dist) < minDist) {
        info.edge = edge;
        info.normal = axis;
        minDist = Math.abs(dist);
        info.which = i < _poly1.length ? 0 : 1;
      }
    }
    info.dist = minDist;
    let b1 = info.which === 0 ? _poly2 : _poly1;
    let b2 = info.which === 0 ? _poly1 : _poly2;
    let c1 = _Polygon.centroid(b1);
    let c2 = _Polygon.centroid(b2);
    let dir = c1.$subtract(c2).dot(info.normal);
    if (dir < 0)
      info.normal.multiply(-1);
    let smallest = Number.MAX_SAFE_INTEGER;
    for (let i = 0, len = b1.length; i < len; i++) {
      let d = info.normal.dot(b1[i].$subtract(c2));
      if (d < smallest) {
        smallest = d;
        info.vertex = b1[i];
      }
    }
    return info;
  }
  /**
   * Find intersection points of 2 polygons by checking every side of both polygons. Performance may be slow for complex polygons.
   * @param poly1 a Group or an Iterable<Pt> representing a polygon 
   * @param poly2 a Group or an Iterable<Pt> representing another polygon
   */
  static intersectPolygon2D(poly1, poly2) {
    let _poly1 = Util.iterToArray(poly1);
    let _poly2 = Util.iterToArray(poly2);
    let lp = _Polygon.lines(_poly1);
    let g = [];
    for (let i = 0, len = lp.length; i < len; i++) {
      let ins = Line.intersectPolygon2D(lp[i], _poly2, false);
      if (ins)
        g.push(ins);
    }
    return Util.flatten(g, true);
  }
  /**
   * Get a bounding box for each polygon group, as well as a union bounding-box for all groups.
   * @param polys an Array/Iterable of (Groups or Iterables<Pt>)
   */
  static toRects(polys) {
    let boxes = [];
    for (let g of polys) {
      boxes.push(Geom.boundingBox(g));
    }
    let merged = Util.flatten(boxes, false);
    boxes.unshift(Geom.boundingBox(merged));
    return boxes;
  }
};
var Curve = class _Curve {
  /**
   * Get a precalculated coefficients per step. 
   * @param steps number of steps
   */
  static getSteps(steps) {
    let ts = new Group();
    for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      ts.push(new Pt(t * t * t, t * t, t, 1));
    }
    return ts;
  }
  /**
   * Given an index for the starting position in a Pt group, get the control and/or end points of a curve segment.
   * @param pts a Group or an Iterable<PtLike>
   * @param index start index in `pts` array. Default is 0.
   * @param copyStart an optional boolean value to indicate if the start index should be used twice. Default is false.
   * @returns a group of 4 Pts
   */
  static controlPoints(pts, index = 0, copyStart = false) {
    let _pts = Util.iterToArray(pts);
    if (index > _pts.length - 1)
      return new Group();
    let _index = (i) => i < _pts.length - 1 ? i : _pts.length - 1;
    let p0 = _pts[index];
    index = copyStart ? index : index + 1;
    return new Group(
      p0,
      _pts[_index(index++)],
      _pts[_index(index++)],
      _pts[_index(index++)]
    );
  }
  /**
   * Calulcate weighted sum to get the interpolated points.
   * @param ctrls anchors
   * @param params parameters
   */
  static _calcPt(ctrls, params) {
    let x = ctrls.reduce((a, c, i) => a + c.x * params[i], 0);
    let y = ctrls.reduce((a, c, i) => a + c.y * params[i], 0);
    if (ctrls[0].length > 2) {
      let z = ctrls.reduce((a, c, i) => a + c.z * params[i], 0);
      return new Pt(x, y, z);
    }
    return new Pt(x, y);
  }
  /**
   * Create a Catmull-Rom curve. Catmull-Rom is a kind of smooth-looking Cardinal curve.
   * @param pts a Group or an Iterable<PtLike>
   * @param steps the number of line segments per curve. Defaults to 10 steps
   * @returns a curve as a group of interpolated Pt
   */
  static catmullRom(pts, steps = 10) {
    let _pts = Util.iterToArray(pts);
    if (_pts.length < 2)
      return new Group();
    let ps = new Group();
    let ts = _Curve.getSteps(steps);
    let c = _Curve.controlPoints(_pts, 0, true);
    for (let i = 0; i <= steps; i++) {
      ps.push(_Curve.catmullRomStep(ts[i], c));
    }
    let k = 0;
    while (k < _pts.length - 2) {
      let cp = _Curve.controlPoints(_pts, k);
      if (cp.length > 0) {
        for (let i = 0; i <= steps; i++) {
          ps.push(_Curve.catmullRomStep(ts[i], cp));
        }
        k++;
      }
    }
    return ps;
  }
  /**
   * Interpolate to get a point on Catmull-Rom curve.
   * @param step the coefficients [t*t*t, t*t, t, 1]
   * @param ctrls a group of anchor Pts
   * @return an interpolated Pt on the curve
   */
  static catmullRomStep(step, ctrls) {
    let m = new Group(
      new Pt(-0.5, 1, -0.5, 0),
      new Pt(1.5, -2.5, 0, 1),
      new Pt(-1.5, 2, 0.5, 0),
      new Pt(0.5, -0.5, 0, 0)
    );
    return _Curve._calcPt(ctrls, Mat.multiply([step], m, true)[0]);
  }
  /**
   * Create a Cardinal curve.
   * @param pts a Group or an Iterable<PtLike>
   * @param steps the number of line segments per curve. Defaults to 10 steps.
   * @param tension optional value between 0 to 1 to specify a "tension". Default to 0.5 which is the tension for Catmull-Rom curve.
   * @returns a curve as a group of interpolated Pt
   */
  static cardinal(pts, steps = 10, tension = 0.5) {
    let _pts = Util.iterToArray(pts);
    if (_pts.length < 2)
      return new Group();
    let ps = new Group();
    let ts = _Curve.getSteps(steps);
    let c = _Curve.controlPoints(_pts, 0, true);
    for (let i = 0; i <= steps; i++) {
      ps.push(_Curve.cardinalStep(ts[i], c, tension));
    }
    let k = 0;
    while (k < _pts.length - 2) {
      let cp = _Curve.controlPoints(_pts, k);
      if (cp.length > 0) {
        for (let i = 0; i <= steps; i++) {
          ps.push(_Curve.cardinalStep(ts[i], cp, tension));
        }
        k++;
      }
    }
    return ps;
  }
  /**
   * Interpolate to get a point on Cardinal curve.
   * @param step the coefficients [t*t*t, t*t, t, 1]
   * @param ctrls a group of anchor Pts
   * @param tension optional value between 0 to 1 to specify a "tension". Default to 0.5 which is the tension for Catmull-Rom curve
   * @return an interpolated Pt on the curve
   */
  static cardinalStep(step, ctrls, tension = 0.5) {
    let m = new Group(
      new Pt(-1, 2, -1, 0),
      new Pt(-1, 1, 0, 0),
      new Pt(1, -2, 1, 0),
      new Pt(1, -1, 0, 0)
    );
    let h = Mat.multiply([step], m, true)[0].multiply(tension);
    let h2 = 2 * step[0] - 3 * step[1] + 1;
    let h3 = -2 * step[0] + 3 * step[1];
    let pt = _Curve._calcPt(ctrls, h);
    pt.x += h2 * ctrls[1].x + h3 * ctrls[2].x;
    pt.y += h2 * ctrls[1].y + h3 * ctrls[2].y;
    if (pt.length > 2)
      pt.z += h2 * ctrls[1].z + h3 * ctrls[2].z;
    return pt;
  }
  /**
   * Create a Bezier curve. In a cubic bezier curve, the first and 4th anchors are end-points, and 2nd and 3rd anchors are control-points.
   * @param pts a group of anchor Pt
   * @param steps the number of line segments per curve. Defaults to 10 steps.
   * @returns a curve as a group of interpolated Pt
   */
  static bezier(pts, steps = 10) {
    let _pts = Util.iterToArray(pts);
    if (_pts.length < 4)
      return new Group();
    let ps = new Group();
    let ts = _Curve.getSteps(steps);
    let k = 0;
    while (k < _pts.length - 3) {
      let c = _Curve.controlPoints(_pts, k);
      if (c.length > 0) {
        for (let i = 0; i <= steps; i++) {
          ps.push(_Curve.bezierStep(ts[i], c));
        }
        k += 3;
      }
    }
    return ps;
  }
  /**
   * Interpolate to get a point on a cubic Bezier curve.
   * @param step the coefficients [t*t*t, t*t, t, 1]
   * @param ctrls a group of anchor Pts
   * @return an interpolated Pt on the curve
   */
  static bezierStep(step, ctrls) {
    let m = new Group(
      new Pt(-1, 3, -3, 1),
      new Pt(3, -6, 3, 0),
      new Pt(-3, 3, 0, 0),
      new Pt(1, 0, 0, 0)
    );
    return _Curve._calcPt(ctrls, Mat.multiply([step], m, true)[0]);
  }
  /**
   * Create a basis spline (NURBS) curve.
   * @param pts a group of anchor Pt
   * @param steps the number of line segments per curve. Defaults to 10 steps.
   * @param tension optional value between 0 to n to specify a "tension". Default is 1 which is the usual tension.
   * @returns a curve as a group of interpolated Pt
   */
  static bspline(pts, steps = 10, tension = 1) {
    let _pts = Util.iterToArray(pts);
    if (_pts.length < 2)
      return new Group();
    let ps = new Group();
    let ts = _Curve.getSteps(steps);
    let k = 0;
    while (k < _pts.length - 3) {
      let c = _Curve.controlPoints(_pts, k);
      if (c.length > 0) {
        if (tension !== 1) {
          for (let i = 0; i <= steps; i++) {
            ps.push(_Curve.bsplineTensionStep(ts[i], c, tension));
          }
        } else {
          for (let i = 0; i <= steps; i++) {
            ps.push(_Curve.bsplineStep(ts[i], c));
          }
        }
        k++;
      }
    }
    return ps;
  }
  /**
   * Interpolate to get a point on a basis spline curve.
   * @param step the coefficients [t*t*t, t*t, t, 1]
   * @param ctrls a group of anchor Pts
   * @return an interpolated Pt on the curve
   */
  static bsplineStep(step, ctrls) {
    let m = new Group(
      new Pt(-0.16666666666666666, 0.5, -0.5, 0.16666666666666666),
      new Pt(0.5, -1, 0, 0.6666666666666666),
      new Pt(-0.5, 0.5, 0.5, 0.16666666666666666),
      new Pt(0.16666666666666666, 0, 0, 0)
    );
    return _Curve._calcPt(ctrls, Mat.multiply([step], m, true)[0]);
  }
  /**
   * Interpolate to get a point on a basis spline curve with tension.
   * @param step the coefficients [t*t*t, t*t, t, 1]
   * @param ctrls a group of anchor Pts
   * @param tension optional value between 0 to n to specify a "tension". Default to 1 which is the usual tension.
   * @return an interpolated Pt on the curve
   */
  static bsplineTensionStep(step, ctrls, tension = 1) {
    let m = new Group(
      new Pt(-0.16666666666666666, 0.5, -0.5, 0.16666666666666666),
      new Pt(-1.5, 2, 0, -0.3333333333333333),
      new Pt(1.5, -2.5, 0.5, 0.16666666666666666),
      new Pt(0.16666666666666666, 0, 0, 0)
    );
    let h = Mat.multiply([step], m, true)[0].multiply(tension);
    let h2 = 2 * step[0] - 3 * step[1] + 1;
    let h3 = -2 * step[0] + 3 * step[1];
    let pt = _Curve._calcPt(ctrls, h);
    pt.x += h2 * ctrls[1].x + h3 * ctrls[2].x;
    pt.y += h2 * ctrls[1].y + h3 * ctrls[2].y;
    if (pt.length > 2)
      pt.z += h2 * ctrls[1].z + h3 * ctrls[2].z;
    return pt;
  }
};

// src/uheprng.ts
function Mash() {
  let n = 4022871197;
  let mash = function(data) {
    if (data) {
      data = data.toString();
      for (let i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        let h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 4294967296;
      }
      return (n >>> 0) * 23283064365386963e-26;
    } else
      n = 4022871197;
  };
  return mash;
}
function uheprng_default(seed) {
  let o = 48;
  let c = 1;
  let p = o;
  let s = new Array(o);
  let i, j, k = 0;
  let mash = Mash();
  for (i = 0; i < o; i++)
    s[i] = mash(Math.random().toString());
  function initState() {
    mash();
    for (i = 0; i < o; i++)
      s[i] = mash(" ");
    c = 1;
    p = o;
  }
  function cleanString(inStr) {
    inStr = inStr.replace(/(^\s*)|(\s*$)/gi, "");
    inStr = inStr.replace(/[\x00-\x1F]/gi, "");
    inStr = inStr.replace(/\n /, "\n");
    return inStr;
  }
  function hashString(inStr) {
    inStr = cleanString(inStr);
    mash(inStr);
    for (i = 0; i < inStr.length; i++) {
      k = inStr.charCodeAt(i);
      for (j = 0; j < o; j++) {
        s[j] -= mash(k.toString());
        if (s[j] < 0)
          s[j] += 1;
      }
    }
  }
  initState();
  hashString(seed);
  return {
    /**
         * this (not anymore) PRIVATE (internal access only) function is the heart of the multiply-with-carry
         * (MWC) PRNG algorithm. When called it returns a pseudo-random number in the form of a
         * 32-bit JavaScript fraction (0.0 to <1.0) it is a PRIVATE function used by the default
         * [0-1] return function, and by the random 'string(n)' function which returns 'n'
         * characters from 33 to 126.
         * @returns a number between 0.0 and 1.0
         */
    random() {
      if (++p >= o)
        p = 0;
      let t = 1768863 * s[p] + c * 23283064365386963e-26;
      return s[p] = t - (c = t | 0);
    }
  };
}

// src/Num.ts
var Num = class _Num {
  /**
   * Check if two numbers are equal or almost equal within a threshold.
   * @param a number a
   * @param b number b
   * @param threshold threshold value that specifies the minimum difference within which the two numbers are considered equal
   */
  static equals(a, b, threshold = 1e-5) {
    return Math.abs(a - b) < threshold;
  }
  /**
   * Calculate linear interpolation between 2 values.
   * @param a start value
   * @param b end value
   * @param t an interpolation value, usually between 0 to 1
   */
  static lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
  /**
   * Clamp values between min and max.
   * @param val value to clamp
   * @param min min value
   * @param max max value
   */
  static clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }
  /**
   * Different from [`Num.clamp`](#link) in that the value out-of-bound will be "looped back" to the other end.
   * @param val value to bound
   * @param min min value
   * @param max max value
   * @example `boundValue(361, 0, 360)` will return 1
   */
  static boundValue(val, min, max) {
    const len = Math.abs(max - min);
    let a = val % len;
    if (a > max)
      a -= len;
    else if (a < min)
      a += len;
    return a;
  }
  /**
   * Check if a value is within two other values
   * @param p value to check
   * @param a first bounding value
   * @param b second bounding value
   */
  static within(p, a, b) {
    return p >= Math.min(a, b) && p <= Math.max(a, b);
  }
  /**
   * Get a random number within a range.
   * @param a range value 1
   * @param b range value 2
   */
  static randomRange(a, b = 0) {
    const r = a > b ? a - b : b - a;
    return a + _Num.random() * r;
  }
  /**
   * Get a random Pt within the range defined by either 1 or 2 Pt
   * @param a the range if only one Pt is used, or the start of the range if two Pt were used
   * @param b optional Pt to define the end of the range
   */
  static randomPt(a, b) {
    const p = new Pt(a.length);
    const range = b ? Vec.subtract(b.slice(), a) : a;
    const start = b ? a : new Pt(a.length).fill(0);
    for (let i = 0, len = p.length; i < len; i++) {
      p[i] = _Num.random() * range[i] + start[i];
    }
    return p;
  }
  /**
   * Normalize a value within a range.
   * @param n the value to normalize
   * @param a range value 1
   * @param b range value 1
   */
  static normalizeValue(n, a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return (n - min) / (max - min);
  }
  /**
   * Sum a group of numeric arrays.
   * @param pts a Group or an Iterable<PtLike>
   * @returns a Pt of the dimensional sums
   */
  static sum(pts) {
    const _pts = Util.iterToArray(pts);
    const c = new Pt(_pts[0]);
    for (let i = 1, len = _pts.length; i < len; i++) {
      Vec.add(c, _pts[i]);
    }
    return c;
  }
  /**
   * Average a group of numeric arrays
   * @param pts a Group or an Iterable<PtLike>
   * @returns a Pt of averages
   */
  static average(pts) {
    const _pts = Util.iterToArray(pts);
    return _Num.sum(_pts).divide(_pts.length);
  }
  /**
   * Given a value between 0 to 1, returns a value that cycles between 0 -> 1 -> 0 using the provided shaping method.
   * @param t a value between 0 to 1
   * @param method a shaping method. Default to [`Shaping.sineInOut`](#link).
   * @return a value between 0 to 1
   */
  static cycle(t, method = Shaping.sineInOut) {
    return method(t > 0.5 ? 2 - t * 2 : t * 2);
  }
  /**  
   * Map a value from one range to another.
   * @param n a value in the first range
   * @param currMin lower bound of the first range
   * @param currMax upper bound of the first range
   * @param targetMin lower bound of the second range
   * @param targetMax upper bound of the second range
   * @returns a remapped value in the second range
   */
  static mapToRange(n, currA, currB, targetA, targetB) {
    if (currA == currB)
      throw new Error("[currMin, currMax] must define a range that is not zero");
    const min = Math.min(targetA, targetB);
    const max = Math.max(targetA, targetB);
    return _Num.normalizeValue(n, currA, currB) * (max - min) + min;
  }
  /**
   * Seed the pseudorandom generator.
   * @param seed seed string
   */
  static seed(seed) {
    this.generator = uheprng_default(seed);
  }
  /**
   * Return a random number between 0 and 1 from a seed,
   * if the seed is not defined it uses Math.random
   * @returns a number between 0 and 1
   */
  static random() {
    return this.generator ? this.generator.random() : Math.random();
  }
};
var Geom = class _Geom {
  /**
   * Bound an angle between 0 to 360 degrees.
   * @param angle angle value
   */
  static boundAngle(angle) {
    return Num.boundValue(angle, 0, 360);
  }
  /**
   * Bound a radian between 0 to two PI.
   * @param radian radian value
   */
  static boundRadian(radian) {
    return Num.boundValue(radian, 0, Const.two_pi);
  }
  /**
   * Convert an angle in degree to radian.
   * @param angle angle value
   */
  static toRadian(angle) {
    return angle * Const.deg_to_rad;
  }
  /**
   * Convert an angle in radian to degree.
   * @param radian radian value
   */
  static toDegree(radian) {
    return radian * Const.rad_to_deg;
  }
  /**
   * Get a bounding box for a set of Pts.
   * @param pts a Group or an Iterable<Pt>
   * @return a Group of two Pts, representing the top-left and bottom-right corners
   */
  static boundingBox(pts) {
    let minPt, maxPt;
    for (const p of pts) {
      if (minPt == void 0) {
        minPt = p.clone();
        maxPt = p.clone();
      } else {
        minPt = minPt.$min(p);
        maxPt = maxPt.$max(p);
      }
    }
    return new Group(minPt, maxPt);
  }
  /**
   * Get a centroid (the average middle point) for a set of Pts.
   * @param pts a Group or an Iterable<PtLike> 
   * @return a centroid Pt 
   */
  static centroid(pts) {
    return Num.average(pts);
  }
  /**
   * Given an anchor Pt, rebase all Pts in this group either to or from this anchor base.
   * @param pts a Group or an Iterable<PtLike> 
   * @param ptOrIndex an index for the Pt array, or an external Pt
   * @param direction a string either "to" (subtract all Pt with this anchor base), or "from" (add all Pt from this anchor base)
   */
  static anchor(pts, ptOrIndex = 0, direction = "to") {
    const method = direction == "to" ? "subtract" : "add";
    let i = 0;
    for (const p of pts) {
      if (typeof ptOrIndex == "number") {
        if (ptOrIndex !== i)
          p[method](pts[ptOrIndex]);
      } else {
        p[method](ptOrIndex);
      }
      i++;
    }
  }
  /**
   * Get an interpolated (or extrapolated) value between two Pts. For linear interpolation between 2 scalar values, use [`Num.lerp`](#link).
   * @param a first Pt
   * @param b second Pt
   * @param t a value between 0 to 1 to interpolate, or any other value to extrapolate
   * @returns interpolated point as a new Pt
   */
  static interpolate(a, b, t = 0.5) {
    const len = Math.min(a.length, b.length);
    const d = Pt.make(len);
    for (let i = 0; i < len; i++) {
      d[i] = a[i] * (1 - t) + b[i] * t;
    }
    return d;
  }
  /**
   * Find two Pts that are perpendicular to this Pt (2D only).
   * @param axis a string such as "xy" (use Const.xy) or an array to specify index for two dimensions
   * @returns an array of two Pt that are perpendicular to this Pt
   */
  static perpendicular(pt, axis = Const.xy) {
    const y = axis[1];
    const x = axis[0];
    const p = new Pt(pt);
    const pa = new Pt(p);
    pa[x] = -p[y];
    pa[y] = p[x];
    const pb = new Pt(p);
    pb[x] = p[y];
    pb[y] = -p[x];
    return new Group(pa, pb);
  }
  /**
   * Check if two Pts are perpendicular to each other (2D only).
   */
  static isPerpendicular(p1, p2) {
    return new Pt(p1).dot(p2) === 0;
  }
  /**
   * Check if a Pt is within the rectangular boundary defined by two Pts.
   * @param pt the Pt to check
   * @param boundPt1 boundary Pt 1
   * @param boundPt2 boundary Pt 2
   */
  static withinBound(pt, boundPt1, boundPt2) {
    for (let i = 0, len = Math.min(pt.length, boundPt1.length, boundPt2.length); i < len; i++) {
      if (!Num.within(pt[i], boundPt1[i], boundPt2[i]))
        return false;
    }
    return true;
  }
  /**
   * Sort the Pts so that their edges will form a non-overlapping polygon. ([Reference](https://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order))
   * @param pts a Group or an Iterable<Pt>
   */
  static sortEdges(pts) {
    const _pts = Util.iterToArray(pts);
    const bounds = _Geom.boundingBox(_pts);
    const center = bounds[1].add(bounds[0]).divide(2);
    const fn = (a, b) => {
      if (a.length < 2 || b.length < 2)
        throw new Error("Pt dimension cannot be less than 2");
      const da = a.$subtract(center);
      const db = b.$subtract(center);
      if (da[0] >= 0 && db[0] < 0)
        return 1;
      if (da[0] < 0 && db[0] >= 0)
        return -1;
      if (da[0] == 0 && db[0] == 0) {
        if (da[1] >= 0 || db[1] >= 0)
          return da[1] > db[1] ? 1 : -1;
        return db[1] > da[1] ? 1 : -1;
      }
      const det = da.$cross2D(db);
      if (det < 0)
        return 1;
      if (det > 0)
        return -1;
      return da[0] * da[0] + da[1] * da[1] > db[0] * db[0] + db[1] * db[1] ? 1 : -1;
    };
    return _pts.sort(fn);
  }
  /**
   * Scale a Pt or a Group of Pts. You may also use [`Pt.scale`](#link) instance method.
   * @param ps either a single Pt, or a Group or an Iterable<Pt>
   * @param scale scale value
   * @param anchor optional anchor point to scale from
   */
  static scale(ps, scale, anchor) {
    const pts = Util.iterToArray(ps[0] !== void 0 && typeof ps[0] == "number" ? [ps] : ps);
    const scs = typeof scale == "number" ? Pt.make(pts[0].length, scale) : scale;
    if (!anchor)
      anchor = Pt.make(pts[0].length, 0);
    for (let i = 0, len = pts.length; i < len; i++) {
      const p = pts[i];
      for (let k = 0, lenP = p.length; k < lenP; k++) {
        p[k] = anchor && anchor[k] ? anchor[k] + (p[k] - anchor[k]) * scs[k] : p[k] * scs[k];
      }
    }
    return _Geom;
  }
  /**
   * Rotate a Pt or a Group of Pts in 2D space. You may also use [`Pt.rotate2D`](#link) instance method.
   * @param ps either a single Pt, or a Group or an Iterable<Pt>
   * @param angle rotate angle
   * @param anchor optional anchor point to rotate from
   * @param axis optional axis such as "xy" (use Const.xy) to define a 2D plane, or a number array to specify indices
   */
  static rotate2D(ps, angle, anchor, axis) {
    const pts = Util.iterToArray(ps[0] !== void 0 && typeof ps[0] == "number" ? [ps] : ps);
    const fn = anchor ? Mat.rotateAt2DMatrix : Mat.rotate2DMatrix;
    if (!anchor)
      anchor = Pt.make(pts[0].length, 0);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    for (let i = 0, len = pts.length; i < len; i++) {
      const p = axis ? pts[i].$take(axis) : pts[i];
      p.to(Mat.transform2D(p, fn(cos, sin, anchor)));
      if (axis) {
        for (let k = 0; k < axis.length; k++) {
          pts[i][axis[k]] = p[k];
        }
      }
    }
    return _Geom;
  }
  /**
   * Shear a Pt or a Group of Pts in 2D space. You may also use [`Pt.shear2D`](#link) instance method.
   * @param ps either a single Pt, or a Group or an Iterable<Pt>
   * @param scale shearing value which can be a number or an array of 2 numbers
   * @param anchor optional anchor point to shear from
   * @param axis optional axis such as "xy" (use Const.xy) to define a 2D plane, or a number array to specify indices
   */
  static shear2D(ps, scale, anchor, axis) {
    const pts = Util.iterToArray(ps[0] !== void 0 && typeof ps[0] == "number" ? [ps] : ps);
    const s = typeof scale == "number" ? [scale, scale] : scale;
    if (!anchor)
      anchor = Pt.make(pts[0].length, 0);
    const fn = anchor ? Mat.shearAt2DMatrix : Mat.shear2DMatrix;
    const tanx = Math.tan(s[0]);
    const tany = Math.tan(s[1]);
    for (let i = 0, len = pts.length; i < len; i++) {
      const p = axis ? pts[i].$take(axis) : pts[i];
      p.to(Mat.transform2D(p, fn(tanx, tany, anchor)));
      if (axis) {
        for (let k = 0; k < axis.length; k++) {
          pts[i][axis[k]] = p[k];
        }
      }
    }
    return _Geom;
  }
  /**
   * Reflect a Pt or a Group of Pts along a 2D line. You may also use [`Pt.reflect2D`](#link) instance method.
   * @param ps either a single Pt, or a Group or an Iterable<Pt>
   * @param line a Group or an Iterable<PtLike> that defines a line for reflection
   * @param axis optional axis such as "xy" (use Const.xy) to define a 2D plane, or a number array to specify indices
   */
  static reflect2D(ps, line, axis) {
    const pts = Util.iterToArray(ps[0] !== void 0 && typeof ps[0] == "number" ? [ps] : ps);
    const _line = Util.iterToArray(line);
    const mat = Mat.reflectAt2DMatrix(_line[0], _line[1]);
    for (let i = 0, len = pts.length; i < len; i++) {
      const p = axis ? pts[i].$take(axis) : pts[i];
      p.to(Mat.transform2D(p, mat));
      if (axis) {
        for (let k = 0; k < axis.length; k++) {
          pts[i][axis[k]] = p[k];
        }
      }
    }
    return _Geom;
  }
  /**
   * Generate a cosine lookup table.
   * @returns an object with a cosine tables (array of 360 values) and a function to get cosine given a radian input. 
   */
  static cosTable() {
    const cos = new Float64Array(360);
    for (let i = 0; i < 360; i++)
      cos[i] = Math.cos(i * Math.PI / 180);
    const find = (rad) => cos[Math.floor(_Geom.boundAngle(_Geom.toDegree(rad)))];
    return { table: cos, cos: find };
  }
  /**
   * Generate a sine lookup table.
   * @returns an object with a sine tables (array of 360 values) and a function to get sine value given a radian input. 
   */
  static sinTable() {
    const sin = new Float64Array(360);
    for (let i = 0; i < 360; i++)
      sin[i] = Math.sin(i * Math.PI / 180);
    const find = (rad) => sin[Math.floor(_Geom.boundAngle(_Geom.toDegree(rad)))];
    return { table: sin, sin: find };
  }
};
var Shaping = class _Shaping {
  /**
   * Linear mapping.
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static linear(t, c = 1) {
    return c * t;
  }
  /** 
   * Quadratic in, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
  */
  static quadraticIn(t, c = 1) {
    return c * t * t;
  }
  /** 
   * Quadratic out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
  */
  static quadraticOut(t, c = 1) {
    return -c * t * (t - 2);
  }
  /** 
   * Quadratic in-out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static quadraticInOut(t, c = 1) {
    const dt = t * 2;
    return t < 0.5 ? c / 2 * t * t * 4 : -c / 2 * ((dt - 1) * (dt - 3) - 1);
  }
  /** 
   * Cubic in, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static cubicIn(t, c = 1) {
    return c * t * t * t;
  }
  /** 
   * Cubic out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static cubicOut(t, c = 1) {
    const dt = t - 1;
    return c * (dt * dt * dt + 1);
  }
  /** 
   * Cubic in-out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static cubicInOut(t, c = 1) {
    const dt = t * 2;
    return t < 0.5 ? c / 2 * dt * dt * dt : c / 2 * ((dt - 2) * (dt - 2) * (dt - 2) + 2);
  }
  /** 
   * Exponential ease in, adapted from Golan Levin's [polynomial shapers](http://www.flong.com/texts/code/shapers_poly/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p a value between 0 to 1 to control the curve. Default is 0.25.
   */
  static exponentialIn(t, c = 1, p = 0.25) {
    return c * Math.pow(t, 1 / p);
  }
  /** 
   * Exponential ease out, adapted from Golan Levin's [polynomial shapers](http://www.flong.com/texts/code/shapers_poly/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p a value between 0 to 1 to control the curve. Default is 0.25.
   */
  static exponentialOut(t, c = 1, p = 0.25) {
    return c * Math.pow(t, p);
  }
  /** 
   * Sinuous in, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static sineIn(t, c = 1) {
    return -c * Math.cos(t * Const.half_pi) + c;
  }
  /** 
   * Sinuous out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static sineOut(t, c = 1) {
    return c * Math.sin(t * Const.half_pi);
  }
  /** 
   * Sinuous in-out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static sineInOut(t, c = 1) {
    return -c / 2 * (Math.cos(Math.PI * t) - 1);
  }
  /** 
   * A faster way to approximate cosine ease in-out using Blinn-Wyvill Approximation. Adapated from Golan Levin's [polynomial shaping](http://www.flong.com/texts/code/shapers_poly/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static cosineApprox(t, c = 1) {
    const t2 = t * t;
    const t4 = t2 * t2;
    const t6 = t4 * t2;
    return c * (4 * t6 / 9 - 17 * t4 / 9 + 22 * t2 / 9);
  }
  /** 
   * Circular in, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static circularIn(t, c = 1) {
    return -c * (Math.sqrt(1 - t * t) - 1);
  }
  /** 
   * Circular out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static circularOut(t, c = 1) {
    const dt = t - 1;
    return c * Math.sqrt(1 - dt * dt);
  }
  /** 
   * Circular in-out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static circularInOut(t, c = 1) {
    const dt = t * 2;
    return t < 0.5 ? -c / 2 * (Math.sqrt(1 - dt * dt) - 1) : c / 2 * (Math.sqrt(1 - (dt - 2) * (dt - 2)) + 1);
  }
  /** 
   * Elastic in, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p elastic parmeter between 0 to 1. The lower the number, the more elastic it will be. Default is 0.7.
   */
  static elasticIn(t, c = 1, p = 0.7) {
    const dt = t - 1;
    const s = p / Const.two_pi * 1.5707963267948966;
    return c * (-Math.pow(2, 10 * dt) * Math.sin((dt - s) * Const.two_pi / p));
  }
  /** 
   * Elastic out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p elastic parmeter between 0 to 1. The lower the number, the more elastic it will be. Default is 0.7.
   */
  static elasticOut(t, c = 1, p = 0.7) {
    const s = p / Const.two_pi * 1.5707963267948966;
    return c * (Math.pow(2, -10 * t) * Math.sin((t - s) * Const.two_pi / p)) + c;
  }
  /** 
   * Elastic in-out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p elastic parmeter between 0 to 1. The lower the number, the more elastic it will be. Default is 0.6.
   */
  static elasticInOut(t, c = 1, p = 0.6) {
    let dt = t * 2;
    const s = p / Const.two_pi * 1.5707963267948966;
    if (t < 0.5) {
      dt -= 1;
      return c * (-0.5 * (Math.pow(2, 10 * dt) * Math.sin((dt - s) * Const.two_pi / p)));
    } else {
      dt -= 1;
      return c * (0.5 * (Math.pow(2, -10 * dt) * Math.sin((dt - s) * Const.two_pi / p))) + c;
    }
  }
  /** 
   * Bounce in, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static bounceIn(t, c = 1) {
    return c - _Shaping.bounceOut(1 - t, c);
  }
  /** 
   * Bounce out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static bounceOut(t, c = 1) {
    if (t < 1 / 2.75) {
      return c * (7.5625 * t * t);
    } else if (t < 2 / 2.75) {
      t -= 1.5 / 2.75;
      return c * (7.5625 * t * t + 0.75);
    } else if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75;
      return c * (7.5625 * t * t + 0.9375);
    } else {
      t -= 2.625 / 2.75;
      return c * (7.5625 * t * t + 0.984375);
    }
  }
  /** 
   * Bounce in-out, adapted from Robert Penner's [easing functions](http://robertpenner.com/easing/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   */
  static bounceInOut(t, c = 1) {
    return t < 0.5 ? _Shaping.bounceIn(t * 2, c) / 2 : _Shaping.bounceOut(t * 2 - 1, c) / 2 + c / 2;
  }
  /** 
   * Sigmoid curve changes its shape adapted from the input value, but always returns a value between 0 to 1.
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p the larger the value, the "steeper" the curve will be. Default is 10.
   */
  static sigmoid(t, c = 1, p = 10) {
    const d = p * (t - 0.5);
    return c / (1 + Math.exp(-d));
  }
  /** 
   * Logistic sigmoid, adapted from Golan Levin's [shaping function](http://www.flong.com/texts/code/shapers_exp/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p a parameter between 0 to 1 to control the steepness of the curve. Higher is steeper. Default is 0.7.
   */
  static logSigmoid(t, c = 1, p = 0.7) {
    p = Math.max(Const.epsilon, Math.min(1 - Const.epsilon, p));
    p = 1 / (1 - p);
    const A = 1 / (1 + Math.exp((t - 0.5) * p * -2));
    const B = 1 / (1 + Math.exp(p));
    const C = 1 / (1 + Math.exp(-p));
    return c * (A - B) / (C - B);
  }
  /** 
   * Exponential seat curve, adapted from Golan Levin's [shaping functions](http://www.flong.com/texts/code/shapers_exp/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p a parameter between 0 to 1 to control the steepness of the curve. Higher is steeper. Default is 0.5.
   */
  static seat(t, c = 1, p = 0.5) {
    if (t < 0.5) {
      return c * Math.pow(2 * t, 1 - p) / 2;
    } else {
      return c * (1 - Math.pow(2 * (1 - t), 1 - p) / 2);
    }
  }
  /** 
   * Quadratic bezier curve, adapted from Golan Levin's [shaping functions](http://www.flong.com/texts/code/shapers_exp/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p1 a Pt object specifying the first control Pt, or a value specifying the control Pt's x position (its y position will default to 0.5). Default is `Pt(0.95, 0.95)
   */
  static quadraticBezier(t, c = 1, p = [0.05, 0.95]) {
    const a = typeof p != "number" ? p[0] : p;
    const b = typeof p != "number" ? p[1] : 0.5;
    let om2a = 1 - 2 * a;
    if (om2a === 0) {
      om2a = Const.epsilon;
    }
    const d = (Math.sqrt(a * a + om2a * t) - a) / om2a;
    return c * ((1 - 2 * b) * (d * d) + 2 * b * d);
  }
  /** 
   * Cubic bezier curve. This reuses the bezier functions in Curve class.
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p1` a Pt object specifying the first control Pt. Default is `Pt(0.1, 0.7).
   * @param p2` a Pt object specifying the second control Pt. Default is `Pt(0.9, 0.2).
   */
  static cubicBezier(t, c = 1, p1 = [0.1, 0.7], p2 = [0.9, 0.2]) {
    const curve = new Group(new Pt(0, 0), new Pt(p1), new Pt(p2), new Pt(1, 1));
    return c * Curve.bezierStep(new Pt(t * t * t, t * t, t, 1), Curve.controlPoints(curve)).y;
  }
  /** 
   * Give a Pt, draw a quadratic curve that will pass through that Pt as closely as possible. Adapted from Golan Levin's [shaping functions](http://www.flong.com/texts/code/shapers_poly/).
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p1` a Pt object specifying the Pt to pass through. Default is `Pt(0.2, 0.35)
   */
  static quadraticTarget(t, c = 1, p1 = [0.2, 0.35]) {
    const a = Math.min(1 - Const.epsilon, Math.max(Const.epsilon, p1[0]));
    const b = Math.min(1, Math.max(0, p1[1]));
    const A = (1 - b) / (1 - a) - b / a;
    const B = (A * (a * a) - b) / a;
    const y = A * (t * t) - B * t;
    return c * Math.min(1, Math.max(0, y));
  }
  /** 
   * Step function is a simple jump from 0 to 1 at a specific Pt in time.
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param p usually a value between 0 to 1, which specify the Pt to "jump". Default is 0.5 which is in the middle.
   */
  static cliff(t, c = 1, p = 0.5) {
    return t > p ? c : 0;
  }
  /** 
   * Convert any shaping functions into a series of steps.
   * @param fn the original shaping function
   * @param steps the number of steps
   * @param t a value between 0 to 1
   * @param c the value to shape, default is 1
   * @param args optional paramters to pass to original function
   */
  static step(fn, steps, t, c, ...args) {
    const s = 1 / steps;
    const tt = Math.floor(t / s) * s;
    return fn(tt, c, ...args);
  }
};
var Range = class {
  /**
   * Construct a Range instance for a Group of Pts.
   * @param g a Group or an Iterable<Pt>
   */
  constructor(g) {
    this._dims = 0;
    this._source = Group.fromPtArray(g);
    this.calc();
  }
  /**
   * Get this Range's maximum values per dimension.
   */
  get max() {
    return this._max.clone();
  }
  /**
   * Get this Range's minimum values per dimension.
   */
  get min() {
    return this._min.clone();
  }
  /**
   * Get this Range's magnitude in each dimension.
   */
  get magnitude() {
    return this._mag.clone();
  }
  /**
   * Go through the group and find its min and max values. Usually you don't need to call this function directly.
   */
  calc() {
    if (!this._source)
      return;
    const dims = this._source[0].length;
    this._dims = dims;
    const max = new Pt(dims);
    const min = new Pt(dims);
    const mag = new Pt(dims);
    for (let i = 0; i < dims; i++) {
      max[i] = Const.min;
      min[i] = Const.max;
      mag[i] = 0;
      const s = this._source.zipSlice(i);
      for (let k = 0, len = s.length; k < len; k++) {
        max[i] = Math.max(max[i], s[k]);
        min[i] = Math.min(min[i], s[k]);
        mag[i] = max[i] - min[i];
      }
    }
    this._max = max;
    this._min = min;
    this._mag = mag;
    return this;
  }
  /**
   * Map this Range to another range of values.
   * @param min target range's minimum value
   * @param max target range's maximum value
   * @param exclude Optional boolean array where `true` means excluding the conversion in that specific dimension.
   */
  mapTo(min, max, exclude) {
    const target = new Group();
    for (let i = 0, len = this._source.length; i < len; i++) {
      const g = this._source[i];
      const n = new Pt(this._dims);
      for (let k = 0; k < this._dims; k++) {
        n[k] = exclude && exclude[k] ? g[k] : Num.mapToRange(g[k], this._min[k], this._max[k], min, max);
      }
      target.push(n);
    }
    return target;
  }
  /**
   * Add more Pts to this Range and recalculate its min and max values.
   * @param pts a Group or an Iterable<PtLike> to append to this Range
   * @param update Optional. Set the parameter to `false` if you want to append without immediately updating this Range's min and max values. Default is `true`.
   */
  append(pts, update = true) {
    const _pts = Util.iterToArray(pts);
    if (_pts[0].length !== this._dims)
      throw new Error(`Dimensions don't match. ${this._dims} dimensions in Range and ${_pts[0].length} provided in parameter. `);
    this._source = this._source.concat(_pts);
    if (update)
      this.calc();
    return this;
  }
  /**
   * Create a number of evenly spaced "ticks" that span this Range's min and max value.
   * @param count number of subdivision. For example, 10 subdivision will return 11 tick values, which include first(min) and last(max) values.
   */
  ticks(count) {
    const g = new Group();
    for (let i = 0; i <= count; i++) {
      const p = new Pt(this._dims);
      for (let k = 0, len = this._max.length; k < len; k++) {
        p[k] = Num.lerp(this._min[k], this._max[k], i / count);
      }
      g.push(p);
    }
    return g;
  }
};

// src/Util.ts
var Const = {
  /** A string to indicate xy plane. */
  xy: "xy",
  /** A string to indicate yz plane. */
  yz: "yz",
  /** A string to indicate xz plane. */
  xz: "xz",
  /** A string to indicate xyz space. */
  xyz: "xyz",
  /** Represents horizontal direction. */
  horizontal: 0,
  /** Represents vertical direction. */
  vertical: 1,
  /** Represents identical point or value */
  identical: 0,
  /** Represents right position or direction */
  right: 4,
  /** Represents bottom right position or direction */
  bottom_right: 5,
  /** Represents bottom position or direction */
  bottom: 6,
  /** Represents bottom left position or direction */
  bottom_left: 7,
  /** Represents left position or direction */
  left: 8,
  /** Represents top left position or direction */
  top_left: 1,
  /** Represents top position or direction */
  top: 2,
  /** Represents top right position or direction */
  top_right: 3,
  /** Represents an arbitrary very small number. It is set as 0.0001 here. */
  epsilon: 1e-4,
  /** Represents Number.MAX_VALUE */
  max: Number.MAX_VALUE,
  /** Represents Number.MIN_VALUE */
  min: Number.MIN_VALUE,
  /** π radian (180 deg) */
  pi: Math.PI,
  /** Two π radian (360deg) */
  two_pi: 6.283185307179586,
  /** Half π radian (90deg) */
  half_pi: 1.5707963267948966,
  /** π/4 radian (45deg) */
  quarter_pi: 0.7853981633974483,
  /** π/180 or 1 degree in radian */
  one_degree: 0.017453292519943295,
  /** Multiply this constant with a radian to get a degree */
  rad_to_deg: 57.29577951308232,
  /** Multiply this constant with a degree to get a radian */
  deg_to_rad: 0.017453292519943295,
  /** Gravity acceleration (unit: m/s^2) and gravity force (unit: Newton) on 1kg of mass. */
  gravity: 9.81,
  /** 1 Newton: 0.10197 Kilogram-force */
  newton: 0.10197,
  /** Gaussian constant (1 / Math.sqrt(2 * Math.PI)) */
  gaussian: 0.3989422804014327
};
var _Util = class _Util {
  /**
   * Set a global warning level setting. If no parameter is passed, this will return the current warn-level. See [`Util.warn`](#link).
   * @param lv a [`WarningType`](#link) option, where "error" will throw an error, "warn" will log in console, and "mute" will ignore the error. 
   */
  static warnLevel(lv) {
    if (lv) {
      _Util._warnLevel = lv;
    }
    return _Util._warnLevel;
  }
  /**
   * Convert different kinds of parameters (arguments, array, object) into an array of numbers.  
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  static getArgs(args) {
    if (args.length < 1)
      return [];
    let pos = [];
    let isArray = Array.isArray(args[0]) || ArrayBuffer.isView(args[0]);
    if (typeof args[0] === "number") {
      pos = Array.prototype.slice.call(args);
    } else if (typeof args[0] === "object" && !isArray) {
      let a = ["x", "y", "z", "w"];
      let p = args[0];
      for (let i = 0; i < a.length; i++) {
        if (p.length && i >= p.length || !(a[i] in p))
          break;
        pos.push(p[a[i]]);
      }
    } else if (isArray) {
      pos = [].slice.call(args[0]);
    }
    return pos;
  }
  /**
   * Send a warning message based on [`Util.warnLevel`](#link) global setting. This allows you to dynamically set whether minor errors should be thrown or printed in console or muted.
   * @param message any error or warning message
   * @param defaultReturn optional return value
   */
  static warn(message = "error", defaultReturn = void 0) {
    if (_Util.warnLevel() == "error") {
      throw new Error(message);
    } else if (_Util.warnLevel() == "warn") {
      console.warn(message);
    }
    return defaultReturn;
  }
  /**
   * Get a random integer. This can be useful for selecting a random index in an array.
   * @param range value range
   * @param start Optional starting value
   */
  static randomInt(range, start = 0) {
    _Util.warn("Util.randomInt is deprecated. Please use `Num.randomRange`");
    return Math.floor(Num.random() * range) + start;
  }
  /**
   * Split an array into chunks of sub-array.
   * @param pts an array 
   * @param size chunk size, ie, number of items in a chunk
   * @param stride optional parameter to "walk through" the array in steps
   * @param loopBack if `true`, always go through the array till the end and loop back to the beginning to complete the segments if needed.
   * @param matchSize if `true`, all chunks's length must match `size`.
   */
  static split(pts, size, stride, loopBack = false, matchSize = true) {
    let chunks = [];
    let part = [];
    let st = stride || size;
    let index = 0;
    if (pts.length <= 0 || st <= 0)
      return [];
    while (index < pts.length) {
      part = [];
      for (let k = 0; k < size; k++) {
        if (loopBack) {
          part.push(pts[(index + k) % pts.length]);
        } else {
          if (index + k >= pts.length)
            break;
          part.push(pts[index + k]);
        }
      }
      index += st;
      if (!matchSize || matchSize && part.length === size)
        chunks.push(part);
    }
    return chunks;
  }
  /**
   * Flatten an array of arrays such as Group[] to a flat Array or Group.
   * @param pts an array, usually an array of Groups
   * @param flattenAsGroup a boolean to specify whether the return type should be a Group or Array. Default is `true` which returns a Group.
   */
  static flatten(pts, flattenAsGroup = true) {
    let arr = flattenAsGroup ? new Group() : [];
    return arr.concat.apply(arr, pts);
  }
  /**
    * Given two arrays of objects, and a function that operate on two objects, return an array. Objects must be of same type. 
    * @param a an array of object, eg `[Group, Group, ...]` 
    * @param b another array of object 
    * @param op a function that takes two parameters (a, b) and returns an object. 
  */
  static combine(a, b, op) {
    let result = [];
    for (let i = 0, len = a.length; i < len; i++) {
      for (let k = 0, lenB = b.length; k < lenB; k++) {
        result.push(op(a[i], b[k]));
      }
    }
    return result;
  }
  /**
   * Zip arrays. eg, `[[1,2],[3,4],[5,6]] => [[1,3,5],[2,4,6]]`.
   * @param arrays an array of arrays 
   */
  static zip(arrays) {
    let z = [];
    for (let i = 0, len = arrays[0].length; i < len; i++) {
      let p = [];
      for (let k = 0; k < arrays.length; k++) {
        p.push(arrays[k][i]);
      }
      z.push(p);
    }
    return z;
  }
  /**
   * Create a convenient stepper. This returns a function which you can call repeatedly to step a counter.
   * @param max Maximum of the stepper range. The resulting stepper will return (min to max-1) values.
   * @param min Minimum of the stepper range. Default is 0.
   * @param stride Stride of the step. Default is 1.
   * @param callback An optional callback function `fn( step )`, which will be called each time when stepper function is called.
   * @example `let counter = stepper(100); let c = counter(); c = counter(); ...`
   * @returns a function which will increment the stepper and return its value at each call.
   */
  static stepper(max, min = 0, stride = 1, callback) {
    let c = min;
    return function() {
      c += stride;
      if (c >= max) {
        c = min + (c - max);
      }
      if (callback)
        callback(c);
      return c;
    };
  }
  /**
   * A convenient way to step through a range. Same as `for (i=0; i<range; i++)`, except this also stores the resulting return values at each step and return them as an array.
   * @param range a range to step through
   * @param fn a callback function `fn(index)`. If this function returns a value, it will be stored at each step
   * @returns an array of returned values at each step  
   */
  static forRange(fn, range, start = 0, step = 1) {
    let temp = [];
    for (let i = start, len = range; i < len; i += step) {
      temp[i] = fn(i);
    }
    return temp;
  }
  /**
   * Estimate performance by checking how long it takes to render a frame
   * @param avgFrames The number of frames used calculate to average
   * @example `let perf = Util.performance(); perf();` 
   * @returns milliseconds per frame
   */
  static performance(avgFrames = 10) {
    let last = Date.now();
    let avg = [];
    return function() {
      const now = Date.now();
      avg.push(now - last);
      if (avg.length >= avgFrames)
        avg.shift();
      last = now;
      return Math.floor(avg.reduce((a, b) => a + b, 0) / avg.length);
    };
  }
  /**
   * Check number of items in a Group against a required number
   * @param pts a Group or an Iterable<PtLike> 
   * @param minRequired minimum number of items required
   */
  static arrayCheck(pts, minRequired = 2) {
    if (Array.isArray(pts) && pts.length < minRequired) {
      _Util.warn(`Requires ${minRequired} or more Pts in this Group.`);
      return false;
    }
    return true;
  }
  /**
   * Convert an iterable into an array
   * @param it an iterable
   */
  static iterToArray(it) {
    return !Array.isArray(it) ? [...it] : it;
  }
  /**
   * Generate a time-based unique ID or a crypto-based ID.
   * @returns 
   */
  static uniqueId(useCrypto = false) {
    return useCrypto && crypto ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};
_Util._warnLevel = "mute";
var Util = _Util;

// src/Pt.ts
var Pt = class _Pt extends Float32Array {
  /**
   * Create a Pt. If no parameter is provided, this will instantiate a Pt with 2 dimensions [0, 0]. 
   * Note that `new Pt(3)` will only instantiate Pt with length of 3 (ie, same as `new Float32Array(3)` ). If you need a Pt with 1 dimension of value 3, use `new Pt([3])`.
   * @example `new Pt()`, `new Pt(1,2,3,4,5)`, `new Pt([1,2])`, `new Pt({x:0, y:1})`, `new Pt(pt)`
   * @param args a list of numeric parameters, an array of numbers, or an object with {x,y,z,w} properties
   */
  constructor(...args) {
    let params;
    if (args.length === 1 && typeof args[0] == "number") {
      params = args[0];
    } else {
      params = args.length > 0 ? Util.getArgs(args) : [0, 0];
    }
    super(params);
  }
  /**
   * Create an n-dimensional Pt with either default value or random values.
   * @param dimensions number of dimensions
   * @param defaultValue optional default value to fill the dimensions
   * @param randomize if `true`, randomize the value between 0 to default value
   */
  static make(dimensions, defaultValue = 0, randomize = false) {
    const p = new Float32Array(dimensions);
    if (defaultValue)
      p.fill(defaultValue);
    if (randomize) {
      for (let i = 0, len = p.length; i < len; i++) {
        p[i] = p[i] * Num.random();
      }
    }
    return new _Pt(p);
  }
  /**
   * ID string of this Pt
   */
  get id() {
    return this._id;
  }
  set id(s) {
    this._id = s;
  }
  /**
   * Value in the first dimensional of this Pt
   */
  get x() {
    return this[0];
  }
  set x(n) {
    this[0] = n;
  }
  /**
   * Value in the second dimension of this Pt
   */
  get y() {
    return this[1];
  }
  set y(n) {
    this[1] = n;
  }
  /**
   * Value in the third dimension of this Pt
   */
  get z() {
    return this[2];
  }
  set z(n) {
    this[2] = n;
  }
  /**
   * Value in the forth dimension of this Pt
   */
  get w() {
    return this[3];
  }
  set w(n) {
    this[3] = n;
  }
  /**
   * Clone this Pt and return it as a new Pt.
   */
  clone() {
    return new _Pt(this);
  }
  /**
   * Check if another Pt is equal to this Pt, within a threshold.
   * @param p another Pt to compare with
   * @param threshold a threshold value within which the two Pts are considered equal. Default is 0.000001.
   */
  equals(p, threshold = 1e-6) {
    for (let i = 0, len = this.length; i < len; i++) {
      if (Math.abs(this[i] - p[i]) > threshold)
        return false;
    }
    return true;
  }
  /**
   * Update the values of this Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  to(...args) {
    const p = Util.getArgs(args);
    for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
      this[i] = p[i];
    }
    return this;
  }
  /**
   * Like [`Pt.to`](#link) but returns a new Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $to(...args) {
    return this.clone().to(...args);
  }
  /**
   * Update the values of this Pt to point at a specific angle.
   * @param radian target angle in radian
   * @param magnitude Optional magnitude if known. If not provided, it'll calculate and use this Pt's magnitude.
   * @param anchorFromPt If `true`, add it from this Pt's current position. Default is `false` which update the position from origin (0,0). See also [`Geom.rotate2D`](#link) for rotating a point from another anchor point.
   */
  toAngle(radian, magnitude, anchorFromPt = false) {
    const m = magnitude != void 0 ? magnitude : this.magnitude();
    const change = [Math.cos(radian) * m, Math.sin(radian) * m];
    return anchorFromPt ? this.add(change) : this.to(change);
  }
  /**
   * Create an operation using this Pt, passing this Pt into a custom function's first parameter. See the [Op guide](../guide/Op-0400.html) for details.
   * @param fn any function that takes a Pt as its first parameter
   * @example `let myOp = pt.op( fn ); let result = myOp( [1,2,3] );`
   * @returns a resulting function that takes other parameters required in `fn`
   */
  op(fn) {
    const self = this;
    return (...params) => {
      return fn(self, ...params);
    };
  }
  /**
   * This combines a series of operations into an array. See the [Op guide](../guide/Op-0400.html) for details.
   * @param fns an array of functions for `op`
   * @example `let myOps = pt.ops([fn1, fn2, fn3]); let results = myOps.map( (op) => op([1,2,3]) );`
   * @returns an array of resulting functions
   */
  ops(fns) {
    const _ops = [];
    for (let i = 0, len = fns.length; i < len; i++) {
      _ops.push(this.op(fns[i]));
    }
    return _ops;
  }
  /**
   * Take specific dimensional values from this Pt and create a new Pt.
   * @param axis a string such as "xy" (use Const.xy) or an array to specify indices
   */
  $take(axis) {
    const p = [];
    for (let i = 0, len = axis.length; i < len; i++) {
      p.push(this[axis[i]] || 0);
    }
    return new _Pt(p);
  }
  /**
   * Concatenate this Pt with addition dimensional values and return as a new Pt.
   * @param args can be either a list of numbers, an array, a Pt,  or an object with {x,y,z,w} properties
   */
  $concat(...args) {
    return new _Pt(this.toArray().concat(Util.getArgs(args)));
  }
  /**
   * Add scalar or vector values to this Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  add(...args) {
    args.length === 1 && typeof args[0] == "number" ? Vec.add(this, args[0]) : Vec.add(this, Util.getArgs(args));
    return this;
  }
  /**
   * Like [`Pt.add`](#link), but returns result as a new Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $add(...args) {
    return this.clone().add(...args);
  }
  /**
   * Subtract scalar or vector values from this Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  subtract(...args) {
    args.length === 1 && typeof args[0] == "number" ? Vec.subtract(this, args[0]) : Vec.subtract(this, Util.getArgs(args));
    return this;
  }
  /**
   * Like [`Pt.subtract`](#link), but returns result as a new Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $subtract(...args) {
    return this.clone().subtract(...args);
  }
  /**
   * Multiply scalar or vector values (as element-wise) with this Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  multiply(...args) {
    args.length === 1 && typeof args[0] == "number" ? Vec.multiply(this, args[0]) : Vec.multiply(this, Util.getArgs(args));
    return this;
  }
  /**
   * Like [`Pt.multiply`](#link), but returns result as a new Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $multiply(...args) {
    return this.clone().multiply(...args);
  }
  /**
   * Divide this Pt over scalar or vector values (as element-wise).
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  divide(...args) {
    args.length === 1 && typeof args[0] == "number" ? Vec.divide(this, args[0]) : Vec.divide(this, Util.getArgs(args));
    return this;
  }
  /**
   * Like [`Pt.divide`](#link), but returns result as a new Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $divide(...args) {
    return this.clone().divide(...args);
  }
  /**
   * Get the squared distance (magnitude) of this Pt from origin.
   */
  magnitudeSq() {
    return Vec.dot(this, this);
  }
  /**
   * Get the distance (magnitude) of this Pt from origin.
   */
  magnitude() {
    return Vec.magnitude(this);
  }
  /**
   * Convert to a unit vector, which is a normalized vector whose magnitude equals to 1.
   * @param magnitude Optional: if the magnitude is known, pass it as a parameter to avoid duplicate calculation.
   */
  unit(magnitude = void 0) {
    Vec.unit(this, magnitude);
    return this;
  }
  /**
   * Get a new unit vector from this Pt.
   */
  $unit(magnitude = void 0) {
    return this.clone().unit(magnitude);
  }
  /**
   * Dot product of this Pt and another Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  dot(...args) {
    return Vec.dot(this, Util.getArgs(args));
  }
  /**
   * 2D Cross product of this Pt and another Pt. Return results as a new Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $cross2D(...args) {
    return Vec.cross2D(this, Util.getArgs(args));
  }
  /**
   * 3D Cross product of this Pt and another Pt. Return results as a new Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $cross(...args) {
    return Vec.cross(this, Util.getArgs(args));
  }
  /**
   * Calculate vector projection of this Pt on another Pt. 
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   * @returns the projection vector as a Pt
   */
  $project(...args) {
    return this.$multiply(this.dot(...args) / this.magnitudeSq());
  }
  /**
   * Calculate scalar projection.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  projectScalar(...args) {
    return this.dot(...args) / this.magnitude();
  }
  /**
   * Absolute values for all values in this pt.
   */
  abs() {
    Vec.abs(this);
    return this;
  }
  /**
   * Get a new Pt with absolute values of this Pt.
   */
  $abs() {
    return this.clone().abs();
  }
  /**
   * Floor values for all values in this Pt.
   */
  floor() {
    Vec.floor(this);
    return this;
  }
  /**
   * Get a new Pt with floor values of this Pt.
   */
  $floor() {
    return this.clone().floor();
  }
  /**
   * Ceiling values for all values in this Pt.
   */
  ceil() {
    Vec.ceil(this);
    return this;
  }
  /**
   * Get a new Pt with ceiling values of this Pt.
   */
  $ceil() {
    return this.clone().ceil();
  }
  /**
   * Rounded values for all values in this Pt.
   */
  round() {
    Vec.round(this);
    return this;
  }
  /**
   * Get a new Pt with rounded values of this Pt.
   */
  $round() {
    return this.clone().round();
  }
  /**
   * Find the minimum value across all dimensions in this Pt.
   * @returns an object with `value` and `index` which returns the minimum value and its dimensional index
   */
  minValue() {
    return Vec.min(this);
  }
  /**
   * Find the maximum value across all dimensions in this Pt.
   * @returns an object with `value` and `index` which returns the maximum value and its dimensional index
   */
  maxValue() {
    return Vec.max(this);
  }
  /**
   * Get a new Pt that has the minimum dimensional values of this Pt and another Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $min(...args) {
    const p = Util.getArgs(args);
    const m = this.clone();
    for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
      m[i] = Math.min(this[i], p[i]);
    }
    return m;
  }
  /**
   * Get a new Pt that has the maximum dimensional values of this Pt and another Pt.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  $max(...args) {
    const p = Util.getArgs(args);
    const m = this.clone();
    for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
      m[i] = Math.max(this[i], p[i]);
    }
    return m;
  }
  /**
   * Get angle of this Pt from origin.
   * @param axis a string such as "xy" (use Const.xy) or an array to specify index for two dimensions
   */
  angle(axis = Const.xy) {
    return Math.atan2(this[axis[1]], this[axis[0]]);
  }
  /**
   * Get the angle between this and another Pt.
   * @param p the other Pt
   * @param axis a string such as "xy" (use Const.xy) or an array to specify index for two dimensions
   */
  angleBetween(p, axis = Const.xy) {
    return Geom.boundRadian(this.angle(axis)) - Geom.boundRadian(p.angle(axis));
  }
  /**
   * Scale this Pt from origin or from an anchor point.
   * @param scale scale ratio
   * @param anchor optional anchor point to scale from
   */
  scale(scale, anchor) {
    Geom.scale(this, scale, anchor || _Pt.make(this.length, 0));
    return this;
  }
  /**
   * Rotate this Pt from origin or from an anchor point in 2D.
   * @param angle rotate angle
   * @param anchor optional anchor point to scale from
   * @param axis optional string such as "yz" to specify a 2D plane
   */
  rotate2D(angle, anchor, axis) {
    Geom.rotate2D(this, angle, anchor || _Pt.make(this.length, 0), axis);
    return this;
  }
  /**
   * Shear this Pt from origin or from an anchor point in 2D.
   * @param shear shearing value which can be a number or an array of 2 numbers
   * @param anchor optional anchor point to scale from
   * @param axis optional string such as "yz" to specify a 2D plane
   */
  shear2D(scale, anchor, axis) {
    Geom.shear2D(this, scale, anchor || _Pt.make(this.length, 0), axis);
    return this;
  }
  /**
   * Reflect this Pt along a 2D line.
   * @param line a Group of 2 Pts that defines a line for reflection
   * @param axis optional axis such as "yz" to define a 2D plane of reflection
   */
  reflect2D(line, axis) {
    Geom.reflect2D(this, line, axis);
    return this;
  }
  /**
   * A string representation of this Pt. Eg, "Pt(1, 2, 3)".
   */
  toString() {
    return `Pt(${this.join(", ")})`;
  }
  /**
   * Convert this Pt to a javascript Array.
   */
  toArray() {
    return [].slice.call(this);
  }
  /**
   * Convert this Pt to a Group as new Group([0,...], pt)
   */
  toGroup() {
    return new Group(_Pt.make(this.length), this.clone());
  }
  /**
   * Convert this Pt to a Bound as new Group([0,...], pt)
   */
  toBound() {
    return new Bound(_Pt.make(this.length), this.clone());
  }
};
var Group = class _Group extends Array {
  /**
   * Create a Group by passing an array of [`Pt`](#link). You may also create a Group using [`Group.fromArray`](#link) or [`Group.fromPtArray`](#link).
   * @param args an array of Pts
   */
  constructor(...args) {
    super(...args);
  }
  /**
   * ID string of this Group
   */
  get id() {
    return this._id;
  }
  set id(s) {
    this._id = s;
  }
  /** 
   * The first Pt in this Group 
   */
  get p1() {
    return this[0];
  }
  /** 
   * The second Pt in this Group 
   */
  get p2() {
    return this[1];
  }
  /** 
   * The third Pt in this Group 
   */
  get p3() {
    return this[2];
  }
  /** 
   * The forth Pt in this Group 
   */
  get p4() {
    return this[3];
  }
  /** 
   * The last Pt in this Group 
   */
  get q1() {
    return this[this.length - 1];
  }
  /** 
   * The second-last Pt in this Group 
   */
  get q2() {
    return this[this.length - 2];
  }
  /** 
   * The third-last Pt in this Group 
   */
  get q3() {
    return this[this.length - 3];
  }
  /** 
   * The forth-last Pt in this Group 
   */
  get q4() {
    return this[this.length - 4];
  }
  /**
   * Depp clone this group and its Pts.
   */
  clone() {
    const group = new _Group();
    for (let i = 0, len = this.length; i < len; i++) {
      group.push(this[i].clone());
    }
    return group;
  }
  /**
   * Convert an array of numeric arrays into a Group.
   * @param list an Iterable<PtLike> such as an array or a generator (of PtLike numeric arrays)
   * @example `Group.fromArray( [[1,2], [3,4], [5,6]] )`
   */
  static fromArray(list) {
    const g = new _Group();
    for (const li of list) {
      const p = li instanceof Pt ? li : new Pt(li);
      g.push(p);
    }
    return g;
  }
  /**
   * Convert an Array/Iterable of Pt into a Group.
   * @param list an Iterable<Pt>
   */
  static fromPtArray(list) {
    return _Group.from(list);
  }
  /**
   * Split this Group into an array of sub-groups.
   * @param chunkSize number of items per sub-group
   * @param stride forward-steps after each sub-group
   * @param loopBack if `true`, always go through the array till the end and loop back to the beginning to complete the segments if needed
   */
  split(chunkSize, stride, loopBack = false) {
    const sp = Util.split(this, chunkSize, stride, loopBack);
    return sp;
  }
  /**
   * Insert more Pt into this group.
   * @param pts a Group or an Iterable<Pt>
   * @param index the index position to insert into
   */
  insert(pts, index = 0) {
    _Group.prototype.splice.apply(this, [index, 0, ...pts]);
    return this;
  }
  /**
   * Like Array's splice function, with support for negative index and a friendlier name.
   * @param index start index, which can be negative (where -1 is at index 0, -2 at index 1, etc)
   * @param count number of items to remove
   * @returns The items that are removed. 
   */
  remove(index = 0, count = 1) {
    const param = index < 0 ? [index * -1 - 1, count] : [index, count];
    return _Group.prototype.splice.apply(this, param);
  }
  /**
   * Split this group into an array of sub-group segments.
   * @param pts_per_segment number of Pts in each segment
   * @param stride forward-step to take
   * @param loopBack if `true`, always go through the array till the end and loop back to the beginning to complete the segments if needed
   */
  segments(pts_per_segment = 2, stride = 1, loopBack = false) {
    return this.split(pts_per_segment, stride, loopBack);
  }
  /**
   * Get all the line segments (ie, edges in a graph) of this group.
   */
  lines() {
    return this.segments(2, 1);
  }
  /**
   * Find the centroid of this group's Pts, which is the average middle point.
   */
  centroid() {
    return Geom.centroid(this);
  }
  /**
   * Find the rectangular bounding box of this group's Pts.
   * @returns a Group of 2 Pts representing the top-left and bottom-right of the rectangle
   */
  boundingBox() {
    return Geom.boundingBox(this);
  }
  /**
   * Anchor all the Pts in this Group using a target Pt as origin. (ie, subtract all Pt with the target anchor to get a relative position). All the Pts' values will be updated.
   * @param ptOrIndex a Pt, or a numeric index to target a specific Pt in this Group
   */
  anchorTo(ptOrIndex = 0) {
    Geom.anchor(this, ptOrIndex, "to");
  }
  /**
   * Anchor all the Pts in this Group by its absolute position from a target Pt. (ie, add all Pt with the target anchor to get an absolute position).  All the Pts' values will be updated.
   * @param ptOrIndex a Pt, or a numeric index to target a specific Pt in this Group
   */
  anchorFrom(ptOrIndex = 0) {
    Geom.anchor(this, ptOrIndex, "from");
  }
  /**
   * Create an operation using this Group, passing this Group into a custom function's first parameter.  See the [Op guide](../guide/Op-0400.html) for details.
   * @param fn any function that takes a Group as its first parameter
   * @example `let myOp = group.op( fn ); let result = myOp( [1,2,3] );`
   * @returns a resulting function that takes other parameters required in `fn`
   */
  op(fn) {
    const self = this;
    return (...params) => {
      return fn(self, ...params);
    };
  }
  /**
   * This combines a series of operations into an array. See the [Op guide](../guide/Op-0400.html) for details.
   * @param fns an array of functions for `op`
   * @example `let myOps = pt.ops([fn1, fn2, fn3]); let results = myOps.map( (op) => op([1,2,3]) );`
   * @returns an array of resulting functions
   */
  ops(fns) {
    const _ops = [];
    for (let i = 0, len = fns.length; i < len; i++) {
      _ops.push(this.op(fns[i]));
    }
    return _ops;
  }
  /**
   * Get an interpolated point on the line segments defined by this Group.
   * @param t a value between 0 to 1 usually
   */
  interpolate(t) {
    t = Num.clamp(t, 0, 1);
    const chunk = this.length - 1;
    const tc = 1 / (this.length - 1);
    const idx = Math.floor(t / tc);
    return Geom.interpolate(this[idx], this[Math.min(this.length - 1, idx + 1)], (t - idx * tc) * chunk);
  }
  /**
   * Move every Pt's position by a specific amount. Same as [`Group.add`](#link).
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  moveBy(...args) {
    return this.add(...args);
  }
  /**
   * Move the first Pt in this group to a specific position, and move all the other Pts correspondingly.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  moveTo(...args) {
    const d = new Pt(Util.getArgs(args)).subtract(this[0]);
    this.moveBy(d);
    return this;
  }
  /**
   * Scale this group's Pts from an anchor point. Default anchor point is the first Pt in this group.
   * @param scale scale ratio
   * @param anchor optional anchor point to scale from
   */
  scale(scale, anchor) {
    for (let i = 0, len = this.length; i < len; i++) {
      Geom.scale(this[i], scale, anchor || this[0]);
    }
    return this;
  }
  /**
   * Rotate this group's Pt from an anchor point in 2D. Default anchor point is the first Pt in this group.
   * @param angle rotate angle
   * @param anchor optional anchor point to scale from
   * @param axis optional string such as "yz" to specify a 2D plane
   */
  rotate2D(angle, anchor, axis) {
    for (let i = 0, len = this.length; i < len; i++) {
      Geom.rotate2D(this[i], angle, anchor || this[0], axis);
    }
    return this;
  }
  /**
   * Shear this group's Pt from an anchor point in 2D. Default anchor point is the first Pt in this group.
   * @param shear shearing value which can be a number or an array of 2 numbers
   * @param anchor optional anchor point to scale from
   * @param axis optional string such as "yz" to specify a 2D plane
   */
  shear2D(scale, anchor, axis) {
    for (let i = 0, len = this.length; i < len; i++) {
      Geom.shear2D(this[i], scale, anchor || this[0], axis);
    }
    return this;
  }
  /**
   * Reflect this group's Pts along a 2D line. Default anchor point is the first Pt in this group.
   * @param line a Group or an Iterable<PtLike> with 2 Pt that defines a line for reflection
   * @param axis optional axis such as "yz" to define a 2D plane of reflection
   */
  reflect2D(line, axis) {
    for (let i = 0, len = this.length; i < len; i++) {
      Geom.reflect2D(this[i], line, axis);
    }
    return this;
  }
  /**
   * Sort this group's Pts by values in a specific dimension.
   * @param dim dimensional index
   * @param desc if true, sort descending. Default is false (ascending)
   */
  sortByDimension(dim, desc = false) {
    return this.sort((a, b) => desc ? b[dim] - a[dim] : a[dim] - b[dim]);
  }
  /**
   * Update each Pt in this Group with an existing Pt function.
   * @param ptFn string name of an existing Pt function. Note that the function must return Pt.
   * @param args arguments for the function specified in ptFn
   */
  forEachPt(ptFn, ...args) {
    if (!this[0][ptFn]) {
      Util.warn(`${ptFn} is not a function of Pt`);
      return this;
    }
    for (let i = 0, len = this.length; i < len; i++) {
      this[i] = this[i][ptFn](...args);
    }
    return this;
  }
  /**
   * Add scalar or vector values to this group's Pts.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  add(...args) {
    return this.forEachPt("add", ...args);
  }
  /**
   * Subtract scalar or vector values from this group's Pts.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  subtract(...args) {
    return this.forEachPt("subtract", ...args);
  }
  /**
   * Multiply scalar or vector values (as element-wise) with this group's Pts.
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  multiply(...args) {
    return this.forEachPt("multiply", ...args);
  }
  /**
   * Divide this group's Pts over scalar or vector values (as element-wise).
   * @param args can be either a list of numbers, an array, a Pt, or an object with {x,y,z,w} properties
   */
  divide(...args) {
    return this.forEachPt("divide", ...args);
  }
  /**
   * Apply this group as a matrix and calculate matrix addition.
   * @param g a scalar number, an array of numeric arrays, or a group of Pt
   * @returns a new Group
   */
  $matrixAdd(g) {
    return Mat.add(this, g);
  }
  /**
   * Apply this group as a matrix and calculate matrix multiplication.
   * @param g a scalar number, an array of numeric arrays, or a Group of K Pts, each with N dimensions (K-rows, N-columns) -- or if transposed is true, then N Pts with K dimensions
   * @param transposed (Only applicable if it's not elementwise multiplication) If true, then a and b's columns should match (ie, each Pt should have the same dimensions). Default is `false`.
   * @param elementwise if true, then the multiplication is done element-wise. Default is `false`.
   * @returns If not elementwise, this will return a new  Group with M Pt, each with N dimensions (M-rows, N-columns).
   */
  $matrixMultiply(g, transposed = false, elementwise = false) {
    return Mat.multiply(this, g, transposed, elementwise);
  }
  /**
   * Zip one slice of an array of Pt. Imagine the Pts are organized in rows, then this function will take the values in a specific column.
   * @param idx index to zip at
   * @param defaultValue a default value to fill if index out of bound. If not provided, it will throw an error instead.
   */
  zipSlice(index, defaultValue = false) {
    return Mat.zipSlice(this, index, defaultValue);
  }
  /**
   * Zip a group of Pt. eg, [[1,2],[3,4],[5,6]] => [[1,3,5],[2,4,6]].
   * @param defaultValue a default value to fill if index out of bound. If not provided, it will throw an error instead.
   * @param useLongest If true, find the longest list of values in a Pt and use its length for zipping. Default is false, which uses the first item's length for zipping.
   */
  $zip(defaultValue = void 0, useLongest = false) {
    return Mat.zip(this, defaultValue, useLongest);
  }
  /**
   * Get a Bound instance of this group
   */
  toBound() {
    return Bound.fromGroup(this);
  }
  /**
   * Get a string representation of this group.
   */
  toString() {
    return "Group[ " + this.reduce((p, c) => p + c.toString() + " ", "") + " ]";
  }
};
var Bound = class _Bound extends Group {
  /**
   * Create a Bound. This is similar to the Group constructor. You can also create a Bound via the static function [`Bound.fromGroup`](#link), or alternatively via the [Group.toBound](#link) function.
   * @param args a list of Pt as parameters
   * @see Bound.fromGroup
   */
  constructor(...args) {
    super(...args);
    this._center = new Pt();
    this._size = new Pt();
    this._inited = false;
    this.init();
  }
  /**
   * Create a Bound from a [`ClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) object.
   * @param rect an object that has {top, left, bottom, right, width, height} properties
   * @returns a Bound object
   */
  static fromBoundingRect(rect) {
    const b = new _Bound(new Pt(rect.left || 0, rect.top || 0), new Pt(rect.right || 0, rect.bottom || 0));
    if (rect.width && rect.height)
      b.size = new Pt(rect.width, rect.height);
    return b;
  }
  /**
   * Create a Bound from a Group or an array of Pts
   * @param g a Group or an Iterable<PtLike>
   */
  static fromGroup(g) {
    const _g = Util.iterToArray(g);
    if (_g.length < 2)
      throw new Error("Cannot create a Bound from a group that has less than 2 Pt");
    return new _Bound(_g[0], _g[_g.length - 1]);
  }
  /**
   * Initiate the bound's properties.
   */
  init() {
    if (this.p1) {
      this._size = this.p1.clone();
      this._inited = true;
    }
    if (this.p1 && this.p2) {
      this._updateSize();
      this._inited = true;
    }
  }
  /**
   * Clone this bound and return a new one.
   */
  clone() {
    return new _Bound(this.topLeft.clone(), this.bottomRight.clone());
  }
  /**
   * Recalculte size and center.
   */
  _updateSize() {
    this._size = this.bottomRight.$subtract(this.topLeft).abs();
    this._updateCenter();
  }
  /**
   * Recalculate center.
   */
  _updateCenter() {
    this._center = this._size.$multiply(0.5).add(this.topLeft);
  }
  /**
   * Recalculate based on top-left position and size.
   */
  _updatePosFromTop() {
    this.bottomRight = this.topLeft.$add(this._size);
    this._updateCenter();
  }
  /**
   * Recalculate based on bottom-right position and size.
   */
  _updatePosFromBottom() {
    this.topLeft = this.bottomRight.$subtract(this._size);
    this._updateCenter();
  }
  /**
   * Recalculate based on center position and size.
   */
  _updatePosFromCenter() {
    const half = this._size.$multiply(0.5);
    this.topLeft = this._center.$subtract(half);
    this.bottomRight = this._center.$add(half);
  }
  /**
   * Size of this Bound
   */
  get size() {
    return new Pt(this._size);
  }
  set size(p) {
    this._size = new Pt(p);
    this._updatePosFromTop();
  }
  /**
   * Center position of this Bound
   */
  get center() {
    return new Pt(this._center);
  }
  set center(p) {
    this._center = new Pt(p);
    this._updatePosFromCenter();
  }
  /**
   * Top-left position of this Bound
   */
  get topLeft() {
    return new Pt(this[0]);
  }
  set topLeft(p) {
    this[0] = new Pt(p);
    this._updateSize();
  }
  /**
   * Bottom-right position of this Bound
   */
  get bottomRight() {
    return new Pt(this[1]);
  }
  set bottomRight(p) {
    this[1] = new Pt(p);
    this._updateSize();
  }
  /**
   * Width of this Bound
   */
  get width() {
    return this._size.length > 0 ? this._size.x : 0;
  }
  set width(w) {
    this._size.x = w;
    this._updatePosFromTop();
  }
  /**
   * Height of this Bound
   */
  get height() {
    return this._size.length > 1 ? this._size.y : 0;
  }
  set height(h) {
    this._size.y = h;
    this._updatePosFromTop();
  }
  /**
   * Depth of this Bound
   */
  get depth() {
    return this._size.length > 2 ? this._size.z : 0;
  }
  set depth(d) {
    this._size.z = d;
    this._updatePosFromTop();
  }
  /**
   * First value of the Bound's top-left position
   */
  get x() {
    return this.topLeft.x;
  }
  /**
   * Second value of the Bound's top-left position
   */
  get y() {
    return this.topLeft.y;
  }
  /**
   * Third value of the Bound's top-left position
   */
  get z() {
    return this.topLeft.z;
  }
  /**
   * Whether this Bound has been initiated
   */
  get inited() {
    return this._inited;
  }
  /**
   * If the Bound's Pts are changed, call this function to update the Bound's properties.
   * It's simpler and preferable to change the Bound's properties (eg, topLeft, bottomRight) instead of updating the Bound's Pts.
   */
  update() {
    this.topLeft = this[0];
    this.bottomRight = this[1];
    this._updateSize();
    return this;
  }
};

// src/Create.ts
var Create = class {
  /**
   * Create a set of random points inside a bounday.
   * @param bound the rectangular boundary
   * @param count number of random points to create
   * @param dimensions number of dimensions in each point
   */
  static distributeRandom(bound, count, dimensions = 2) {
    let pts = new Group();
    for (let i = 0; i < count; i++) {
      let p = [bound.x + Num.random() * bound.width];
      if (dimensions > 1)
        p.push(bound.y + Num.random() * bound.height);
      if (dimensions > 2)
        p.push(bound.z + Num.random() * bound.depth);
      pts.push(new Pt(p));
    }
    return pts;
  }
  /**
   * Create a set of points that distribute evenly on a line. Similar to [`Line.subpoints`](#link) but includes the end points.
   * @param line a Group or an Iterable<Pt> representing a line
   * @param count number of points to create
   */
  static distributeLinear(line, count) {
    let _line = Util.iterToArray(line);
    let ln = Line.subpoints(_line, count - 2);
    ln.unshift(_line[0]);
    ln.push(_line[_line.length - 1]);
    return ln;
  }
  /**
   * Create an evenly distributed set of points (like a grid of points) inside a boundary.
   * @param bound the rectangular boundary
   * @param columns number of columns
   * @param rows number of rows
   * @param orientation a Pt or number array to specify where the point should be inside a cell. Default is [0.5, 0.5] which places the point in the middle.
   * @returns a Group of Pts
   */
  static gridPts(bound, columns, rows, orientation = [0.5, 0.5]) {
    if (columns === 0 || rows === 0)
      throw new Error("grid columns and rows cannot be 0");
    let unit = bound.size.$subtract(1).$divide(columns, rows);
    let offset = unit.$multiply(orientation);
    let g = new Group();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        g.push(bound.topLeft.$add(unit.$multiply(c, r)).add(offset));
      }
    }
    return g;
  }
  /**
   * Create a grid of cells inside a boundary, where each cell is defined by a group of 2 Pt.
   * @param bound the rectangular boundary
   * @param columns number of columns
   * @param rows number of rows
   * @returns an array of Groups, where each group represents a rectangular cell
   */
  static gridCells(bound, columns, rows) {
    if (columns === 0 || rows === 0)
      throw new Error("grid columns and rows cannot be 0");
    let unit = bound.size.$subtract(1).divide(columns, rows);
    let g = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        g.push(new Group(
          bound.topLeft.$add(unit.$multiply(c, r)),
          bound.topLeft.$add(unit.$multiply(c, r).add(unit))
        ));
      }
    }
    return g;
  }
  /**
   * Create a set of Pts around a circular path.
   * @param center circle center
   * @param radius circle radius
   * @param count number of Pts to create
   * @param angleOffset offset starting angle
   */
  static radialPts(center, radius, count, angleOffset = -Const.half_pi) {
    let g = new Group();
    let a = Const.two_pi / count;
    for (let i = 0; i < count; i++) {
      g.push(new Pt(center).toAngle(a * i + angleOffset, radius, true));
    }
    return g;
  }
  /**
   * Given a group of Pts, return a new group of `Noise` Pts.
   * @param pts a Group or an Iterable<Pt>
   * @param dx small increment value in x dimension
   * @param dy small increment value in y dimension
   * @param rows Optional row count to generate 2D noise
   * @param columns Optional column count to generate 2D noise
   */
  static noisePts(pts, dx = 0.01, dy = 0.01, rows = 0, columns = 0) {
    let seed = Num.random();
    let g = new Group();
    let i = 0;
    for (let p of pts) {
      let np = new Noise(p);
      let r = rows && rows > 0 ? Math.floor(i / rows) : i;
      let c = columns && columns > 0 ? i % columns : i;
      np.initNoise(dx * c, dy * r);
      np.seed(seed);
      g.push(np);
      i++;
    }
    return g;
  }
  /**
   * Create a Delaunay Group. Use the [`Delaunay.delaunay()`](#link) and [`Delaunay.voronoi()`](#link) functions in the returned group to generate tessellations.
   * @param pts a Group or an array of Pts
   * @returns an instance of the Delaunay class
   */
  static delaunay(pts) {
    return Delaunay.from(pts);
  }
};
var __noise_grad3 = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1]
];
var __noise_permTable = [
  151,
  160,
  137,
  91,
  90,
  15,
  131,
  13,
  201,
  95,
  96,
  53,
  194,
  233,
  7,
  225,
  140,
  36,
  103,
  30,
  69,
  142,
  8,
  99,
  37,
  240,
  21,
  10,
  23,
  190,
  6,
  148,
  247,
  120,
  234,
  75,
  0,
  26,
  197,
  62,
  94,
  252,
  219,
  203,
  117,
  35,
  11,
  32,
  57,
  177,
  33,
  88,
  237,
  149,
  56,
  87,
  174,
  20,
  125,
  136,
  171,
  168,
  68,
  175,
  74,
  165,
  71,
  134,
  139,
  48,
  27,
  166,
  77,
  146,
  158,
  231,
  83,
  111,
  229,
  122,
  60,
  211,
  133,
  230,
  220,
  105,
  92,
  41,
  55,
  46,
  245,
  40,
  244,
  102,
  143,
  54,
  65,
  25,
  63,
  161,
  1,
  216,
  80,
  73,
  209,
  76,
  132,
  187,
  208,
  89,
  18,
  169,
  200,
  196,
  135,
  130,
  116,
  188,
  159,
  86,
  164,
  100,
  109,
  198,
  173,
  186,
  3,
  64,
  52,
  217,
  226,
  250,
  124,
  123,
  5,
  202,
  38,
  147,
  118,
  126,
  255,
  82,
  85,
  212,
  207,
  206,
  59,
  227,
  47,
  16,
  58,
  17,
  182,
  189,
  28,
  42,
  223,
  183,
  170,
  213,
  119,
  248,
  152,
  2,
  44,
  154,
  163,
  70,
  221,
  153,
  101,
  155,
  167,
  43,
  172,
  9,
  129,
  22,
  39,
  253,
  9,
  98,
  108,
  110,
  79,
  113,
  224,
  232,
  178,
  185,
  112,
  104,
  218,
  246,
  97,
  228,
  251,
  34,
  242,
  193,
  238,
  210,
  144,
  12,
  191,
  179,
  162,
  241,
  81,
  51,
  145,
  235,
  249,
  14,
  239,
  107,
  49,
  192,
  214,
  31,
  181,
  199,
  106,
  157,
  184,
  84,
  204,
  176,
  115,
  121,
  50,
  45,
  127,
  4,
  150,
  254,
  138,
  236,
  205,
  93,
  222,
  114,
  67,
  29,
  24,
  72,
  243,
  141,
  128,
  195,
  78,
  66,
  215,
  61,
  156,
  180
];
var Noise = class extends Pt {
  /**
   * Create a Noise Pt that can generate noise continuously. See a [Noise demo here](../demo/index.html?name=create.noisePts).
   * @param args a list of numeric parameters, an array of numbers, or an object with {x,y,z,w} properties
   */
  constructor(...args) {
    super(...args);
    this.perm = [];
    this._n = new Pt(0.01, 0.01);
    this.perm = __noise_permTable.concat(__noise_permTable);
  }
  /**
   * Set the initial dimensional values of the noise.
   * @param args a list of numeric parameters, an array of numbers, or an object with {x,y,z,w} properties
   * @example `noise.initNoise( 0.01, 0.1 )`
   */
  initNoise(...args) {
    this._n = new Pt(...args);
    return this;
  }
  /**
   * Add a small increment to the noise values.
   * @param x step in x dimension
   * @param y step in y dimension
   */
  step(x = 0, y = 0) {
    this._n.add(x, y);
    return this;
  }
  /**
   * Specify a seed for this Noise.
   * @param s seed value
   */
  seed(s) {
    if (s > 0 && s < 1)
      s *= 65536;
    s = Math.floor(s);
    if (s < 256)
      s |= s << 8;
    for (let i = 0; i < 255; i++) {
      let v = i & 1 ? __noise_permTable[i] ^ s & 255 : __noise_permTable[i] ^ s >> 8 & 255;
      this.perm[i] = this.perm[i + 256] = v;
    }
    return this;
  }
  /**
   * Generate a 2D Perlin noise value.
   */
  noise2D() {
    let i = Math.max(0, Math.floor(this._n[0])) % 255;
    let j = Math.max(0, Math.floor(this._n[1])) % 255;
    let x = this._n[0] % 255 - i;
    let y = this._n[1] % 255 - j;
    let n00 = Vec.dot(__noise_grad3[(i + this.perm[j]) % 12], [x, y, 0]);
    let n01 = Vec.dot(__noise_grad3[(i + this.perm[j + 1]) % 12], [x, y - 1, 0]);
    let n10 = Vec.dot(__noise_grad3[(i + 1 + this.perm[j]) % 12], [x - 1, y, 0]);
    let n11 = Vec.dot(__noise_grad3[(i + 1 + this.perm[j + 1]) % 12], [x - 1, y - 1, 0]);
    let _fade = (f) => f * f * f * (f * (f * 6 - 15) + 10);
    let tx = _fade(x);
    return Num.lerp(Num.lerp(n00, n10, tx), Num.lerp(n01, n11, tx), _fade(y));
  }
};
var Delaunay = class _Delaunay extends Group {
  constructor() {
    super(...arguments);
    this._mesh = [];
  }
  /**
   * Generate Delaunay triangles. This function also caches the mesh that is used to generate Voronoi tessellation in `voronoi()`. See a [Delaunay demo here](../demo/index.html?name=create.delaunay).
   * @param triangleOnly if true, returns an array of triangles in Groups, otherwise return the whole DelaunayShape
   * @returns an array of Groups or an array of DelaunayShapes `{i, j, k, triangle, circle}` which records the indices of the vertices, and the calculated triangles and circumcircles
   */
  delaunay(triangleOnly = true) {
    if (this.length < 3)
      return [];
    this._mesh = [];
    let n = this.length;
    let indices = [];
    for (let i = 0; i < n; i++)
      indices[i] = i;
    indices.sort((i, j) => this[j][0] - this[i][0]);
    let pts = this.slice();
    let st = this._superTriangle();
    pts = pts.concat(st);
    let opened = [this._circum(n, n + 1, n + 2, st)];
    let closed = [];
    let tris = [];
    for (let i = 0, len = indices.length; i < len; i++) {
      let c = indices[i];
      let edges = [];
      let j = opened.length;
      if (!this._mesh[c])
        this._mesh[c] = {};
      while (j--) {
        let circum = opened[j];
        let radius = circum.circle[1][0];
        let d = pts[c].$subtract(circum.circle[0]);
        if (d[0] > 0 && d[0] * d[0] > radius * radius) {
          closed.push(circum);
          tris.push(circum.triangle);
          opened.splice(j, 1);
          continue;
        }
        if (d[0] * d[0] + d[1] * d[1] - radius * radius > Const.epsilon) {
          continue;
        }
        edges.push(circum.i, circum.j, circum.j, circum.k, circum.k, circum.i);
        opened.splice(j, 1);
      }
      _Delaunay._dedupe(edges);
      j = edges.length;
      while (j > 1) {
        opened.push(this._circum(edges[--j], edges[--j], c, false, pts));
      }
    }
    for (let i = 0, len = opened.length; i < len; i++) {
      let o = opened[i];
      if (o.i < n && o.j < n && o.k < n) {
        closed.push(o);
        tris.push(o.triangle);
        this._cache(o);
      }
    }
    return triangleOnly ? tris : closed;
  }
  /**
   * Generate Voronoi cells. `delaunay()` must be called before calling this function. See a [Voronoi demo here](../demo/index.html?name=create.delaunay).
   * @returns an array of Groups, each of which represents a Voronoi cell
   */
  voronoi() {
    let vs = [];
    let n = this._mesh;
    for (let i = 0, len = n.length; i < len; i++) {
      vs.push(this.neighborPts(i, true));
    }
    return vs;
  }
  /**
   * Get the cached mesh. The mesh is an array of objects, each of which representing the enclosing triangles around a Pt in this Delaunay group.
   * @return an array of objects that store a series of DelaunayShapes
   */
  mesh() {
    return this._mesh;
  }
  /**
   * Given an index of a Pt in this Delaunay Group, returns its neighboring Pts in the network.
   * @param i index of a Pt
   * @param sort if true, sort the neighbors so that their edges will form a polygon
   * @returns an array of Pts
   */
  neighborPts(i, sort = false) {
    let cs = new Group();
    let n = this._mesh;
    for (let k in n[i]) {
      if (n[i].hasOwnProperty(k))
        cs.push(n[i][k].circle[0]);
    }
    return sort ? Geom.sortEdges(cs) : cs;
  }
  /**
   * Given an index of a Pt in this Delaunay Group, returns its neighboring DelaunayShapes.
   * @param i index of a Pt
   * @returns an array of DelaunayShapes `{i, j, k, triangle, circle}`
   */
  neighbors(i) {
    let cs = [];
    let n = this._mesh;
    for (let k in n[i]) {
      if (n[i].hasOwnProperty(k))
        cs.push(n[i][k]);
    }
    return cs;
  }
  /**
   * Record a DelaunayShape in the mesh.
   * @param o DelaunayShape instance
   */
  _cache(o) {
    this._mesh[o.i][`${Math.min(o.j, o.k)}-${Math.max(o.j, o.k)}`] = o;
    this._mesh[o.j][`${Math.min(o.i, o.k)}-${Math.max(o.i, o.k)}`] = o;
    this._mesh[o.k][`${Math.min(o.i, o.j)}-${Math.max(o.i, o.j)}`] = o;
  }
  /**
   * Get the initial "super triangle" that contains all the points in this set.
   * @returns a Group representing a triangle
   */
  _superTriangle() {
    let minPt = this[0];
    let maxPt = this[0];
    for (let i = 1, len = this.length; i < len; i++) {
      minPt = minPt.$min(this[i]);
      maxPt = maxPt.$max(this[i]);
    }
    let d = maxPt.$subtract(minPt);
    let mid = minPt.$add(maxPt).divide(2);
    let dmax = Math.max(d[0], d[1]);
    return new Group(mid.$subtract(20 * dmax, dmax), mid.$add(0, 20 * dmax), mid.$add(20 * dmax, -dmax));
  }
  /**
   * Get a triangle from 3 points in a list of points
   * @param i index 1
   * @param j index 2
   * @param k index 3
   * @param pts a Group of Pts
   */
  _triangle(i, j, k, pts = this) {
    return new Group(pts[i], pts[j], pts[k]);
  }
  /**
   * Get a circumcircle and triangle from 3 points in a list of points
   * @param i index 1
   * @param j index 2
   * @param k index 3
   * @param tri a Group representing a triangle, or `false` to create it from indices
   * @param pts a Group of Pts
   */
  _circum(i, j, k, tri, pts = this) {
    let t = tri || this._triangle(i, j, k, pts);
    return {
      i,
      j,
      k,
      triangle: t,
      circle: Triangle.circumcircle(t)
    };
  }
  /**
   * Dedupe the edges array
   * @param edges 
   */
  static _dedupe(edges) {
    let j = edges.length;
    while (j > 1) {
      let b = edges[--j];
      let a = edges[--j];
      let i = j;
      while (i > 1) {
        let n = edges[--i];
        let m = edges[--i];
        if (a == m && b == n || a == n && b == m) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          break;
        }
      }
    }
    return edges;
  }
};
export {
  Bound,
  Circle,
  Const,
  Create,
  Curve,
  Delaunay,
  Geom,
  Group,
  Line,
  Mat,
  Noise,
  Num,
  Polygon,
  Pt,
  Range,
  Rectangle,
  Shaping,
  Triangle,
  Util,
  Vec
};
/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
