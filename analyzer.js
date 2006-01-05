/*
Copryight 2005-2006 Oliver steele.  Some rights reserved.

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License: http://creativecommons.org/licenses/by-nc-sa/2.5/.
*/

var DataFrame = function () {
  this.rowNames = [];
  this.columnNames = [];
  this.columns = [];
  this.columnSumCache = {}; // {[start,end+1] -> [sum]}
  this.columnNameIndices = {}; // {Date -> row_index}
  this.rowNameIndices = {}; // {tagname -> col_index}
};

DataFrame.prototype = {
  getColumnIndex: function (name) {
    var i = this.columnNameIndices[name];
	// create new columns on demand
    if (!(i >= 0)) {
      i = this.columnNameIndices[name] = this.columnNames.length;
      this.columnNames.push(name);
	  var column = [];
	  for (var j = 0; j < this.rowNames.length; j++)
        column.push(0);
      this.columns.push(column);
    }
	return i;
  },
  
  getRowIndex: function (name) {
    var j = this.rowNameIndices[name];
	// create new rows on demand
	if (!(j >= 0)) {
	  j = this.rowNameIndices[name] = this.rowNames.length;
	  this.rowNames.push(name);
	  // fill up new rows, to keep the matrix rectangular
	  for (var i = 0; i < this.columns.length; i++)
		this.columns[i].push(0);
	}
	return j;
  },
  
  addColumns_iterate: function (a, b) {
    var sum = [];
    for (var i = a; i < b; i++) {
      var column = this.columns[i];
      for (var t = 0; t < column.length; t++) {
        while (t >= sum.length) sum.push(0);
        sum[t] += column[t];
      }
    }
    while (sum.length < this.rowNames.length) sum.push(0);
    return sum;
  },
  
  addColumns_choose: function (a, b, left, right) {
    if (b - a < 4) return this.addColumns_iterate(a, b); // cutoff
	var middle = Math.floor((left + right)/2);
	var s0 = a < middle && this.addColumns_subdivide(a, Math.min(b, middle-1), left, middle);
	var s1 = middle <= b && this.addColumns_subdivide(Math.max(a, middle), b, middle, right);
	if (!s0 || !s1) return s0 || s1;
	var sum = [];
	for (var i = 0; i < s0.length; i++)
	  sum.push(s0[i]+s1[i]);
	return sum;
  },
  
  addColumns_subdivide: function (a, b, left, right) {
	if (arguments.length <= 2) {
	  left = 0;
	  right = this.columns.length;
	}
	var cache = this.columnSumCache;
	var key = a == left && b == right-1 && [a,b];
	if (key && cache[key]) return cache[key];
	if (a==b) return null;
	var sum = this.addColumns_choose(a, b, left, right);
	if (key) cache[key] = sum;
	return sum;
  },

  columnRangeSum: function(a, b) {
	//var t0 = (new Date).getTime();
	sum = this.addColumns_subdivide(a, b);
	//Debug.write((new Date).getTime()-t0);
	return sum;
  },
  
  getColumnSums: function () {
    var sums = [];
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      var sum = 0;
      for (var t = 0; t < column.length; t++) {
        sum += column[t];
      }
      sums.push(sum);
    }
    return sums;
  }
}

// Return an array +inversion+ s.t. Ai: source[inversions[i]]=target[i].
// Or maybe I've got that backwards.  It doesn't matter, since you
// won't be able to use it correctly without trying it post ways
// anyway.
function computeArrayinversion(source, target) {
  inversion = [];
  for (var i = 0; i < source.length; i++) {
    var tagname = source[i];
	var j = 0;
	while (target[j] != tagname) j++;
	inversion.push(j);
  }
  return inversion;
}

// posts: [Element name='post']
// returns: DataFrame
function fillTagFrame(dataframe, posts) {
  // This relies on the fact that:
  // 1. Flash iterates backwards, and
  // 2. Delicious returns posts in backwards order
  for (var i in posts) {
    var post = posts[i];
    var date = post.attributes['time'].split('T')[0];
    var tags = post.attributes['tag'].split(' ');
	var di = dataframe.getColumnIndex(date);
    var counts = dataframe.columns[di];
    for (var j in tags) {
      var tag = tags[j];
      var ti = dataframe.getRowIndex(tag);
      counts[ti] += 1;
    }
  }
}
