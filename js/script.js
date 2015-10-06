String.prototype.endsWith = function(suffix) {
	if (this.length < suffix.length)
		return false;
	return this.lastIndexOf(suffix) === this.length - suffix.length;
}

chrome.storage.sync.get({
	theme: "default.css",
	customCSS: ""
}, function(items) {
	function listener() {
		var style = document.createElement("style");

		style.setAttribute("type", "text/css");

		if (style.styleSheet) {
			style.styleSheet.cssText = this.responseText;
		} else {
			style.appendChild(document.createTextNode(this.responseText));
		}

		document.getElementsByTagName("head")[0].appendChild(style);

		style = document.createElement("style");
		style.setAttribute("type", "text/css");

		if (style.styleSheet) {
			style.styleSheet.cssText = items.customCSS;
		} else {
			style.appendChild(document.createTextNode(items.customCSS));
		}

		document.getElementsByTagName("head")[0].appendChild(style);
	};

	var request = new XMLHttpRequest();
	request.addEventListener("load", listener);
	request.open("GET", chrome.extension.getURL("themes/" + items.theme));
	request.send();
});

var pre = document.getElementsByTagName("pre")[0];
var content = pre.innerHTML;
var language = window.location.href.endsWith(".js") ? "javascript" : "css";

pre.innerHTML = "<code class='" + language + "'>" + content + "</code>";

hljs.highlightBlock(document.getElementsByTagName("code")[0])