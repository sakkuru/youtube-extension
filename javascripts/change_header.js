

// http://developer.chrome.com/extensions/webRequest.html


var UA = "Mozilla/5.0(iPad; U; CPU OS 4_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F191 Safari/6533.18.5";

var description = null;

var requestFilter = {
    urls: ["*://m.youtube.com/*"],
    types:[
            "main_frame",
            "sub_frame",
            "xmlhttprequest"
        ]
},
extraInfoSpec = ['requestHeaders', 'blocking'],

handler = function (details) {

	console.log(details)

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


	console.log(details)


    return {requestHeaders:details.requestHeaders};
};


chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);


