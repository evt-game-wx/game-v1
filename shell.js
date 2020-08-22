; (function () {
	'use strict';
	var fill = document.getElementById('fill');
	var total = 0;
	var list = [];
	var isLoading = false;

	function importScripts() {
		// $import("scripts/");

		var xhr = new XMLHttpRequest();
		xhr.open('GET', './manifest.json?v=' + Math.random(), true);
		xhr.addEventListener("load", function ()
		{
			var manifest = JSON.parse(xhr.response);
			var lst = manifest.initial.concat(manifest.game);
			list = list.concat(lst);
			total = list.length;

			$importLoaded();
		});
		xhr.send(null);
	};
	
	function $import(url) {
		var index = list.indexOf(url);
		if (index < 0) {
			total++;
			list.push(url);
			$nextImport();
		}
		else {
			console.error("重复导入：" + url);
		}
	};
	function $nextImport() {
		if (isLoading) {
			return;
		}
		isLoading = true;
		var count = 0;
		var index = 0;
		var len = list.length;
		while (index < len && count < 10) {
			var url = list.shift();
			index++;
			count++;
			loadScript(url, function () {
				index--;
				if (index < 1) {
					isLoading = false;
					$importLoaded();
				}
			});
		}
	};
	
	function loadScript(url, callback) {
		var onLoaded = function () {
			script.parentNode.removeChild(script);
			script.removeEventListener('load', onLoaded, false);
			callback();
		};
		var script = document.createElement('script');
		script.language = "javascript";
		script.type = "text/javascript";
		script.async = false;
		// script.src = url + "?_t=" + (new Date() - 0);
		script.src = url;// + "?_t=" + (new Date() - 0);
		script.addEventListener('load', onLoaded, false);
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(script);
	};

	function $importLoaded() {
		var curr = (((total - list.length) / total) * 100) >> 0;
		fill.style.width = curr + '%';
		fill.innerHTML = curr + '%';
		if (list.length < 1) {
			gameRun();
		}
		else {
			$nextImport();
		}
	};

	function loadsplash() {
		var shell = document.createElement('script');
		shell.src = "splash.js?_t=" + (new Date() - 0);
		// shell.src = "splash.js";
		var shellLoaded = function () {
		  if (shell.parentNode) {
			shell.parentNode.removeChild(shell);
		  }
		  shell.removeEventListener('load', shellLoaded, false);
		};
		shell.addEventListener('load', shellLoaded, false);
		document.body.appendChild(shell);
	  };

	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		if (window.location && window.location.search) {
			var r = window.location.search.substr(1).match(reg);
			if (r) {
				return decodeURIComponent(r[2]);//unescape
			}
		}
		return null;
	};

	function gameRun(){
		egret.runEgret({
			renderMode: "webgl", audioType: 0, calculateCanvasScaleFactor: function (context)
			{
				var backingStore = context.backingStorePixelRatio ||
					context.webkitBackingStorePixelRatio ||
					context.mozBackingStorePixelRatio ||
					context.msBackingStorePixelRatio ||
					context.oBackingStorePixelRatio ||
					context.backingStorePixelRatio || 1;
				return (window.devicePixelRatio || 1) / backingStore;
			}
		});
	}
	window.$import = $import;
	importScripts();
})();
