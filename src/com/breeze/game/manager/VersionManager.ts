module qmr{
    export class VersionManager{

         /**系统当前使用的资源版本号 */
        public static resVersion:string;
        // 版本控制信息
        public static versionConfig;
        /**默认版本号 */
        public static defaultVer;
        /**默认版本控制目录 */
        public static defaultDir: string = "ver";
        public constructor(){
        }

        public static async initGameVersion(v:string)
        {
            let t = this;
            if(!PlatformConfig.useCdnRes){
                return;
            }
            t.resVersion = v;

            return new Promise((resolve, reject) =>
            {
                //通过httpReques获得配置资源信息
                let versionConfigPath = PlatformConfig.webUrl + t.defaultDir + "/" + t.resVersion + "/version.json";
                LogUtil.log("=========》》》加载版本控制文件："+versionConfigPath);
                let request = new egret.HttpRequest();
                request.responseType = egret.HttpResponseType.TEXT;
                request.open(versionConfigPath, egret.HttpMethod.GET);
                request.send();
                request.addEventListener(egret.Event.COMPLETE, (event: egret.Event) =>
                {
                    var request = <egret.HttpRequest>event.currentTarget;
                    let verJson = JSON.parse(request.response);
                    t.versionConfig = verJson.verDic;
                    t.defaultVer = verJson.defaultVer;
                    resolve();
                }, t);
                request.addEventListener(egret.IOErrorEvent.IO_ERROR, () =>
                {
                    egret.error("post error : " + event);
                    reject();
                }, t);
            })
        }

        /**获取带版本号的资源路径 */
        public static getPathWithGameVersion(resPath: string) : string
        {
            let version = VersionManager.defaultVer;
            //取版本控制的的version
            if (VersionManager.versionConfig && VersionManager.versionConfig[resPath])
            {
                version = VersionManager.versionConfig[resPath];
            }
            // 文件路径中插入版本号+后缀扩展名
            resPath = PlatformConfig.webUrl + VersionManager.defaultDir +  "/" + version + "/" + resPath;
            return resPath;
        }
    }

    export class VersionController implements RES.IVersionController
    {
        // 在游戏开始加载资源的时候就会调用这个函数
        init(): Promise<any>
        {
            return Promise.resolve();
        }
        
        //在游戏运行时，每个资源加载url都要经过这个函数
        getVirtualUrl(url: string)
        {
            // qmr.LogUtil.log("=======》》》加载绝对路径资源："+url);
            // 在开发模式下，所有资源还是以原来的资源路径去加载，方便开发者替换资源
            if (qmr.PlatformConfig.useCdnRes)
            {
                return this.getResUrlByVersion(url);
            }
            else
            {
                return url + "?v=" + new Date().getTime();
            }
        }
        /**
         * 获得版本控制之后的路径信息
         */
        getResUrlByVersion(url: string): string
        {
            // qmr.LogUtil.log("==============================》》》加载绝对路径资源："+url);
    
            //判断是否为版本控制的资源，其他域的资源，比如玩家头像，或是初始包体里面的资源以原始url加载
            if (url.indexOf("eui_skins") != -1)
            {
                // qmr.LogUtil.log("==================》》》加载eui_skins资源："+url);
                return url;
            }
            let starIndex = url.indexOf(PlatformConfig.baseRoot);
            if(starIndex == -1){
                // qmr.LogUtil.error("==============================》》》出现不在跟目录下的资源："+url);
                return url;
            }
            // 部分文件可能存在？v=加数字进行控制的形式，在引擎底层这里是不支持加v=的，只会以原始url加载路径
            // 如果项目中存在类似的情况，将其还原成普通形式
            let endIndex = url.indexOf("?v=");
            let resPath;
            // //取版本控制的路径
            if (endIndex != -1)
            {
                resPath = url.slice(starIndex, endIndex);
            }
            else
            {
                resPath = url.slice(starIndex);
            }
            let version = VersionManager.defaultVer;
            //取版本控制的的version
            if (VersionManager.versionConfig && VersionManager.versionConfig[resPath])
            {
                version = VersionManager.versionConfig[resPath];
            }
            // 文件路径中插入版本号+后缀扩展名
            resPath = PlatformConfig.webUrl + VersionManager.defaultDir +  "/" + version + "/" + resPath;
            // qmr.LogUtil.log("==================》》》加载版本控制路径资源："+resPath);
            return resPath;
        }
    
    
        /**
         * 处理wxgame里面的无效资源
         */
        // private versionCacheWxgame = () =>
        // {
        //     // 简单处理，通过localStorage获取当前游戏版本号resVersion，如果版本号不同，进行删除过期资源操作
        //     // 这里开发者可以自己控制版本号，不一定使用localStorage
        //     const localVersion = egret.localStorage.getItem("resVersion");
        //     if (localVersion != this.currentVersion)
        //     {
        //         egret.localStorage.setItem("resVersion", this.currentVersion);
        //         qmr.LogUtil.log("版本更新");
        //         //下面是wxgame提供的api，进行过期缓存资源的移除
        //         const fs = wx.getFileSystemManager();
        //         // 如果是最新的微信支持库请修改file-util.js中localFileMap对应的存储路径，其他版本参照修改
        //         const dir = wx.env.USER_DATA_PATH + "/cache_crc32/assets";
        //         fs.readdir({
        //             dirPath: dir,
        //             success: (e) =>
        //             {
        //                 const result = this.getRemoveList(e.files);
        //                 const length = result.length;
        //                 for (let i = 0; i < length; ++i)
        //                 {
        //                     qmr.LogUtil.log("删除", dir + "/" + result[i])
        //                     fs.unlinkSync(dir + "/" + result[i]);
        //                 }
        //             },
        //             fail: (e) =>
        //             {
        //                 // qmr.LogUtil.log(e);
        //             }
        //         });
        //     }
    
        // }
        /**
        * 处理WebH5里面的更新，如果开发者有其他平台发布的版本控制，请参照这两种进行修改
        */
        // private versionCacheWeb = () =>
        // {
        //     // 简单处理，通过localStorage获取当前游戏版本号resVersion，如果版本号不同，进行删除过期资源操作
        //     // 这里开发者可以自己控制版本号，不一定使用localStorage
        //     const localVersion = egret.localStorage.getItem("resVersion");
        //     if (localVersion != this.currentVersion)
        //     {
        //         egret.localStorage.setItem("resVersion", this.currentVersion);
        //         qmr.LogUtil.log("Web版本更新");
        //     }
        // }
        /** 
         * 获得上版本的过期资源列表，提高效率使用字符串的形式进行比对
         */
        // private getRemoveList(files: Array<string>): Array<string>
        // {
        //     const result = [];
        //     let str = "";
        //     for (const key in this.versionConfig)
        //     {
        //         str += this.versionConfig[key] + ",";
        //     }
        //     const length = files.length;
        //     for (let i = 0; i < length; ++i)
        //     {
        //         const item = files[i];
        //         const crc32 = item.slice(0, item.indexOf("."));
        //         if (str.indexOf(crc32) == -1)
        //         {
        //             result.push(item);
        //         }
        //     }
        //     return result;
        // }
    
    }
}


