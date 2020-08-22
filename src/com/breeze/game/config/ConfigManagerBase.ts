module qmr {
	export class ConfigManagerBase {
		
		private static cfgDic: Dictionary = new Dictionary();
		private static zipDic: Dictionary;
		/**默认的资源包名称 */
		private static WHOLE_CONFIG_NAME: string = "config_bin";
		private static BASE_CONFIG_NAME: string = "configbase_bin";
		
		/**
		 * @description 根据Id获取当前行数对象
		 * ConfigEnum
		 */
		static getConf(jsonName: string, confId: any): any
		{
			let conf: any;
			let cfg: Dictionary = this.getBean(jsonName);
			if (cfg)
			{
				conf = cfg.get(confId);
				return conf;
			}
			return null;
		}

		/*
		 * 根据文件名获取一个配置表
		 * return dic
		 */
		public static getBean(fileName: string): Dictionary
		{
			var dic: Dictionary = this.cfgDic.get(fileName);
			if (!dic)
			{
				dic = this.parseConfigFromZip(fileName);
				this.cfgDic.set(fileName, dic);
				qmr.LogUtil.log("ConfigManagerBase.parseConfigFromZip:", fileName);
			}
			return dic;
		}

		/**从zip中解析一张表*/
		private static parseConfigFromZip(fileName: string): Dictionary
		{
			let t = this;
			let dic: Dictionary = new Dictionary();
			let className: string = fileName.charAt(0).toLocaleUpperCase() + fileName.slice(1, fileName.length) + "Cfg";//转换为类名
			let greeter: any = qmr[className];
			let zip = t.getZip(t.WHOLE_CONFIG_NAME);
			if(!zip) {
				zip = t.getZip(t.BASE_CONFIG_NAME);
			}
			if(!zip) {
				console.error("配置读取失败");
			}
			let zipObj: any = zip.file(fileName + ".json");
			if (!zipObj)
			{
				LogUtil.warn("从zip中解析一张表 = " + fileName + " 异常，请查看配置是否提交？？")
			}

			let contentObj: any = JSON.parse(zipObj.asText());
			if (greeter)
			{
				//提审版武将表特殊处理
				if(PlatformConfig.isShildTSV){
					if(fileName == "Hero" && TSHelper){
						TSHelper.instance.handleHeroCfgJson(contentObj);
					}
				}
				contentObj.forEach(element =>
				{
					let cfg: any = new greeter(element);//实例化类
					if (cfg.key)
					{
						var key: string = t.getkey(cfg, element);
						dic.setConf(key, cfg);
					}
					else
					{
						LogUtil.warn("获取配置表的唯一key 错误了。。。" + cfg);
					}
				});
			}
			return dic;
		}

		private static getZip(resName: string): JSZip {
			if(!this.zipDic){
				this.zipDic = new Dictionary();
			}
			let zip = this.zipDic.get(resName);
			if(!zip){
				let bin = RES.getRes(resName);
				if(bin) {
					zip = new JSZip(bin);
					this.zipDic.set(resName, zip);
				}
			}
			return zip;
		}

		//获取配置表的唯一key值
		private static getkey(cfg: any, cfgValue: any): string
		{
			if (!cfg.key)
			{
				return;
			}
			var keys: string[] = cfg.key.split("_");
			var newKey: string = "";
			var len = keys.length;
			if (len == 1)
			{
				newKey = cfgValue[cfg.key];
			}
			else
			{
				keys.forEach((element, index) =>
				{
					newKey += index != len - 1 ? cfgValue[element] + "_" : cfgValue[element];
				});
			}
			return newKey;
		}

	}
}