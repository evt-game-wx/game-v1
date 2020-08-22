module qmr {
    /**
     *
     * @description 动画片段数据，比如某个动画组中的待机动画
     *
     */
    export class AnimateData {
        private _totalFrames: number;
        private _frameRate: number;
        private framesList: Array<any>;
        private resJson: any;
        private spriteSheet: egret.SpriteSheet;
        private autoParseTexture: boolean;//是否自动解析纹理
        private autoHalfTexture: boolean;//是否自动解析纹理
        public constructor(resJson: any,spriteSheet: egret.SpriteSheet,autoParseTexture: boolean = false,autoHalfTexture: boolean = false) {
            this.resJson = resJson;
            this.spriteSheet = spriteSheet;
            this.autoHalfTexture = autoHalfTexture;
            this.autoParseTexture = autoParseTexture;
            this.framesList = [];
        }
        /**
         * @description 解析数据
         */
        public parseClip(spriteJson: any): void {
            let t = this;
            let index: number = 0;
            let framesList = this.framesList;

            t._frameRate = parseInt(spriteJson.frameRate);
            for(let item of spriteJson.frames) {
                let duraton: number = parseInt(item.duration);
                if(isNaN(duraton)) duraton = 1;
                for(let i: number = 1;i <= duraton;i++) {
                    index += 1;
                    framesList.push(item);
                }
            }
            if(t.autoParseTexture) {
                let spriteSheet = t.spriteSheet;
                let autoHalfTexture = t.autoHalfTexture;
                for(let frameJson of framesList) {
                    if(!spriteSheet.getTexture(frameJson.res)) {
                        let rect = t.resJson[frameJson.res];
                        if (autoHalfTexture){
                            spriteSheet.createTexture(frameJson.res,Math.ceil(rect.x/2),Math.ceil(rect.y/2),rect.w>>1,rect.h>>1);
                        }
                        else{
                            spriteSheet.createTexture(frameJson.res,rect.x,rect.y,rect.w,rect.h);
                        }
                    }
                }
            }
            t._totalFrames = t.framesList.length;
        }
        /**
         * @description 通过起始帧解析数据
         */ 
        public parseClipByStartAndEnd(spriteJson: any,start:number,end:number):void{
            let t = this;
            let index: number = 0;
            let framesList = t.framesList;
            t._frameRate = parseInt(spriteJson.frameRate);

            for(let item of spriteJson.frames) {
                let duraton: number = parseInt(item.duration);
                if(isNaN(duraton)) duraton = 1;
                for(let i: number = 1;i <= duraton;i++) {
                    index += 1;
                    if(index>=start&&index<=end){
                        framesList.push(item);
                    }
                }
            }
            //多个动作的资源，消息自己解析贴图
            // if(t.autoParseTexture) {
            //     for(let frameJson of framesList) {
            //         if(!t.spriteSheet.getTexture(frameJson.res)) {
            //          // this.spriteSheet.createTexture(frameJson.res,this.resJson[frameJson.res].x,this.resJson[frameJson.res].y,this.resJson[frameJson.res].w,this.resJson[frameJson.res].h);
            //         }
            //     }
            // }
            t._totalFrames = framesList.length;
        }
        /**
         * @description 获取某一帧texture
         */
        public getTextureByFrame(frame: number): egret.Texture {
            let frameJson: any;
            let t = this;
            if(frame <= t.framesList.length) {
                frameJson = t.framesList[frame - 1];
            } else {
                return null;
            }
            let texture: egret.Texture = t.spriteSheet.getTexture(frameJson.res);
            if(!texture) {
                let rect = t.resJson[frameJson.res];
                texture = t.spriteSheet.createTexture(frameJson.res,
                    rect.x,rect.y,rect.w,rect.h);
            }
            return texture;
        }
        /**
         * @description 获取某一帧偏移值
         */
        public getOffset(frame: number): any {
            let offset: any;
            let framesList = this.framesList;
            if(frame <= framesList.length) {
                offset = framesList[frame - 1];
            } else {
                offset = framesList[framesList.length - 1];
            }
            if (this.autoHalfTexture){
                let rect = this.resJson[offset.res];
                let x = rect.x%2?1:0;
                let y = rect.y%2?1:0;
                return {x:offset.x + x,y:offset.y + y,w:(rect.w>>1)<<1,h:(rect.h>>1)<<1};
            }
            return offset;
        }
        
        /**
         * @description 获取总的帧数
         */
        public get totalFrames(): number {
            return this._totalFrames;
        }
        /**
         * 是方法一倍
         */
        public get halfTexture(): boolean {
            return this.autoHalfTexture;
        }
        /**
         * @description 获取帧频         */ 
        public get frameRate(): number {
            return this._frameRate;
        }
        /**
         * @description 资源释放
         */ 
        public dispos():void{
            this.framesList.length=0;
            this.framesList=null;
        }
    }
}
