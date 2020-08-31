//合并js文件,减小http请求
//cnpm install gulp gulp-concat gulp-uglify node-cmd node-zip del
var gp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var JSZip = require("node-zip");
var fs = require("fs");
var del = require('del');
var crypto = require("crypto");
//var images = require("images");
var cdnResPath;
var outPath;
var fileSuffixs = ["json","png","jpg","bin","mp3","js","fnt"];
var md5Dic = {defaultVersion:0,files:{}};//files:{path:xxxx.png,md5:xxxx,version:1},
var md5DataFile = "md5_data.json";

initCfg();

//读取配置文件
function initCfg() {
	var data = fs.readFileSync('config.json');
	var str = data.toString();
	var globalre = /\\/g;
	str = str.replace(globalre, "/");
	var json = JSON.parse(str);
	cdnResPath = json.cdnResPath;
	outPath = json.outPath;
}

function libs(){
    // 把1.js和2.js合并为main.js，输出到dest/js目录下
	//gp.src(['1.js','2.js']).pipe(concat('main.js')).pipe(gp.dest('./dest/js'));
    let stream = gp.src([
		'./js/egret.min.js',
        './js/jszip.min.js',
        './js/eui.min.js',
        './js/assetsmanager.min.js',
        './js/tween.min.js',
        './js/socket.min.js',
        './js/game.min.js',
        './js/md5.min.js',
        './js/mobile-detect.min.js',
        './js/egret.web.min.js',
        './js/promise.min.js',
	]).pipe(concat('libs.min.js')).pipe(gp.dest('./js'));
	return stream;
}

//运行gulp命令
//gulp default或者gulp
function game_login(){
    // 把1.js和2.js合并为main.js，输出到dest/js目录下
	//gp.src(['1.js','2.js']).pipe(concat('main.js')).pipe(gp.dest('./dest/js'));
    let stream = gp.src([
		'./js/egret.min.js',
        './js/jszip.min.js',
        './js/eui.min.js',
        './js/assetsmanager.min.js',
        './js/tween.min.js',
        './js/socket.min.js',
        './js/game.min.js',
        './js/md5.min.js',
        './js/mobile-detect.min.js',
        './js/egret.web.min.js',
        './js/promise.min.js',
        './js/protobuf-library.min.js',
        './js/login.thm.js',
        './js/login.min.js'
	]).pipe(concat('libs-login.min.js')).pipe(gp.dest('./js'));
	return stream;
}

function game_main(){
    // 把1.js和2.js合并为main.js，输出到dest/js目录下
	//gp.src(['1.js','2.js']).pipe(concat('main.js')).pipe(gp.dest('./dest/js'));

    let stream = gp.src([
		'./js/protobuf-bundles.min.js',
        './js/default.thm.min.js',
        './js/main.min.js'
	]).
	pipe(concat('main-game.min.js')).pipe(gp.dest('./js'))
	
	// pipe(concat('egret.login.js')).pipe(uglify()).pipe(gp.dest('./js'))


	//done();
	// gp.pipe(uglify());
	return stream;

}

function main(){
    let stream = gp.src([
		'./js/protobuf-bundles.min.js',
		'./js/default.thm.min.js',
		'./js/main.min.js'
	]).
	pipe(concat('main-game.min.js')).pipe(gp.dest('./js'))
	return stream;

}

function uglifyTest(){
	let stream = gp.src(["js/egret.login.js"]).pipe(uglify());
	return stream;
}


function clean(){
    return del(['./node_modules','./package.json','./package-lock.json']);
}

