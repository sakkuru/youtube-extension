// Obtaining YouTube URL
//////////////////////////////////////////////////////////////////////
var targets = [
  "www.youtube.com"
];

var isTarget = function(callback){
  chrome.tabs.query({active: true}, function(tabs) {
    var match = {};

    tabs.forEach(function(tab) {
      targets.forEach(function(target) {
        if (tab.url.indexOf("http://"+target) === 0 || tab.url.indexOf("https://"+target) === 0) {
          match[target] = tab.url;
        }
      });
    });
    if(typeof(callback) === "function") {
      callback(match);
    } else {
      console.log(match);
    }
  });
}

var getMpeg4Url = function(url, callback) {
  var params = url.split("?")[1].split("&")
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
  var res = {};
  xhr.open("get", url);
  xhr.onload = function(e) {

    var data = JSON.parse(e.target.responseText.slice(4)).content.video;
    console.dir(data);
    res.thumbnail = data.thumbnail_for_watch;
    res.title = data.title;


    var urls = JSON.parse(e.target.responseText.slice(4)).content.video.fmt_stream_map
    for(var i = 0, l = urls.length; i < l; i++) {
      if(urls[i].itag==18) res.videoUrl = urls[i].url
    }

    if(typeof(callback) === "function") {
      callback(res);
    } else {
      console.log("res", res);
    }
  }

  xhr.send();
}

var obtain = function(callback){
  isTarget(function(match){
    if(match.hasOwnProperty("www.youtube.com")) {
      getMpeg4Url(match["www.youtube.com"], function(res){
        if(!!res === true) {
          $("h2#title").text(res.title);
          $("#img").html("<img src='"+res.thumbnail+"'>");
          $("#media-url").val(res.videoUrl);
          $(".search button").attr("disabled", false);
          if(typeof(callback) === "function") {
            callback(res);
          }
        } else {
          $("h1").text("can't find...");
          $("#media-url").val("can't find");
        }
      });
    } else {
      $("#alert").text("Current page isn't YouTube...");
    }
  });
}
// [FINISH]Obtaining YouTube URL
//////////////////////////////////////////////////////////////////////



// [BEGIN] Connect Web OS via WebRTC (DataChannel)
//////////////////////////////////////////////////////////////////////
var Connection = {}

Connection.start = function(url){
  this.ws = new WebSocket("ws://localhost:3000/"); // Demo only
  this.media_url = url;
  this.init = true;

  var self = this;
  this.ws.onopen = function(e){
    self.setHandler();
  }
}

var device_template = "<label class='radio'><input type='radio' data-avurl='${avurl}' data-rcurl='${rcurl}'>${title}</label><br>";

Connection.setHandler = function() {
  var self = this;
  $(".op button").click(function(ev){
    ev.preventDefault();
    var method = $(this).attr("id");
    var mesg = {
      "type": "request",
      "init": self.init,
      "method": method,
      "avurl": self.avurl,
      "rcurl": self.rcurl,
      "media_url": self.media_url
    };
    self.ws.send(JSON.stringify(mesg));

    if(method === "play" && self.init) self.init = false;
  });

  $(".search button").click(function(ev){
    ev.preventDefault();
    var mesg = {"type": "request", "method": "search"};
    $(".search form").html("<img src='/images/ajax-loader.gif'> Start discovery...");
    self.ws.send(JSON.stringify(mesg));
  });

  $(".op #volume").click(function(ev){
    var volume = $(this).val();
    var mesg = {"type": "request", "method": "volume", "data": volume};
    self.ws.send(JSON.stringify(mesg));
  });


  self.ws.onmessage = function(ev){
    var mesg = JSON.parse(ev.data);
    if(mesg.type !== "response") return;
    console.log(mesg);

    switch(mesg.method) {
    case "search":
      $(".search form").empty();
      mesg.data.forEach(function(device){
        var str = device_template
          .replace("${avurl}", device.controlUrls['urn:schemas-upnp-org:service:AVTransport:1'])
          .replace("${rcurl}", device.controlUrls['urn:schemas-upnp-org:service:RenderingControl:1'])
          .replace("${title}", device.friendlyName)
        $(".search form").append(str);
      });

      $(".search input[type=radio]").click(function(ev){
        self.avurl = $(this).data('avurl');
        self.rcurl = $(this).data('rcurl');
        $(".op button").attr("disabled", false);
      });

      break;
    case "volume":
      $(".op #volume").val(mesg.data);
      break;
    default:
      console.log("unknown method => "+ mesg.method);
    }
  }

}

// [FINISH] Connect Web OS via WebRTC (DataChannel)
//////////////////////////////////////////////////////////////////////

var main = function(){
  obtain(function(url) {
    console.log(url);
    Connection.start(url);
  });
}
main();

