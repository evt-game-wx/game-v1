module qmr {
    /**
     *
     * @description 所有序列帧动画的管理器 draw到300就差不多了
     *
     */
    export class AnimateManager {
        private static instance: AnimateManager;
        private animaDic: any;
        private maxAliveTime: number = 10000;//30s
        public constructor() {
            this.animaDic = {};
        }
        /**
         * @descripion 获取单例
         */
        public static getInstance(): AnimateManager {
            if (AnimateManager.instance == null) {
                AnimateManager.instance = new AnimateManager();
            }
            return AnimateManager.instance;
        }
        /**
         * @description 析对应序列帧动画
         */
        public parseSpriteSheet(resName: string, url: string, jsonData: any, texture: egret.Texture, dir: number = -1, autoParseTexture: boolean = true): void {
            let spriteJson: any;
            let spriteSheet: egret.SpriteSheet = new egret.SpriteSheet(texture);

            for (let movieClipName in jsonData.mc) {
                if (movieClipName != null && movieClipName.length != 0) {
                    spriteJson = jsonData.mc[movieClipName];
                    break;
                }
            }
            if (spriteJson) {
                let obj = this.animaDic[resName];
                if (!obj) {
                    obj = {};
                    this.animaDic[resName] = obj;
                }
                obj.url = url;
                obj.sheet = spriteSheet;
                let labels = spriteJson.labels;
                let half = jsonData.harf;

                if (labels && labels.length > 1) {
                    for (let label of labels) {
                        let animalData: AnimateData = new AnimateData(jsonData.res, spriteSheet, autoParseTexture, half);
                        animalData.parseClipByStartAndEnd(spriteJson, parseInt(label.frame), parseInt(label.end));
                        obj[parseInt(label.name)] = animalData;
                    }
                }
                else {
                    let animalData: AnimateData = new AnimateData(jsonData.res, spriteSheet, autoParseTexture, half);
                    animalData.parseClip(spriteJson);
                    obj.data = animalData;
                }
            }
        }
        /**
         * @description 根据对应的动画名和标名获取序列帧数据
         * @param resName 资源名
         * @param dir 方向
         */
        public getAnimalData(resName: string, dir: number): AnimateData {
            let obj = this.animaDic[resName];
            if (!obj) return null;
            let count: number = obj.count;
            if (count) {
                count += 1;
            } else {
                count = 1;
            }
            obj.count = count;
            obj.useTime = egret.getTimer();
            if (dir > 0 && resName.indexOf("death") == -1) {
                return obj[dir];
            }
            return obj.data;
        }
        /**
         * @description 释放资源，其实是释放对应animaion的引用计数
         */
        public dispos(resName: string): void {
            if (resName == "168_idle"){//默认动画不清理引用
                return;
            }
            let obj = this.animaDic[resName];
            if (obj) {
                let count: number = obj.count;
                if (count) {
                    count -= 1;
                } else {
                    count = 0;
                }
                if (count <= 0) {
                    count = 0;
                }
                obj.count = count;
            }
        }

        /**
         * @description 清理过期资源
         */
        public clear(now:number): void {
            let animaDic = this.animaDic;
            let maxAliveTime = this.maxAliveTime;

            for (let key in animaDic) {
                let item: any = animaDic[key];
                if (item.count == 0 && item.useTime) {
                    if (now - item.useTime > maxAliveTime) {
                        if (item.sheet) {
                            item.sheet.dispose();
                        }
                        let rootStr: boolean = RES.destroyRes(item.url);
                        LogUtil.warn("AnimationManager.destroy url=" + item.url + "  " + rootStr);
                        animaDic[key] = null;
                        delete animaDic[key];
                    }
                }
            }

            //可能会导致内网卡，先注释了。。
            // if (!PlatformConfig.useCdnRes){
            //     RES.profile();
            // }
        }
    }
}
