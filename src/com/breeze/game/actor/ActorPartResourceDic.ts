module qmr {
	/**
	 * 各个部位对应的资源加载地址
	 */
	export class ActorPartResourceDic {
		public partDic: any;
		public constructor() {
			let partDic = {};
			partDic[ActorPart.WEAPON] = SystemPath.weaponPath;
			partDic[ActorPart.WING] = SystemPath.wingPath;
			partDic[ActorPart.HORSE] = SystemPath.horsePath;
			partDic[ActorPart.HORSE_UP] = SystemPath.horsePath;
			partDic[ActorPart.DEFAULT] = SystemPath.defaultPath;
			this.partDic = partDic;
		}
		private static _instance: ActorPartResourceDic;
		public static getInstance(): ActorPartResourceDic {
			if (ActorPartResourceDic._instance == null) {
				ActorPartResourceDic._instance = new ActorPartResourceDic();
			}
			return ActorPartResourceDic._instance;
		}
	}
}
