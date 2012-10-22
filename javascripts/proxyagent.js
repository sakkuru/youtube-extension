if(location.href.indexOf('#webkitIntentProxy') !== -1) {
	var scr = document.createElement('script')
	scr.src = 'http://komachu.sakura.ne.jp/webintents/proxy.js'
	document.body.appendChild(scr);
	/*
  window.addEventListener('message', function(e){
    	console.dir(e);
    	port = e.ports[0];

		if(!!window.webkitIntent === false) {
			window.webkitIntent = {};
			console.log('false')
			console.dir(window.webkitIntent)
			window.webkitIntent.postResult = function(data){
				port.postMessage(port);
				window.close();
			}
			document.querySelector('button').innerText = 'changed'
		}
  }, false);
	*/
}