/** 循环读取所有文件列表 */
function readDirSync(exmlDir, fileArr) {
	console.log("exmlDir:"+exmlDir);
	var pa = fs.readdirSync(exmlDir);
	pa.forEach(function (ele, index) {
		if (ele == "gulpfile.js" || ele == "config.json" || ele == "configbak.json"){
			return;
		}
		var filePath = exmlDir + "/" + ele;
		var info = fs.statSync(filePath);
		if (info.isDirectory()) {			
			readDirSync(exmlDir + "/" + ele, fileArr);
		} else{
			var suffix = ele.substring(ele.lastIndexOf(".") + 1);
			if (fileSuffixs.indexOf(suffix) != -1){
				console.log("file: " + filePath, info.mtime.getTime())
				fileArr.push({name:ele, path:filePath, time:info.mtime.getTime()});
			}
		}
	})
}

/** 增加版本号 */
function resourceMd5(addVersion, callback){	
	var newMd5Dic = {};
	var md5Path = outPath + "/" + md5DataFile;
	//在输出目录存在md5码对应文件，则读取
	if (fs.existsSync(md5Path)){
		var md5Str = fs.readFileSync(md5Path, "utf-8");
		md5Dic = JSON.parse(md5Str);
	}
	var newVersion = 1;
	var defaultVersion = md5Dic.defaultVersion;
	if (addVersion){
		defaultVersion++;
		md5Dic.defaultVersion = defaultVersion;
	}
	var resFileArr = [];
	md5MakeDir(outPath);
	readDirSync(cdnResPath, resFileArr);
	console.log("dir: " + cdnResPath);
	readDirSync(".", resFileArr);
	console.log("dir: " + __dirname);
	if (resFileArr.length == 0){
		callback(null,null);
		return;
	}
	var fileCount = 0;
	var newCount = 0;
	for(var obj of resFileArr){
		var path = obj.path;
		var resourceIndex = path.indexOf("/resource/");
		if (-1 != resourceIndex){
			path = path.substring(resourceIndex + 1);
		}
		resourceIndex = path.indexOf("/js/");
		if (-1 != resourceIndex){
			path = path.substring(resourceIndex + 1);
		}
		obj.pathKey = path;
		fileCount++;
		getFileMd5(obj.path, obj, function(error, md5, obj) {
			var path = obj.pathKey;
			var fileObj = md5Dic.files[path];
			if(fileObj){
				if (fileObj.time != obj.time){
					fileObj.time = obj.time;//最后修改时间
					if (fileObj.md5 != md5){
						fileObj.md5 = md5;
						fileObj.version = defaultVersion;
						newMd5Dic[path] = {ver:defaultVersion, source:obj.path};
						newCount++;
						console.log("file md5 change:", path);
					}else{
						console.log("file time change:", path);
					}
				}
			}
			else{
				md5Dic.files[path] = {time:obj.time, version:newVersion, md5:md5};
				newMd5Dic[path] = {ver:newVersion, source:obj.path};
				newCount++;
			}
			fileCount--;
			if (fileCount == 0){
				if (newCount > 0){
					callback(newMd5Dic, defaultVersion);
				}
				else{
					callback(null,null);
				}
			}
		});
	}
}

/** 根据path创建文件夹，否则写入文件会报错  */
function md5TargetMakeDir(root, targetPath){
	var index = targetPath.indexOf("/");
	if (index == -1){
		return;
	}
	var prePath = targetPath.substring(0, index);
	targetPath = targetPath.substring(index + 1);
	md5MakeDir(root + "/" + prePath);
	md5TargetMakeDir(root + "/" + prePath, targetPath);
}

function md5MakeDir(dirPath){
	if (!fs.existsSync(dirPath)){
		fs.mkdirSync(dirPath);
	}
}

