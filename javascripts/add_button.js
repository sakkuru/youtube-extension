if(window.WebKitIntent || window.Intent) {
  window.Intent = window.Intent || window.WebKitIntent;
  window.navigator.startActivity = window.navigator.startActivity || window.navigator.webkitStartActivity;
  window.intent = window.intent || window.webkitIntent;

  var intent
}


// video_idを取得する
var pageURL=document.URL

var params = location.search.slice(1).split("&")
, pObj = {}

for(var i = 0, l = params.length; i < l; i++) {
  var a = params[i].split("=");
  pObj[a[0]] = a[1];
}

//console.dir(pObj);

//videoのURLを取得
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
    console.log(videoUrl);

  intent = new Intent("http://webintents.org/view", "video/mp4", {
      "url": videoUrl,
      "title": data.title,
      "thumbnail_url": data.thumbnail_for_watch,
      "description": data.description

  });
}

xhr.send();



// WebIntentsのボタン追加
if(pageURL.split("/")[2] == "www.youtube.com"){

  add_webintents_button()

}


$("#wi_button").live("click", function(){
  window.navigator.startActivity(intent, null, null);
});


function add_webintents_button(){

  $("#watch-headline-title").append('<button type="button"  id="wi_button" class="yt-uix-expander-collapsed yt-uix-button yt-uix-button-default" role="button"><span class="yt-uix-button-content">invoke WebIntent</span></button>')

}


/*
function get_mp4(){

  // video_idを取得する
  var params = location.search.slice(1).split("&")
  , pObj = {}

  for(var i = 0, l = params.length; i < l; i++) {
    var a = params[i].split("=");
    pObj[a[0]] = a[1];
  }

  console.dir(pObj);

  // video_idからvideo_infoを取得する
  // ----------------------------------------------
  var url = "http://www.youtube.com/get_video_info?video_id="+pObj.v;

  // xhrでvideo_infoを取得
  var xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.onload = function(res){
    // responseを解析する
    console.dir(res);
    var infos = res.target.responseText;
    var ps = infos.split("&");

    var url_encoded_fmt_stream_map = "";
    for(var i = 0, l = ps.length; i < l; i++) {
      //console.log(ps[i])
      if(ps[i].indexOf("url_encoded_fmt_stream_map") === 0) url_encoded_fmt_stream_map = ps[i].slice(27);
    }

    console.dir(url_encoded_fmt_stream_map)

    // mp4のURL(itag=18)を取得する
    var urls = decodeURIComponent(url_encoded_fmt_stream_map).split(",")
    var url;

    console.dir(urls)

    for(var i = 0, l = urls.length; i < l; i++) {
      if(urls[i].lastIndexOf("itag=18") !== -1) url = urls[i]
    }

    url = url.slice(12)
    url = decodeURIComponent(url)

    console.log(url)

    intent = new Intent("http://webintents.org/view", "video/mp4", url);
  }

  xhr.send();
}

*/
