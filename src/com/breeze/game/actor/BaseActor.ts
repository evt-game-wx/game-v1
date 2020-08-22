module qmr
{
	/**
	 * @date 2016.12.01
	 * @description 带动画和移动操作的角色类,默认是待机状态,idle
	 */
    export class BaseActor extends egret.DisplayObjectContainer
    {
        protected currentFrame: number;
        protected totalFrame: number;
        protected partDic: any;                       //角色身上的部件
        protected partIdDic: any;                     //角色身上部件对应的Id
        private isStopped: boolean;
        private passedTime: number;
        private frameIntervalTime: number;
        private lastTime: number;
        private eventDic: any;                        //事件字典
        private actDic: any;                          //记录当前动作是否加载完毕的
        private dir: number;                          //当前朝向
        private isDirLoaded: boolean;                 //是否是分方向下载
        private loopCallBack: Function;               //当前循环播放完毕
        private loopThisObject: any;                  //当前循环播放作用域对象
        private loadCallBack: Function;               //加载完毕后的回调函数,只针对裸体和坐骑
        private loadThisObject: any;                  //加载完毕后的回调函数作用域对象
        private _act: string;                         //当前的动作
        private _resourcePath: string;                //资源的相对路径
        private _frameRate: number;                   //当前帧频
        private _timeScale: number;                   //帧频速度,越大越快
        private _isNoRendering: boolean;              //是否不循环渲染，用于外面设置是否播放，级别最大

        public constructor(resourcePath: string, loadCallBack: Function, loadThisObject: any, defaultAct: string = "idle")
        {
            super();
            let t = this;
            t.resourcePath = resourcePath;
            t.loadCallBack = loadCallBack;
            t.loadThisObject = loadThisObject;
            t.currentFrame = 1;
            t.totalFrame = 0;
            t.isStopped = true;
            t.isDirLoaded = false;
            t.isNoRendering = false;
            t.passedTime = 0;
            t.lastTime = 0;
            t._timeScale = 1;
            t.act = defaultAct;
            t.frameRate = 30;
            t.eventDic = {};
            t.actDic = {};
            t.partDic = {};
            t.partIdDic = {};
            t.addEventListener(egret.Event.ADDED_TO_STAGE, t.addToStage, t);
            t.addEventListener(egret.Event.REMOVED_FROM_STAGE, t.removeToStage, t);
        }

        protected addToStage()
        {
            this.setIsStopped(false);
            this.render();
        }

        protected removeToStage()
        {
            this.setIsStopped(true);
        }

        public get isNoRendering(): boolean
        {
            return this._isNoRendering;
        }

        public set isNoRendering(value: boolean)
        {
            this._isNoRendering = value;
        }

        /**
         * @description 设置是否是分方向加载
         */
        public setIsDirLoad(value: boolean): void
        {
            this.isDirLoaded = value;
            let partDic = this.partDic;
            for (let part in partDic)
            {
                let animalClip: AnimateClip = partDic[part];
                animalClip.setIsDirLoad(value);
            }
        }
		/**
		 * @description 添加部件
		 * @param part部件位置，参考ActorPart
		 * @param partId 部件的Id
		 * @param partIndex 部件层级位置,数字越大层级越高
		 */
        public addPartAt(part: number, partId: number, partIndex: number = -1, dir: number = 1, isDirLoad: boolean = false, resPath: string = null, isShowDefault: boolean = true): void
        {
            if (partId)
            {
                let t = this;
                t.addPartTo(part, partId, partIndex, dir, isDirLoad, resPath);
                //这里是添加转圈特效，用来在模型资源加载完成之前显示一个loading特效的功能
                if (part == ActorPart.BODY && isShowDefault)
                {
                    let animalClip: AnimateClip = t.partDic[ActorPart.DEFAULT];
                    if (!animalClip)
                    {
                        t.addPartTo(ActorPart.DEFAULT, 168, partIndex, dir, isDirLoad, resPath);
                        animalClip = t.partDic[ActorPart.DEFAULT];
                        animalClip.offsetY = -85;
                    }
                }
            }
        }

        private addPartTo(part: number, partId: number, partIndex: number = -1, dir: number = 1, isDirLoad: boolean = false, resPath: string = null)
        {
            let t = this;
            let tempAct: string = t.act;
            let animalClip: AnimateClip = t.partDic[part];
            t.partIdDic[part] = partId;
            t.dir = dir;
            if (animalClip)
            {
                if (partIndex != -1)
                {
                    t.addChildAt(animalClip, partIndex);
                }
                else
                {
                    t.addChild(animalClip);
                }
                animalClip.setIsDirLoad(isDirLoad);
                if (!animalClip.containsAct(tempAct))
                {
                    tempAct = part == ActorPart.HORSE ? Status.IDLE_RIDE : Status.IDLE;
                }
                let partPath = ActorPartResourceDic.getInstance().partDic[part];
                animalClip.load(partPath ? partPath : t.resourcePath, partId + "_" + tempAct, DirUtil.getDir(dir));
            }
            else
            {
                if (part == ActorPart.BODY)
                {
                    animalClip = new AnimateClip(t.onLoaded, t);
                    // animalClip.isBody = true;
                }
                else if (part == ActorPart.DEFAULT)
                {
                    animalClip = new AnimateClip(t.onLoadedDefault, t);
                }
                else if (part == ActorPart.WING)
                {
                    animalClip = new AnimateWing(t.onLoadedOther, t);
                }
                else
                {
                    animalClip = new AnimateClip(t.onLoadedOther, t);
                }
                // animalClip.setIsDirLoad(isDirLoad); 本项目不需要
                if (partIndex != -1)
                {
                    t.addChildAt(animalClip, partIndex);
                }
                else
                {
                    t.addChild(animalClip);
                }
                if (!animalClip.containsAct(tempAct))
                {
                    tempAct = part == ActorPart.HORSE ? Status.IDLE_RIDE : Status.IDLE;
                }
                t.partDic[part] = animalClip;
                let partPath = ActorPartResourceDic.getInstance().partDic[part];
                animalClip.load(partPath ? partPath : t.resourcePath, partId + "_" + tempAct, DirUtil.getDir(dir));
            }
        }

        public setPartVisible(part: number, show: boolean): void
        {
            let animalClip: AnimateClip = this.partDic[part];
            animalClip.visible = show;
        }
		/**
		 * @description 移除部件
		 * @param part部件位置，参考ActorPart
		 */
        public removePart(part: number | string): void
        {
            let animalClip: AnimateClip = this.partDic[part];
            if (animalClip)
            {
                animalClip.dispos();
                delete this.partDic[part];
                delete this.partIdDic[part];
            }
        }

        public getPart(part: number = ActorPart.BODY): AnimateClip
        {
            return this.partDic[part];
        }

        /**
         * @description 设置该部位包含的动作
         */
        public setPartActs(part: number, acts: string): void
        {
            let partDic = this.partDic;
            for (let key in partDic)
            {
                if (parseInt(key) == part)
                {
                    let animalClip: AnimateClip = partDic[part];
                    if (animalClip)
                    {
                        animalClip.setActs(acts);
                    }
                }
            }
            if (acts.indexOf(',') > -1)
            {
                this.act = acts.split(',')[0];
            }
            else
            {
                this.act = acts;
            }
        }
		/**
		 * @description 跳转并播放
		 */
        public gotoAndPlay(act: string, dir: number, loopCallBack: Function = null, loopThisObject: any = null, force: boolean = false): void
        {
            let t = this;
            t.loopCallBack = loopCallBack;
            t.loopThisObject = loopThisObject;
            if (!force)
            {
                if (t.act == act) return;
            }
            t.actDic[act] = false;
            t.act = act;
            t.dir = dir;
            t.currentFrame = 1;
            let currentScale: number = Math.abs(t.scaleX);
            if (dir <= 5)
            {
                t.scaleX = currentScale;
            } else
            {
                t.scaleX = -currentScale;
            }
            if (t.act == qmr.Status.DEAD)
            {
                dir = -1;
            }
            let partDic = t.partDic;
            let partIdDic = t.partIdDic;
            t.setIsStopped(true);
            for (let part in partDic)
            {
                let animalClip: AnimateClip = partDic[part];
                if (animalClip)
                {
                    let tempAct: string = t.act;
                    if (!animalClip.containsAct(tempAct))
                    {
                        if (parseInt(part) == ActorPart.HORSE)
                        {
                            tempAct = qmr.Status.IDLE_RIDE;
                        }
                        else
                        {
                            tempAct = qmr.Status.IDLE;
                        }
                    }
                    let partPath = ActorPartResourceDic.getInstance().partDic[part];
                    let resPath = partPath ? partPath : t.resourcePath;
                    animalClip.load(resPath, partIdDic[part] + "_" + tempAct, DirUtil.getDir(dir));
                }
            }
        }
        /**
         * @description 清除回调
         */
        public clearCallBack(): void
        {
            this.loopCallBack = null;
        }
		/**
		 * @description 调整方向
		 */
        public changeDir(dir: number): void
        {
            let t = this;
            if (t.dir == dir) return;
            t.dir = dir;
            let currentScale: number = Math.abs(t.scaleX);
            if (dir <= 5)
            {
                t.scaleX = currentScale;
            } else
            {
                t.scaleX = -currentScale;
            }
            let partDic = t.partDic;
            let partIdDic = t.partIdDic;
            for (let part in partDic)
            {
                let animalClip: AnimateClip = partDic[part];
                if (animalClip)
                {
                    let tempAct: string = t.act;
                    if (!animalClip.containsAct(tempAct))
                    {
                        if (parseInt(part) == ActorPart.HORSE)
                        {
                            tempAct = qmr.Status.IDLE_RIDE;
                        } else
                        {
                            tempAct = qmr.Status.IDLE;
                        }
                    }
                    let partPath = ActorPartResourceDic.getInstance().partDic[part];
                    let resPath = partPath ? partPath : t.resourcePath;
                    animalClip.load(resPath + partIdDic[part] + "/", partIdDic[part] + "_" + tempAct, DirUtil.getDir(dir));
                }
            }
        }
		/**
		 * @description 跳转并停止在某一帧
		 */
        public gotoAndStop(frame: number): void
        {
            this.currentFrame = frame;
            this.render();
            this.setIsStopped(true);
        }

        /**
        * @description 资源加载完毕
        */
        private onLoadedDefault(isFromCache: boolean, resName: string): void
        {
            let t = this;
            let animalClip: AnimateClip = t.partDic[ActorPart.DEFAULT];
            if (animalClip)
            {
                t.totalFrame = animalClip.totalFrames;
                t.frameRate = animalClip.frameRate;
                t.setIsStopped(false);
            }
        }
        /**
         * @description 其它部位加载完毕
         */
        private onLoadedOther(isFromCache: boolean): void
        {
            let t = this;
            let animalClip: AnimateClip = t.partDic[ActorPart.DEFAULT];
            if (animalClip)
            {
                t.removePart(ActorPart.DEFAULT);
                t.totalFrame = 1;
            }
            if (!isFromCache)
            {
                t.changeDir(t.dir);
            }
        }

        private onLoaded(isFromCache: boolean, resName: string): void
        {
            let t: BaseActor = this;
            t.removePart(ActorPart.DEFAULT);
            if (resName.indexOf(t.act) == -1) return;
            let animalClip: AnimateClip = t.partDic[ActorPart.BODY];
            if (animalClip)
            {
                t.totalFrame = animalClip.totalFrames;
                t.frameRate = animalClip.frameRate;
            }
            else
            {
                t.totalFrame = 0;
            }
            if (t.totalFrame > 0)
            {
                t.actDic[t.act] = true;
                //如果只是有一帧
                if (t.totalFrame == 1)
                {
                    t.gotoAndStop(1);
                }
                else
                {
                    t.setIsStopped(false);
                }
                if (t.loadCallBack)
                {
                    t.loadCallBack.call(t.loadThisObject);
                }
            }
            else
            {
                t.gotoAndPlay(t.act, t.dir);
            }
        }
        /**
         * @description 获取第一帧裸体的高度
         */
        public get firstBodyFrameHeight(): number
        {
            let animalClip: AnimateClip = this.partDic[ActorPart.BODY];
            if (animalClip)
            {
                return animalClip.firstFrameHeight;
            }
            return 0;
        }

        /**
         * @description 注册一个帧事件         */
        public registerFrameEvent(frame: number, callBack: Function, thisObject: any): void
        {
            this.eventDic[frame] = { callBack: callBack, thisObject: thisObject };
        }
        /**
         * @description 取消一个帧事件         */
        public unRegisterFrameEvent(frame: number): void
        {
            let eventDic = this.eventDic;
            if (eventDic[frame])
            {
                eventDic[frame] = null;
                delete eventDic[frame];
            }
        }
        /**
         * @description 清除帧事件注册
         */
        public clearFrameEvent(): void
        {
            let eventDic = this.eventDic;
            for (let key in eventDic)
            {
                eventDic[key] = null;
                delete eventDic[key];
            }
        }
        /**
         * @description 帧频调用         */
        private advanceTime(timeStamp: number): boolean
        {
            let t = this;
            if (t.isNoRendering)
            {
                t.gotoAndStop(1);
                return false;
            }
            let advancedTime: number = timeStamp - t.lastTime;
            t.lastTime = timeStamp;
            let frameIntervalTime: number = t.frameIntervalTime;
            let currentTime = t.passedTime + advancedTime;
            t.passedTime = currentTime % frameIntervalTime;
            let num: number = currentTime / frameIntervalTime;
            if (num < 1)
            {
                return false;
            }
            t.render();
            while (num >= 1)
            {
                num--;
                t.currentFrame++;
                if (t.actDic[t.act])
                {
                    t.checkFrameEvent();
                }
            }
            return false;
        }
        /**
         * @description 检测帧事件         */
        private checkFrameEvent(): void
        {
            let obj: any = this.eventDic[this.currentFrame];
            if (obj && obj.callBack)
            {
                obj.callBack.call(obj.thisObject);
            }
        }
        /**
         * @description 渲染*/
        private render(): void
        {
            let t = this;
            if (t.totalFrame > 0)
            {
                if (t.currentFrame > t.totalFrame)
                {
                    t.currentFrame = 1;
                    if (t.loopCallBack)
                    {
                        t.loopCallBack.call(t.loopThisObject);
                    }
                }
                if (t.totalFrame == 1 || t.stage)
                {
                    let partDic = t.partDic;
                    let currentFrame = t.currentFrame;
                    for (let part in partDic)
                    {
                        let animalClip: AnimateClip = partDic[part];
                        if (animalClip)
                        {
                            animalClip.render(currentFrame);
                        }
                    }
                }
            }
        }

        /**
         * @description 设置帧频         */
        public set frameRate(value: number)
        {
            if (value > 60)
            {
                value = 60;
            }
            this._frameRate = value;
            this.frameIntervalTime = 1000 / (value * this._timeScale);
        }
        /**
         * @description 获取总帧数
         */
        public getTotalFrame(): number
        {
            return this.totalFrame;
        }
        /**
         * @description 设置timescale
         */
        public set timeScale(value: number)
        {
            if (value <= 0)
            {
                value = 1;
            }
            this._timeScale = value;
            this.frameIntervalTime = 1000 / (this._frameRate * value);
        }
        /**
         * @description 获取timescale
         */
        public get timeScale(): number
        {
            return this._timeScale;
        }
        public set act(value: string)
        {
            this._act = value;
        }
        /**
         * @description 获取timescale
         */
        public get act(): string
        {
            return this._act;
        }
        public set resourcePath(value: string)
        {
            this._resourcePath = value;
        }
        /**
         * @description 获取timescale
         */
        public get resourcePath(): string
        {
            return this._resourcePath;
        }
        /**
            * @private
            *
            * @param value
            */
        public setIsStopped(value: boolean)
        {
            let t = this;
            if (t.isStopped == value)
            {
                return;
            }
            t.isStopped = value;
            if (value)
            {
                egret.stopTick(t.advanceTime, t);
            } else
            {
                //如果只是有一帧或者外面设置了不在渲染
                if (t.totalFrame == 1 || t.isNoRendering)
                {
                    t.gotoAndStop(1);
                }
                else
                {
                    t.lastTime = egret.getTimer();
                    egret.startTick(t.advanceTime, t);
                }
            }
        }

        public getDir(): number
        {
            return this.dir;
        }

        /**
         * @description 清除资源
         */
        public clear(): void
        {
            this.setIsStopped(true);
            this.clearFrameEvent();
            if (this.parent)
            {
                this.parent.removeChild(this);
            }
        }
        /**
         * @description 资源释放         */
        public dispos(isRemoveFromParent: boolean = true): void
        {
            let t = this;
            t.setIsStopped(true);
            t.clearFrameEvent();
            t.removeEventListener(egret.Event.ADDED_TO_STAGE, t.addToStage, t);
            t.removeEventListener(egret.Event.REMOVED_FROM_STAGE, t.removeToStage, t);
            for (let part in t.partDic)
            {
                t.removePart(part);
            }
            if (t.parent && isRemoveFromParent)
            {
                t.parent.removeChild(t);
            }
        }
    }
}