/** 增加版本号 */
function genMd5Version(addVersion, callback){
	var time = Date.now();
	resourceMd5(addVersion, function(newMd5Dic, defaultVersion){
		if (newMd5Dic == null){
			console.log("no file change don't to version!");
			callback();
			return;
		}
		var addDir = "add";
		var date = new Date();
		addDir = addDir+date.getFullYear()+""+date.getMonth()+1+""+ date.getDate()+""+date.getHours()+""+date.getMinutes();
		var verPath = outPath + "/ver/";
		var addPath = outPath + "/" + addDir + "/";
		var md5Path = outPath + "/" + md5DataFile;
		md5MakeDir(verPath);
		md5MakeDir(addPath);
		addPath += "ver/";
		md5MakeDir(addPath);
		md5MakeDir(verPath + defaultVersion);
		md5MakeDir(addPath + defaultVersion);

		//写入md5码对应该json文件md5_data.json
		var md5Data = JSON.stringify(md5Dic);
		fs.writeFileSync(md5Path, md5Data);

		//每个版本备份一次md5文件，用于还原版本数据md5_data
		var bakPath = verPath + defaultVersion + "/" + md5DataFile;
		fs.writeFileSync(bakPath, md5Data);
		//写入版本对应该版本号json文件/ver/new/version.json
		var key;
		var versionData = {defaultVer:1, fileCount:0, defaultCount:0, verDic:{}};
		for(key in md5Dic.files){
			var version = md5Dic.files[key].version;
			if (version == 1){//默认版本号
				versionData.defaultCount = versionData.defaultCount + 1;
			}
			else{
				versionData.verDic[key] = version;
			}
			versionData.fileCount = versionData.fileCount + 1;
		}
		
		var jsonDataPath = verPath + defaultVersion + "/version.json";
		var jsonDataPathadd = addPath + defaultVersion + "/version.json";
		fs.writeFileSync(jsonDataPath, JSON.stringify(versionData));
		fs.writeFileSync(jsonDataPathadd, JSON.stringify(versionData));
		console.log("writeFileSync:", jsonDataPath);
		//写入新版本产生文件对应该版本目录/ver/new/....
		for(key in newMd5Dic){
			var newObj = newMd5Dic[key];
			var fileVersion = newObj.ver;
			var destPath = verPath + fileVersion + "/" + key
			var destPathadd = addPath + fileVersion + "/" + key;
			md5MakeDir(addPath + fileVersion);
			md5TargetMakeDir(verPath + fileVersion, key);
			md5TargetMakeDir(addPath + fileVersion, key);
			if (!fs.existsSync(destPath)){
				fs.copyFileSync(newObj.source, destPath);
				fs.copyFileSync(newObj.source, destPathadd);
				console.log("copy to file:", key);
			}
		}
		console.log("Version to complete!", Date.now() - time, "ms");
		callback();
	});
}

/** 增加版本号 */
function resourceMd5AddVersion(done){
	genMd5Version(true, done);
}
/** 不增加版本号 */
function resourceMd5NoneVersion(done){
	genMd5Version(false, done);
}
/** 获取文件md5码 */
function getFileMd5(path, key, callback){
	var hash = crypto.createHash('md5');
	var stream = fs.createReadStream(path);

	stream.on('data', function(data){
		hash.update(data);
	});

	stream.on('end', function() {
		callback(null, hash.digest('hex'), key);
	});
}
/** 不增加版本号 */
function test(done){
	//md5 ./test/testfile.txt
	let time = Date.now();
	getFileMd5("./resource/res/bag/jiahao.png", "xx", function(error, path, md5) {
		console.log("md5:", md5, path, Date.now() - time, "ms");
		done();
	});
}

/** 修改输出目录 */
function changeOutPath(done){
	outPath = "E:/newHxf/Publish_H5Game_XYWSCli/webInspect";
	done();
}


//gulp.series 用于串行（顺序）执行
//gulp.parallel 用于并行执行
//var buildlib = gp.series(egret, zip_lib, login, zip_main, zip_thm);
//var build = gp.series(login, zip_main, zip_thm);
var libs = gp.series(libs);
var game_login = gp.series(game_login);
var game_main = gp.series(game_main);


gp.task('libs', libs);//序列执行
gp.task('game_login', game_login);//序列执行
gp.task('game_main', game_main);//序列执行

// exports.default = test;