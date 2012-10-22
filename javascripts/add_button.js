if(window.WebKitIntent || window.Intent) {
  window.Intent = window.Intent || window.WebKitIntent;
  window.navigator.startActivity = window.navigator.startActivity || window.navigator.webkitStartActivity;
  window.intent = window.intent || window.webkitIntent;
}

var getMpeg4Url = function(callback) {
  // obtain video id
  var pageURL=document.URL
    , intent;

  var params = location.search.slice(1).split("&")
  , pObj = {}

  for(var i = 0, l = params.length; i < l; i++) {
    var a = params[i].split("=");
    pObj[a[0]] = a[1];
  }

  // if cannot obtain video id, simply return
  if(!!pObj.v === false) return;

  // obtain video url for Mpeg4
  var xhr = new XMLHttpRequest();
  var url = "http://m.youtube.com/watch?ajax=1&layout=mobile&tsp=1&utcoffset=540&v=" + pObj.v + "&preq="
  xhr.open("get", url);
  xhr.onload = function(e) {

    var data = JSON.parse(e.target.responseText.slice(4)).content.video;
    console.dir(data);

    var urls = JSON.parse(e.target.responseText.slice(4)).content.video.fmt_stream_map
    var videoUrl
    for(var i = 0, l = urls.length; i < l; i++) {
      if(urls[i].itag==18) videoUrl = urls[i].url
    }

    intent = new Intent("http://webintents.org/view", "video/mp4", {
        "url": videoUrl,
        "title": data.title,
        "thumbnail_url": data.thumbnail_for_watch,
        "description": data.description

    });
    callback(intent);
  }

  xhr.send();
}

function add_webintents_button(intent){
  $('<button type="button"  id="wi_button" class="yt-uix-expander-collapsed yt-uix-button yt-uix-button-default" role="button"><span class="yt-uix-button-content">invoke WebIntent</span></button>')
    .appendTo("#watch-headline-title")
    .bind("click", function(){
        window.navigator.startActivity(intent, null, null);
    });
}


// start processing
if(document.URL.split("/")[2] == "www.youtube.com"){
  getMpeg4Url(function(intent) {
    add_webintents_button(intent)
  });
}

