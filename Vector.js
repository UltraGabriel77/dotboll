/* eslint-disable require-jsdoc */
/*
Simple 2D JavaScript Vector Class
Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js
*/
class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  /* STATIC METHODS */
  static negative(v) {
    return new Vector(-v.x, -v.y);
  }
  static add(a, b) {
    if (b instanceof Vector) {
      return new Vector(a.x + b.x, a.y + b.y);
    } else {
      return new Vector(a.x + b, a.y + b);
    }
  }
  static subtract(a, b) {
    if (b instanceof Vector) {
      return new Vector(a.x - b.x, a.y - b.y);
    } else {
      return new Vector(a.x - b, a.y - b);
    }
  }
  static multiply(a, b) {
    if (b instanceof Vector) {
      return new Vector(a.x * b.x, a.y * b.y);
    } else {
      return new Vector(a.x * b, a.y * b);
    }
  }
  static divide(a, b) {
    if (b instanceof Vector) {
      return new Vector(a.x / b.x, a.y / b.y);
    } else {
      return new Vector(a.x / b, a.y / b);
    }
  }
  static equals(a, b) {
    return a.x == b.x && a.y == b.y;
  }
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  static cross(a, b) {
    return a.x * b.y - a.y * b.x;
  }
}

/* INSTANCE METHODS */

Vector.prototype = {
  negative: function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },
  add: function(v) {
    if (v instanceof Vector) {
      this.x += v.x;
      this.y += v.y;
    } else {
      this.x += v;
      this.y += v;
    }
    return this;
  },
  subtract: function(v) {
    if (v instanceof Vector) {
      this.x -= v.x;
      this.y -= v.y;
    } else {
      this.x -= v;
      this.y -= v;
    }
    return this;
  },
  multiply: function(v) {
    if (v instanceof Vector) {
      this.x *= v.x;
      this.y *= v.y;
    } else {
      this.x *= v;
      this.y *= v;
    }
    return this;
  },
  divide: function(v) {
    if (v instanceof Vector) {
      if (v.x != 0) this.x /= v.x;
      if (v.y != 0) this.y /= v.y;
    } else {
      if (v != 0) {
        this.x /= v;
        this.y /= v;
      }
    }
    return this;
  },
  equals: function(v) {
    return this.x == v.x && this.y == v.y;
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y;
  },
  cross: function(v) {
    return this.x * v.y - this.y * v.x;
  },
  length: function() {
    return Math.sqrt(this.dot(this));
  },
  normalize: function() {
    return this.divide(this.length());
  },
  min: function() {
    return Math.min(this.x, this.y);
  },
  max: function() {
    return Math.max(this.x, this.y);
  },
  toAngles: function() {
    return -Math.atan2(-this.y, this.x);
  },
  angleTo: function(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  },
  toArray: function(n) {
    return [this.x, this.y].slice(0, n || 2);
  },
  clone: function() {
    return new Vector(this.x, this.y);
  },
  set: function(x, y) {
    this.x = x; this.y = y;
    return this;
  },
};


exports.Vector = Vector;
