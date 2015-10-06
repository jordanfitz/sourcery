var customLoaded = false;

var getJSON = function(url, success, error) {
	var xhr = new XMLHttpRequest();

	xhr.open("get", url, true);
	xhr.responseType = "json";

	xhr.onload = function() {
		if (xhr.status === 200) {
			success(xhr.response);
		} else {
			error(xhr.status);
		}
	};

	xhr.send();
};

var saveOptions = function() {
	chrome.storage.sync.set({
		theme: document.getElementById("theme").value,
		customCSS: document.getElementById("custom").value
	}, function() {
		document.getElementById("status").textContent = "Options saved.";

		setTimeout(function() {
			document.getElementById("status").textContent = "";
		}, 1000);
	});
};

var getOptions = function() {
	getJSON(chrome.extension.getURL("themes.json"), function(data) {
		for (var i = 0; i < data.themes.length; i++) {
			var theme = data.themes[i];
			var option = document.createElement("option");

			option.value = theme;
			option.textContent = theme;

			document.getElementById("theme").appendChild(option);
		}

		chrome.storage.sync.get({
			theme: "default.css",
			customCSS: ""
		}, function(items) {
			document.getElementById("theme").value = items.theme;
			document.getElementById("custom").value = items.customCSS;

			hljs.highlightBlock(document.getElementById("js-preview"));
			hljs.highlightBlock(document.getElementById("css-preview"));

			themeChanged();
		});
	}, function() {});
};

var themeChanged = function() {
	function listener() {
		var style;

		if (document.getElementById("theme-style") === null) {
			style = document.createElement("style");

			style.setAttribute("type", "text/css");
			style.setAttribute("id", "theme-style");

			if (style.styleSheet) {
				style.styleSheet.cssText = this.responseText;
			} else {
				style.innerHTML = "";
				style.appendChild(document.createTextNode(this.responseText));
			}

			document.getElementsByTagName("head")[0].appendChild(style);
		} else {
			style = document.getElementById("theme-style");

			if (style.styleSheet) {
				style.styleSheet.cssText = this.responseText;
			} else {
				style.innerHTML = "";
				style.appendChild(document.createTextNode(this.responseText));
			}
		}

		if (!customLoaded) customChanged();
	};

	var request = new XMLHttpRequest();
	request.addEventListener("load", listener);
	request.open("GET", chrome.extension.getURL("themes/" + document.getElementById("theme").value));
	request.send();
}

var customChanged = function() {
	customLoaded = true;

	if (document.getElementById("custom-style") === null) {
		style = document.createElement("style");
		style.setAttribute("type", "text/css");
		style.setAttribute("id", "custom-style");

		if (style.styleSheet) {
			style.styleSheet.cssText = document.getElementById("custom").value;
		} else {
			style.innerHTML = "";
			style.appendChild(document.createTextNode(document.getElementById("custom").value));
		}

		document.getElementsByTagName("head")[0].appendChild(style);
	} else {
		style = document.getElementById("custom-style");

		if (style.styleSheet) {
			style.styleSheet.cssText = document.getElementById("custom").value;
		} else {
			style.innerHTML = "";
			style.appendChild(document.createTextNode(document.getElementById("custom").value));
		}
	}
};

document.addEventListener('DOMContentLoaded', getOptions);
document.getElementById('save').addEventListener('click', saveOptions);

document.getElementById("custom").onkeyup = customChanged;
document.getElementById("theme").onchange = themeChanged;