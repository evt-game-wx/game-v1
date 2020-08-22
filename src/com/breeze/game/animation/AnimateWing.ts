module qmr
{
    /**
     * @description 翅膀动画片段
     */
    export class AnimateWing extends AnimateClip
    {
        private _wingFrame:number;
        private _wingFrameIndex:number;
        public constructor(callBack: Function = null, thisObject: any = null)
        {
            super(callBack, thisObject);
            this._wingFrame = 0;
            this._wingFrameIndex = 0;
        }
        /**
         * @description 渲染第几帧 8-10[1-8,1-8]
         */
        public render(frame: number): void
        {
            if (this._wingFrame != frame){
                this._wingFrame = frame;
                this._wingFrameIndex++;
            }
            frame = 1 + (this._wingFrameIndex%this.totalFrames);
            super.render(frame);
        }

        public reset(): void
        {
            super.reset();
            this._wingFrame = 0;
            this._wingFrameIndex = 0;
        }
    }
}
