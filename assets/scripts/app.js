// Setting elements
var es = {}; // Elements array
['output',
  'input'
].forEach(function(element, index, array) {
  es[element] = document.getElementById(element);
})

// Style stuff
input.onfocus = function() {
  input.classList.add("in");
  input.classList.remove("out");
}
input.onblur = function() {
  input.classList.remove("in");
  input.classList.add("out");
}

// Algolia login
var client = algoliasearch("#", "#");
var index = client.initIndex('covid19-tweets01042020');

// Search
es['input'].onkeyup = function() {
  if (es['input'].value.length) {
    index.search(es['input'].value, function searchDone(err, content) {
      if (err) {
        console.error(err);
        return;
      }

      if(content && content.hits.length) {
        var list = content.hits.map(function(e,i,a) {
           return "<li>" + e._highlightResult.tweets.value + '</i>' + '</li>';
        }).join('');
        es['output'].innerHTML = "<h5><b>Completed in " + content.processingTimeMS + "ms</b></h5><ul>" + list + '</ul>';
      } else {
        es['output'].innerHTML = "<h5><b>No matches found</b></h5>";
      }
    })
  } else {
    es['output'].innerHTML = "";
  }
}
