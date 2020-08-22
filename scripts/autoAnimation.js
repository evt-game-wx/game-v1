"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var images = require("images");
var nodeCmd = require("node-cmd");

var jsonDir = "../../H5MTResource/resource/animation/effect";
var effectStr = "1004_effect,1005_effect,1006_effect,1007_effect,1008_effect,1009_effect,1010_effect,1011_effect,5001_effect,1020_effect,1023_effect,3024_effect,7003_effect,7015_effect,7016_effect,7017_effect,7021_effect,7023_effect,7031_effect,7034_effect,7037_effect,7039_effect,7042_effect,7043_effect,7046_effect,7048_effect,7052_effect,7059_effect,7060_effect,7061_effect,7066_effect,7071_effect,7086_effect,7089_effect,7091_effect,7092_effect,7094_effect,7095_effect,7099_effect,7101_effect,7107_effect,4020_effect,7118_effect,7134_effect,8005_effect,8007_effect,8008_effect,8011_effect,8012_effect,11001_effect,11002_effect,11003_effect,11004_effect,11005_effect,11006_effect,11007_effect,11008_effect,11009_effect,11010_effect,8031_effect";
var effectNames = effectStr.split(",");
var effectIndex = 0;
var md5Dic = {time:0,files:{}};

var loop_json_file = function (resJson) {
	// 判断是否是res.json文件
	if (fs.existsSync(resJson)) {
		let filePath = resJson.replace(".json","");
		let pngPath = filePath + ".png";
		let outPath = filePath + "_f.png";
		let fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
		
		if (effectNames.indexOf(fileName) != -1){
			console.log("none:" + fileName);
			return;
		}
		if (!fs.existsSync(pngPath)) {
			return;
		}
		var info = fs.statSync(pngPath);
		var pngTime = info.mtime.getTime();
		if (md5Dic.files[fileName] == pngTime){
			return;
		}
		md5Dic.files[fileName] = pngTime;
		try{
			var defaultJson = fs.readFileSync(resJson, "utf-8");
			var json = JSON.parse(defaultJson);
			if (!json.harf){
				json.harf = true;
				fs.writeFileSync(resJson, JSON.stringify(json));
			}
			console.log("json :",resJson);
			let pngData = images(pngPath); //Load image from file 
			let pngWidth = pngData.width();
			let pngHeight = pngData.height();
			pngData.resize(pngWidth>>1,pngHeight>>1)//Geometric scaling the image to 400 pixels width
			.save(outPath, {               //Save the image to a file,whih quality 50
				quality : 100                    //保存图片到文件,图片质量为50
			});
			theadPngQuant(outPath, effectIndex++);
			//images.gc();
		}
		catch(e){
			console.log("josn error:",resJson);
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
		} else if (ele.indexOf(".json") != -1){
			//console.log("file: " + ele, info)
			loop_json_file(filePath);
		}
	})
}
var md5DataFile = "md5_effect.json";
function checkEffect(){
	var md5Path = jsonDir + "/" + md5DataFile;
	//在输出目录存在md5码对应文件，则读取
	if (fs.existsSync(md5Path)){
		var md5Str = fs.readFileSync(md5Path, "utf-8");
		md5Dic = JSON.parse(md5Str);
	}
	md5Dic.time = Date().toString();
	readDirSync(jsonDir);

	//写缓存文件
	if (effectIndex > 0){
		fs.writeFileSync(md5Path, JSON.stringify(md5Dic));
	}
}
checkEffect();

function theadPngQuant(outPath, index){
	var cmdPath = __dirname + "/pngquant.exe --force --verbose "+ outPath +" -o " + outPath;
	nodeCmd.get(  
		cmdPath,  
		function(err, data, stderr){  
			if (err)console.log("png/pngquant.exe failure");
			else console.log("png8 convert:",outPath);
			// else console.log(stderr);
		}  
	);
	nodeCmd.run('pngquant' + index);
}
