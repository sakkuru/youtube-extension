// Change UserAgent as iPad, if request is for m.youtube.com ( to obtain mpeg4 url from youtube )
// Hook XMLHttpRequest.
// This script is for background script only.

var UA = "Mozilla/5.0(iPad; U; CPU OS 4_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F191 Safari/6533.18.5";

var description = null;

var requestFilter = {
    urls: ["*://m.youtube.com/*"],
    types:[
          //   "main_frame",
          //   "sub_frame",
            "xmlhttprequest"
        ]
},
extraInfoSpec = ['requestHeaders', 'blocking'],

handler = function (details) {
  if (UA == null) {
    return;
  }
  var uaFound = false;
  for (var i = 0, l = details.requestHeaders.length; i < l; ++i) {
    if (details.requestHeaders[i].name == 'User-Agent') {
      details.requestHeaders[i].value = UA;
      uaFound = true;
      break;
    }
  }

  if(!uaFound){
    details.requestHeaders.push({
      name: "User-Agent",
      value: UA
    });
  }

  return {requestHeaders:details.requestHeaders};
};

chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);


