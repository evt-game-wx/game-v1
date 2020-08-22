module qmr
{
    export class LoginView extends LoginViewUI
    {
        public constructor()
        {
            super();
            this.needAdaptStatusBar = false;
        }

        /**
         * @description 初始化事件
         */
        protected initListener(): void
        {
            super.initListener();

            this.addClickEvent(this.btnClose, this.onCloseClick, this);
            this.addClickEvent(this.btnReturn, this.onCloseClick, this);
        }

        private onCloseClick():void{

        }

        protected addedToStage(evt: egret.Event): void
        {
            super.addedToStage(evt);

            var loadSpan = document.getElementById("gameLoading");
            if (loadSpan && loadSpan.parentNode)
            {
                loadSpan.parentNode.removeChild(loadSpan);
            }
            var styleSpan = document.getElementById("style");
            if (styleSpan && styleSpan.parentNode)
            {
                styleSpan.parentNode.removeChild(styleSpan);
            }
            
            PlatformManager.instance.platform.setLoadingStatus("");
            GameLoadManager.instance.loadGameResAfterLogin();

            this.onBgResBack();

            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx");

        }

        private onBgResBack(): void
        {
            qmr.LogUtil.log("onBgResBack");
            if (document && document.getElementById("loaingMyBg"))
            {
                let myBg = document.getElementById("loaingMyBg");
                myBg.style.display = "none";
            }
        }

        /**
        * @description 初始化数据,需被子类继承
        */
        protected initData(): void
        {
            super.initData();

        }

        public dispose(): void
        {
            super.dispose();

			ModuleManager.deleteModule(ModuleNameLogin.LOGIN_VIEW);
			
			let destroySuccess: boolean = RES.destroyRes("login");
			qmr.LogUtil.log("RES.destroyRes,login=", destroySuccess); 
        }
    }
}
