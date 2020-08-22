module qmr
{
    /**
     *  初始化图片工具类
     */
    export class ImageUtil
    {
        /**
         *  设置道具icon显示
         */
        public static setItemIcon(icon: eui.Image, iconRes: any, pageType?: BagType, bIsGray: boolean = false): void
        {
            if (!iconRes || iconRes == "") return;
            icon.source = null;
            if (bIsGray == true)
            {
                iconRes += "_g";
            }
            ResManager.getRes(SystemPath.itemIcon + iconRes + ".png", function (texture: egret.Texture)
            {
                if (icon)
                {
                    //icon.source = null;
                    icon.source = texture;
                }
            }, this, LoadPriority.HIGH, RES.ResourceItem.TYPE_IMAGE);
        }
        /** 设置位图icon显示 */
        public static setBmpIcon(icon: egret.Bitmap, url: string): void
        {
            ResManager.getRes(url, function (texture: egret.Texture)
            {
                if (icon)
                {
                    icon.texture = texture;
                }
            }, this, LoadPriority.HIGH, RES.ResourceItem.TYPE_IMAGE);
        }

        /** 给路径加上变灰路径 */
        public static decoratePathForGray(path: string): string
        {
            let pathArray = path.split(".png");
            path = pathArray[0] + "_g.png";
            return path;
        }

        /** 设置image显示 */
        public static setImageIcon(icon: eui.Image, url: string): void
        {
            if (url == "" || url == null || icon == null || icon.source == url)
            {
                return;
            }
            icon.source = null;
            ResManager.getRes(url, function (texture: egret.Texture)
            {
                if (icon)
                {
                    //icon.source = null;
                    icon.source = texture;
                }
            }, this, LoadPriority.HIGH, RES.ResourceItem.TYPE_IMAGE);
        }

        //--------------以下字段游戏中暂时没用到，用到时候提到上面去----------------
        /**
         * @description 给图片设置滤镜变灰的效果
         */
        public static setFilter(img: Array<any>): void
        {
            let colorMaxtrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ]
            let colorFilter = new egret.ColorMatrixFilter(colorMaxtrix);
            for (let i = 0; i < img.length; i++)
            {
                img[i].filters = [colorFilter];
            }
        }
    }
}