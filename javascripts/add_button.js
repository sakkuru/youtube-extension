var getMpeg4Url = function(callback) {
  // obtain video id
  var pageURL=document.URL

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
  }

  xhr.send();
}


// start processing
if(document.URL.split("/")[2] == "www.youtube.com"){
  getMpeg4Url(function(res) {
    console.log(res)
  });
}

