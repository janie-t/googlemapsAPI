
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street=$("#street").val();
    var city=$("#city").val();
    var address = street + ", " + city;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetView = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $body.append('<img class = "bgimg" src = "' + streetView +'">');

    //get the articles from the NY Times -first create the URL variable for later use
    var nytimesURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=f50bb26e6a854d099db476f658d98dc2'

    //this anonymous function will run as soon as the data from the NYtimes is returned.
    $.getJSON(nytimesURL, function(data){

      //Insert some extra text into the nytHeaderElem section
      $nytHeaderElem.text('New York Times Articles About ' + city);

      /*the next section goes through each article that is returned, and takes some text from it, such as the headline, and puts that in our html doc.*/
      articles = data.response.docs;
      for(var i=0; i<articles.length; i++){
        var article = articles[i];
        $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+ article.snippet + '</p>'+ '</li>');
      };
    }).error(function(e){ /*this method is chained or added on to the end of the previous method*/
      $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    //this code will grab the relevant wikipedia articles
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';

    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      //jsonp: "callback" - use this line instead of dataType if the jsonp type is different
      success: function (response) {
        var articleList = response[1];

        for (var i=0; i<articleList.length; i++){
          articleStr=articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
        };
      }
    });

    return false;
};

$('#form-container').submit(loadData);
