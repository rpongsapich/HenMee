var default_prefs = {
	"topMenu": {title: "Top Menu", type:"checkbox", value:true},
	"cleanBrowse": {title: "Cleaner browse page", type:"checkbox", value:true},
	"autoResizeImageLinks": {title: "Auto-resize images and links", type:"checkbox", value:true},
	"maxAutoResizeWidth": {title: "&nbsp;&nbsp;&raquo; Max auto-resized images and links width (pixels)", type:"number", value:500},
	"titleFix": {title: "Show actual topic title", type:"checkbox", value:true},
	"revealLinks": {title: "Show all links in comment", type:"checkbox", value:true},
	"hideSignature": {title: "Hide signature", type:"checkbox", value:false},
	"formatUserHistory": {title: "Hide comment in post history", type:"checkbox", value:true},
	"quickReply": {title: "Quick reply box", type:"checkbox", value:true},
	"openNewTab": {title: "Open links in new tab", type:"checkbox", value:true},
	"resizePet": {title: "Resize pet image", type: "checkbox", value:true},
	"unlockWidth": {title: "Unlock table width", type: "checkbox", value:true},
	"superBrowse": {title: "Torrent shortcut", type: "checkbox", value:true}
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {	
		case "getPrefs":
			var prefs = JSON.parse(localStorage['prefs'] || JSON.stringify(default_prefs));
			sendResponse(prefs);
		break;
		case "setPref":
			var prefs = JSON.parse(localStorage['prefs'] || JSON.stringify(default_prefs));
			prefs[request.item].value = request.value;
			localStorage['prefs'] = JSON.stringify(prefs);
			sendResponse(prefs[request.item].value);
		break;
	}
});