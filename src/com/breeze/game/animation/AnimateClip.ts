module qmr
{
    export class AnimateClip extends egret.Bitmap
    {
        private animateData: AnimateData;
        private resName: string;
        private callBack: Function;
        private thisObject: any;
        private isDirLoad: boolean;              //是否是分方向加载
        private actList: Array<string>;          //该动画片段包含的动作组
        private curFrame: number;//当前在第几帧
        public isBody: boolean;                   //是否是裸体部件
        public constructor(callBack: Function = null, thisObject: any = null)
        {
            super();
            this.callBack = callBack;
            this.thisObject = thisObject;
            this.isDirLoad = false;
            this.actList = [];
            this.isBody = false;
            this.pixelHitTest = true;
            this.offsetX = 0;
            this.offsetY = 0;
            this.curFrame = 0;
        }
        /**
         * @description 动态设置是否是分方向加载
         */
        public setIsDirLoad(value: boolean): void
        {
            this.isDirLoad = value;
        }
        /**
         * @description 获取是否是分方向加载
         */
        public getIsDirLoad(): boolean
        {
            return this.isDirLoad;
        }
        /**
         * @description 设置该动画片段包含的动作组
         */
        public setActs(acts: string): void
        {
            this.actList = acts.split(",");
        }
        /**
         * @description 该动画片段是否包含该动作
         */
        public containsAct(act: string): boolean
        {
            let actList = this.actList;
            if (actList.length == 0)
            {
                return true;
            }
            for (let key of actList)
            {
                if (key == act)
                {
                    return true;
                }
            }
            return false;
        }
        /**
         * @description 加载
         * @param path 文件的相对路径
         * @param resName 当前动画片段的名字
         * @param animationName 动画片段属于的动画的名字
         * @param dir 有些动画会带方向的
          @param act 动作名
         */
        public load(path: string, resName: string, dir: number = -1): void
        {
            let t: AnimateClip = this;
            let agrIns = AnimateManager.getInstance();
            t.curFrame = 0;
            //特殊处理
            if (t.animateData && t.resName)
            {
                agrIns.dispos(t.resName);
            }
            t.resName = resName;

            let teampAnimataData = agrIns.getAnimalData(t.resName, t.isDirLoad ? -1 : dir);
            if (teampAnimataData)
            {
                t.animateData = teampAnimataData;
                if (t.callBack)
                {
                    egret.callLater(t.callBack, t.thisObject, true, resName);
                    // t.callBack.call(t.thisObject, true, resName);
                }
            }
            else
            {
                let onJsonLoaded: Function = function (jsonData: any)
                {
                    let onTextureLoaded: Function = function (texture: egret.Texture, url: string)
                    {
                        if (texture)
                        {
                            let newResName = resName;
                            agrIns.parseSpriteSheet(newResName, url, jsonData, texture, dir);
                            if (newResName == t.resName)
                            {
                                t.animateData = agrIns.getAnimalData(newResName, dir);
                            }
                            if (t.callBack)
                            {
                                egret.callLater(t.callBack, t.thisObject, false, resName);
                                //t.callBack.call(t.thisObject, false, resName);
                            }
                        }
                        else
                        {
                            t.reset();
                        }
                    }
                    if (jsonData)
                    {
                        let off = jsonData.harf ? "_f.png" : ".png";
                        let resPath = path + resName + off;
                        let tempTexture: egret.Texture = RES.getRes(resPath);
                        if (tempTexture)
                        {
                            //动画资源统一在AnimationManager里面管理，在LoaderManager看清除
                            LoaderManager.instance.removeGroupRef(resPath);
                            onTextureLoaded(tempTexture, resPath);
                        }
                        else
                        {
                            ResManager.getRes(resPath, onTextureLoaded, t, LoadPriority.IMMEDIATELY, RES.ResourceItem.TYPE_IMAGE);
                        }
                    }
                    else
                    {
                        t.reset();
                    }
                }
                if (t.isBody)
                {
                    t.texture = RES.getRes("preloading_defaultBody_png");
                    t.x = -t.texture.textureWidth / 2;
                    t.y = -t.texture.textureHeight;
                }
                let jsonPath = path + resName + ".json";
                let data: any = RES.getRes(jsonPath);
                if (data)
                {
                    onJsonLoaded(data);
                }
                else
                {
                    ResManager.getRes(jsonPath, onJsonLoaded, t, LoadPriority.IMMEDIATELY, RES.ResourceItem.TYPE_JSON);
                }
            }
        }

        /**
         * @description 重置，防止夸帧
         */
        public reset(): void
        {
            if (this.animateData)
            {
                this.texture = null;
                this.animateData = null;
            }
            this.curFrame = 0;
        }
        /**
         * @description 渲染第几帧
         */
        public render(frame: number): void
        {
            // console.log("渲染第几帧:" + frame);
            // if (frame == this.curFrame) return;
            this.curFrame = frame;
            let t: AnimateClip = this;
            let animateData = t.animateData;
            if (animateData != null)
            {
                let scale = t._scale;
                let offset = animateData.getOffset(frame);
                let texture = animateData.getTextureByFrame(frame);
                t.texture = texture;
                if (offset)
                {
                    t.x = (offset.x * scale + t._offsetX);
                    t.y = (offset.y * scale + t._offsetY);
                    if (animateData.halfTexture)
                    {
                        t.width = offset.w;
                        t.height = offset.h;
                    }
                    else if (texture)
                    {
                        t.width = texture.textureWidth;
                        t.height = texture.textureHeight;
                    }
                }
                if (t._effectWidth > 0)
                {
                    if (animateData.halfTexture)
                    {
                        t.scaleX = t._effectWidth / offset.w;
                    }
                    else
                    {
                        t.scaleX = t._effectWidth / texture.textureWidth;
                    }
                }
                else
                {
                    t.scaleX = t.scaleY = scale;
                }
            }
        }
        private _scale: number = 1.0;
        private _offsetX: number = 0;
        private _offsetY: number = 0;

        public set offsetX(value: number)
        {
            this._offsetX = value;
        }
        public set offsetY(value: number)
        {
            this._offsetY = value;
        }

        public set scale(value: number)
        {
            this._scale = value;
        }

        /** 用于设置特效宽度，设置之后无需设置scaleX */
        private _effectWidth: number = 0;
        public set effectWidth(value: number)
        {
            this._effectWidth = value;
        }

        public get effectWidth(): number
        {
            return this._effectWidth;
        }

        /**获取第一帧的高度*/
        public get firstFrameHeight(): number
        {
            let animateData = this.animateData;
            if (animateData)
            {
                return animateData.getTextureByFrame(1).textureHeight;
            }
            return 0;
        }

        /** 获取总帧数 */
        public get totalFrames(): number
        {
            let animateData = this.animateData;
            if (animateData != null)
            {
                return animateData.totalFrames;
            }
            return 0;
        }

        /**获取帧频*/
        public get frameRate(): number
        {
            let animateData = this.animateData;
            if (animateData != null)
            {
                return animateData.frameRate;
            }
            return 0;
        }

        /**  资源释放   */
        public dispos(): void
        {
            let t = this;
            t.curFrame = 0;
            if (t.parent)
            {
                t.reset();
                AnimateManager.getInstance().dispos(t.resName);
                t.parent.removeChild(t);
            }
        }
    }
}
