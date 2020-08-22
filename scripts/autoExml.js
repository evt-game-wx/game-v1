"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var exmlDir = "resource/game_skin";
// var exmlDir = "resource/game_skin/achievement";
var tempindex = 0;

var match_exml_file = function (defaultExml, reg, regs1) {
	var mats1;
	var newStr;
	var oldStr;
	var matArr = defaultExml.match(reg);
	if (matArr){
		//console.log("matArr:", matArr);
		var len = matArr.length;
		for(var i = 0; i < len;i++){
			oldStr = matArr[i];
			if (oldStr.lastIndexOf(".") != -1){
				mats1 = oldStr.match(regs1);
				if (mats1){
					newStr = String(mats1[0]).replace(mats1[1], parseInt(mats1[1]));
					defaultExml = defaultExml.replace(oldStr, newStr);
				}
				tempindex = 1;
			}
		}
	}
	return defaultExml;
};

var remove_exmlprop_file = function (defaultExml, reg, regs1, defaultValue) {
	var mats1;
	var newStr;
	var oldStr;
	var matArr = defaultExml.match(reg);
	if (matArr){
		//console.log("matArr:", matArr);
		var len = matArr.length;
		for(var i = 0; i < len;i++){
			oldStr = matArr[i];
			mats1 = oldStr.match(regs1);
			if (mats1 && mats1.length > 1){
				if (parseInt(mats1[1]) == defaultValue){
					defaultExml = defaultExml.replace(oldStr, "");
					tempindex = 1;
				}
			}
		}
	}
	return defaultExml;
};

var loop_exml_file = function (resExml) {
	// 判断是否是res.json文件
	tempindex = 0;
	if (fs.existsSync(resExml)) {
		var defaultExml = fs.readFileSync(resExml, "utf-8");

		//去除属性值存在小数，转成整数
		defaultExml = match_exml_file(defaultExml, /x=\"(\S*?)\"/g, /x=\"(\S*?)\"/);
		defaultExml = match_exml_file(defaultExml, /y=\"(\S*?)\"/g, /y=\"(\S*?)\"/);
		defaultExml = match_exml_file(defaultExml, /anchorOffsetX=\"(\S*?)\"/g, /anchorOffsetX=\"(\S*?)\"/);
		defaultExml = match_exml_file(defaultExml, /anchorOffsetY=\"(\S*?)\"/g, /anchorOffsetY=\"(\S*?)\"/);
		defaultExml = match_exml_file(defaultExml, /verticalCenter=\"(\S*?)\"/g, /verticalCenter=\"(\S*?)\"/);
		defaultExml = match_exml_file(defaultExml, /horizontalCenter=\"(\S*?)\"/g, /horizontalCenter=\"(\S*?)\"/);
		defaultExml = match_exml_file(defaultExml, /width=\"(\S*?)\"/g, /width=\"(\S*?)\"/);
		defaultExml = match_exml_file(defaultExml, /height=\"(\S*?)\"/g, /height=\"(\S*?)\"/);

		//去除默认值属性
		//defaultExml = remove_exmlprop_file(defaultExml, /x=\"(\S*?)\"/g, /x=\"(\S*?)\"/, 0);//selectIndex="0"得过滤
		defaultExml = remove_exmlprop_file(defaultExml, /y=\"(\S*?)\"/g, /y=\"(\S*?)\"/, 0);
		defaultExml = remove_exmlprop_file(defaultExml, /anchorOffsetX=\"(\S*?)\"/g, /anchorOffsetX=\"(\S*?)\"/, 0);
		defaultExml = remove_exmlprop_file(defaultExml, /anchorOffsetY=\"(\S*?)\"/g, /anchorOffsetY=\"(\S*?)\"/, 0);
		defaultExml = remove_exmlprop_file(defaultExml, /scaleX=\"(\S*?)\"/g, /scaleX=\"(\S*?)\"/, 1);
		defaultExml = remove_exmlprop_file(defaultExml, /scaleY=\"(\S*?)\"/g, /scaleY=\"(\S*?)\"/, 1);
		defaultExml = remove_exmlprop_file(defaultExml, /alpha=\"(\S*?)\"/g, /alpha=\"(\S*?)\"/, 1);
		
		// 根据tmproject写入文件
		if (tempindex == 1){
			fs.writeFileSync(resExml, defaultExml);
			console.log("write file: " + resExml);
		}
	}
};

function readDirSync(exmlDir) {
	var pa = fs.readdirSync(exmlDir);
	pa.forEach(function (ele, index) {
		var filePath = exmlDir + "/" + ele;
		var info = fs.statSync(filePath)
		if (info.isDirectory()) {
			//console.log("dir: " + ele)
			readDirSync(exmlDir + "/" + ele);
		} else if (ele.indexOf(".exml") != -1){
			//console.log("file: " + ele, info)
			loop_exml_file(filePath);
		}
	})
}

readDirSync(exmlDir)