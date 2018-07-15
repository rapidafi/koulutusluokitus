var clipboard = new Clipboard('.clip');
clipboard.on('success', function(e) {
  e.clearSelection();
});
clipboard.on('error', function(e) {
  console.log(e);
});

// Credits: http://stackoverflow.com/a/7075589
function findItem(arr, propName, propValue) {
  //console.debug("findItem "+propName+" "+propValue)
  for (var i=0; i < arr.length; i++) {
    //console.debug("findItem arr for "+i+" "+arr[i][propName]+"=="+propValue)
    if (arr[i][propName] == propValue) {
      return arr[i];
    }
  }
  // will return undefined if not found; you could return a default instead
}
// Credits: http://stackoverflow.com/a/979995
var QueryString = function () {
  //console.debug("QueryString")
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();
