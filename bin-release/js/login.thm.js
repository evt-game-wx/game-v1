
                var __extends = this && this.__extends|| function (d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = window.generateEUI||{};
                generateEUI.paths = generateEUI.paths||{};
                generateEUI.styles = undefined;
                generateEUI.skins = {};generateEUI.paths['resource/login_skins/CommonTipSkin.exml'] = window.CommonTipSkin = (function (_super) {
	__extends(CommonTipSkin, _super);
	function CommonTipSkin() {
		_super.call(this);
		this.skinParts = ["img_bg","img_icon","lbl_tipMsg","common_g","content"];
		
		this.height = 45;
		this.elementsContent = [this.content_i()];
	}
	var _proto = CommonTipSkin.prototype;

	_proto.content_i = function () {
		var t = new eui.Group();
		this.content = t;
		t.height = 45;
		t.touchChildren = false;
		t.touchEnabled = false;
		t.touchThrough = true;
		t.verticalCenter = 0;
		t.width = 640;
		t.elementsContent = [this.common_g_i()];
		return t;
	};
	_proto.common_g_i = function () {
		var t = new eui.Group();
		this.common_g = t;
		t.height = 45;
		t.horizontalCenter = 0;
		t.y = 0;
		t.elementsContent = [this.img_bg_i(),this._Group1_i()];
		return t;
	};
	_proto.img_bg_i = function () {
		var t = new eui.Image();
		this.img_bg = t;
		t.left = 0;
		t.right = 0;
		t.source = "preloading_ui_ty_tishikuang_png";
		t.y = -4;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.height = 45;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.y = 0;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this.img_icon_i(),this.lbl_tipMsg_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.horizontalAlign = "center";
		t.verticalAlign = "middle";
		return t;
	};
	_proto.img_icon_i = function () {
		var t = new eui.Image();
		this.img_icon = t;
		t.height = 45;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 45;
		t.x = -205;
		t.y = 10;
		return t;
	};
	_proto.lbl_tipMsg_i = function () {
		var t = new eui.Label();
		this.lbl_tipMsg = t;
		t.fontFamily = "specialGameFont";
		t.height = 40;
		t.multiline = false;
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 28;
		t.stroke = 1;
		t.text = "";
		t.textAlign = "center";
		t.touchEnabled = false;
		t.verticalAlign = "middle";
		t.wordWrap = false;
		t.x = 100;
		t.y = 3;
		return t;
	};
	return CommonTipSkin;
})(eui.Skin);generateEUI.paths['resource/login_skins/GameLoadingProgressBarSkin.exml'] = window.GameLoadingProgressBarSkin = (function (_super) {
	__extends(GameLoadingProgressBarSkin, _super);
	function GameLoadingProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["imgProgressBg","imgProgress","imgCloud","labHint"];
		
		this.height = 123;
		this.width = 600;
		this.elementsContent = [this.imgProgressBg_i(),this.imgProgress_i(),this.imgCloud_i(),this.labHint_i()];
	}
	var _proto = GameLoadingProgressBarSkin.prototype;

	_proto.imgProgressBg_i = function () {
		var t = new eui.Image();
		this.imgProgressBg = t;
		t.scale9Grid = new egret.Rectangle(59,6,3,42);
		t.source = "preloading_ui_jindu_di_png";
		t.width = 600;
		t.y = 33;
		return t;
	};
	_proto.imgProgress_i = function () {
		var t = new eui.Image();
		this.imgProgress = t;
		t.fillMode = "repeat";
		t.scale9Grid = new egret.Rectangle(15,3,40,19);
		t.source = "preloading_ui_denglu_jindu_png";
		t.width = 0;
		t.x = 35;
		t.y = 48;
		return t;
	};
	_proto.imgCloud_i = function () {
		var t = new eui.Image();
		this.imgCloud = t;
		t.source = "preloading_ui_denglu_yun_png";
		t.y = -41;
		return t;
	};
	_proto.labHint_i = function () {
		var t = new eui.Label();
		this.labHint = t;
		t.fontFamily = "specialGameFont";
		t.horizontalCenter = 0;
		t.size = 25;
		t.stroke = 1;
		t.strokeColor = 0xc89f64;
		t.text = "首次加载时间稍长，请耐心等待";
		t.textColor = 0xffffff;
		t.y = 89;
		return t;
	};
	return GameLoadingProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/login_skins/GameLoadingViewSkin.exml'] = window.GameLoadingViewSkin = (function (_super) {
	__extends(GameLoadingViewSkin, _super);
	function GameLoadingViewSkin() {
		_super.call(this);
		this.skinParts = ["imgBg","progressBar1","progressBar2","labRefresh"];
		
		this.height = 1334;
		this.width = 750;
		this.elementsContent = [this.imgBg_i(),this.progressBar1_i(),this.progressBar2_i(),this.labRefresh_i(),this._Label1_i()];
		this.states = [
			new eui.State ("loginPrevLoad",
				[
					new eui.SetProperty("progressBar1","visible",false),
					new eui.SetProperty("progressBar2","visible",false)
				])
			,
			new eui.State ("loginSuccessLoad",
				[
					new eui.SetProperty("labRefresh","size",24)
				])
		];
	}
	var _proto = GameLoadingViewSkin.prototype;

	_proto.imgBg_i = function () {
		var t = new eui.Image();
		this.imgBg = t;
		t.height = 1624;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.progressBar1_i = function () {
		var t = new qmr.GameLoadingProgressBar();
		this.progressBar1 = t;
		t.bottom = 333;
		t.horizontalCenter = 0;
		t.skinName = "GameLoadingProgressBarSkin";
		t.visible = true;
		return t;
	};
	_proto.progressBar2_i = function () {
		var t = new qmr.GameLoadingProgressBar();
		this.progressBar2 = t;
		t.bottom = 199;
		t.horizontalCenter = 0;
		t.skinName = "GameLoadingProgressBarSkin";
		t.visible = true;
		return t;
	};
	_proto.labRefresh_i = function () {
		var t = new eui.Label();
		this.labRefresh = t;
		t.bottom = 158;
		t.fontFamily = "specialGameFont";
		t.horizontalCenter = 0;
		t.size = 22;
		t.stroke = 1;
		t.strokeColor = 0xc89f64;
		t.text = "若长时间加载不成功，请点击刷新界面";
		t.textColor = 0xffffff;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 35;
		t.fontFamily = "specialGameFont";
		t.height = 45;
		t.horizontalCenter = 12;
		t.lineSpacing = 10;
		t.size = 18;
		t.stroke = 1;
		t.strokeColor = 0x842813;
		t.text = "抵制不良游戏，拒绝盗版游戏。 注意自我保护，谨防受骗上当。 适度游戏益脑，沉迷游戏伤身。 合理安排时间，享受健康生活";
		t.textAlign = "left";
		t.visible = true;
		t.width = 510;
		t.wordWrap = true;
		return t;
	};
	return GameLoadingViewSkin;
})(eui.Skin);generateEUI.paths['resource/login_skins/LoginViewSkin.exml'] = window.LoginViewSkin = (function (_super) {
	__extends(LoginViewSkin, _super);
	function LoginViewSkin() {
		_super.call(this);
		this.skinParts = ["btnClose","btnReturn","labContent"];
		
		this.height = 858.73;
		this.elementsContent = [this._Group2_i()];
	}
	var _proto = LoginViewSkin.prototype;

	_proto._Group2_i = function () {
		var t = new eui.Group();
		t.anchorOffsetY = 0;
		t.height = 836;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.width = 640;
		t.elementsContent = [this._Group1_i(),this._Image3_i(),this.btnClose_i(),this.btnReturn_i(),this._Label1_i(),this.labContent_i()];
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.anchorOffsetY = 0;
		t.bottom = -5;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this._Image1_i(),this._Image2_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.anchorOffsetY = 0;
		t.bottom = 13;
		t.left = 7;
		t.right = 7;
		t.scale9Grid = new egret.Rectangle(89,71,13,33);
		t.source = "basePanel_json.common_dikuang2";
		t.top = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.left = 14;
		t.right = 21;
		t.scale9Grid = new egret.Rectangle(193,23,123,14);
		t.source = "basePanel_json.common_biaotitou";
		t.y = 7;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 674.67;
		t.scale9Grid = new egret.Rectangle(18,19,67,65);
		t.source = "basePanel_json.common_dikuang";
		t.width = 566.66;
		t.x = 34.69;
		t.y = 76;
		return t;
	};
	_proto.btnClose_i = function () {
		var t = new eui.Image();
		this.btnClose = t;
		t.anchorOffsetX = 44;
		t.anchorOffsetY = 41;
		t.right = 11;
		t.source = "basePanel_json.common_guanbi";
		t.top = 8;
		return t;
	};
	_proto.btnReturn_i = function () {
		var t = new eui.Image();
		this.btnReturn = t;
		t.source = "basePanel_json.common_fanhui";
		t.x = 514.27;
		t.y = 742.76;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.bold = true;
		t.fontFamily = "specialGameFont";
		t.horizontalCenter = 6;
		t.text = "测试面板";
		t.textColor = 0x803f07;
		t.y = 22.56;
		return t;
	};
	_proto.labContent_i = function () {
		var t = new eui.Label();
		this.labContent = t;
		t.bold = false;
		t.fontFamily = "specialGameFont";
		t.lineSpacing = 5;
		t.size = 28;
		t.text = "游戏测试面板";
		t.textAlign = "left";
		t.textColor = 0x803f07;
		t.width = 554;
		t.x = 39;
		t.y = 92;
		return t;
	};
	return LoginViewSkin;
})(eui.Skin);