module qmr
{
	/**
	 *
	 * @description 系统路径类枚举
	 *
	 */
    export class SystemPath
    {
        public static get loginPath(): string {
            return PlatformConfig.webRoot + "resourceLogin/";
        }
        public static get mapPath(): string {
            return PlatformConfig.webRoot + "map/"; 
        }
        public static get defaultPath(): string {
            return "resourceLogin/animation/";
        }
        public static get rolePath(): string {
            return PlatformConfig.webRoot + "animation/role/";
        }
        public static get roleUiPath(): string {
            return PlatformConfig.webRoot + "animation/uiRole/";
        }
        public static get bgPath(): string {
            return PlatformConfig.webRoot + "unpack/bg/"; 
        }
        public static get weaponPath(): string {
            return PlatformConfig.webRoot + "animation/weapon/"; 
        }
        public static get horsePath(): string {
            return PlatformConfig.webRoot + "animation/horse/";
        }
        public static get wingPath(): string {
            return PlatformConfig.webRoot + "animation/wing/";
        }
        public static get bg_music(): string {
            return PlatformConfig.webRoot + "sound/music/"; 
        }
        public static getEffect_musicUrl(musicName: string): string {
            let dirUrl: string = PlatformConfig.webRoot + "sound/effect/";
            return dirUrl + musicName + ".mp3";
        }
        public static get itemIcon(): string {
            return PlatformConfig.webRoot + "icon/item/"; 
        }
    }
}
