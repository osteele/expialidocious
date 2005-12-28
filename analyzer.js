var DataFrame = function() {
  this.rowNames = [];
  this.columnNames = [];
  this.columns = [];
};

DataFrame.prototype = {
  processTags: function(data) {
    var posts = data.childNodes;
    var count = 0;
    var max = 0;
    var dateMap = {}; // {Date -> [tagIndex => count]}
    var tagMap = {}
    for (var i in posts) {
      var post = posts[i];
      var date = post.attributes['time'].split('T')[0];
      var tags = post.attributes['tag'].split(' ');
      var di = DateMap[date];
      if (!(di >= 0)) {
        DateMap[date] = di = this.columnNames.length;
        this.columnNames.push(date);
        this.columns.push([]);
      }
      var counts = this.columns[di];
      for (var j in tags) {
        var tag = tags[j];
        var ti = tagMap[tag];
        if (!(ti >= 0)) {
          tagMap[tag] = ti = this.rowNames.length;
          this.rowNames.push(tag);
        }
        while (counts.length <= ti) counts.push(0);
        c = counts[ti] += 1;
        if (c > max) max = c;
      }
    }
    this.max = max; // not used
  },
  
  tagTotals: function (a, b) {
    var tagCounts = [];
    for (var i = a; i < b; i++) {
      var column = this.columns[i];
      for (var t = 0; t < column.length; t++) {
        while (t >= tagCounts.length) tagCounts.push(0);
        tagCounts[t] += column[t];
      }
    }
    while (tagCounts.length < this.rowNames.length) tagCounts.push(0);
    return tagCounts;
  },
  
  dateSums: function () {
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
  },
  
  tagsForDate: function (day) {
		var tags = {};
		var tagCounts = this.columns[day];
		for (var i = 0; i < tagCounts.length; i++) {
			if (tagCounts[i])
				tags[this.rowNames[i]] = tagCounts[i];
		}
		return tags;
	}
}
