TagList = [];
TagMap = {};
TagElements = [];
Dates = [];
DateMap = {}; // {Date -> [tagIndex => count]}
CountArray = [];
SortedTags = [];
TagSortInverse = [];
MaxTag = 0;

var TagData = {
  processTags: function() {
    var posts = ds.data.childNodes;
    var count = 0;
    for (var i in posts) {
      var post = posts[i];
      var date = post.attributes['time'].split('T')[0];
      var tags = post.attributes['tag'].split(' ');
      var di = DateMap[date];
      if (!(di >= 0)) {
        DateMap[date] = di = Dates.length;
        Dates.push(date);
        CountArray.push([]);
      }
      var counts = CountArray[di];
      for (var j in tags) {
        var tag = tags[j];
        var ti = TagMap[tag];
        if (!(ti >= 0)) {
          TagMap[tag] = ti = TagList.length;
          TagList.push(tag);
        }
        while (counts.length <= ti) counts.push(0);
        c = counts[ti] += 1;
        if (c > MaxTag) MaxTag = c;
      }
    }
    
    SortedTags = [].concat(TagList);
    SortedTags.sort();
    TagSortInverse = [];
    for (var i = 0; i < SortedTags.length; i++) {
      var tagname = SortedTags[i];
      var j = 0;
      while (TagList[j] != tagname) j++;
      TagSortInverse.push(j);
    }
  },
  
  tagTotals: function (a, b) {
    var tagCounts = [];
    for (var i = a; i < b; i++) {
      var column = CountArray[i];
      for (var t = 0; t < column.length; t++) {
        while (t >= tagCounts.length) tagCounts.push(0);
        tagCounts[t] += column[t];
      }
    }
    while (tagCounts.length < TagList.length) tagCounts.push(0);
    return tagCounts;
  },
  
  dateSums: function () {
    var sums = [];
    for (var i = 0; i < CountArray.length; i++) {
      var column = CountArray[i];
      var sum = 0;
      for (var t = 0; t < column.length; t++) {
        sum += column[t];
      }
      sums.push(sum);
    }
    return sums;
  }
}
