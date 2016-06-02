/*
 * Loads the selected theme's CSS, along with any custom
 * CSS applied in the options.
 */
function loadTheme() {
	chrome.storage.sync.get({
		theme: "default.css",
		customCSS: ""
	}, function(items) {
		function listener() {
			var style = document.createElement("style");
			style.type = "text/css";

			if (style.styleSheet) {
				style.styleSheet.cssText = this.responseText;
			} else {
				style.appendChild(document.createTextNode(this.responseText));
			}

			document.head.appendChild(style);

			style = document.createElement("style");
			style.type = "text/css";

			if (style.styleSheet) {
				style.styleSheet.cssText = items.customCSS;
			} else {
				style.appendChild(document.createTextNode(items.customCSS));
			}

			document.head.appendChild(style);
		};

		var request = new XMLHttpRequest();
		
		request.addEventListener("load", listener);
		request.open("GET", chrome.extension.getURL("themes/" + items.theme));
		request.send();
	});
}

function init() {
	/*
	 * Code adapted from JSONView.
	 * https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc
	 */

	if(document.body && (document.body.children.length === 1 && document.body.children[0].tagName === "PRE")) {
		loadTheme();

		var pre = document.body.children[0];
		var content = pre.innerHTML;

		pre.innerHTML = "<code id=\"sourcery\">" + content + "</code>";

		hljs.highlightBlock(document.getElementById("sourcery"));
	}
}

init();