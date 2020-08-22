module qmr
{
	/**
	 *
	 * @desc 音效音乐管理器
	 *
	 */
    export class SoundManager
    {
        private static instance: SoundManager;
        public static getInstance(): SoundManager
        {
            if (SoundManager.instance == null)
            {
                SoundManager.instance = new SoundManager();
            }
            return SoundManager.instance;
        }
        private _soundPool: any
        private _bgSoundItem: SoundItem;
        private _isEffectSoundOpen: boolean = true;
        private _isMusicSoundOpen: boolean = true;
        private _isMusicLifecycleOpen: boolean = true;
        private _lastMusicName: string;  //上一次播放的music的名字是（主要是背景音乐）
        private _musicName: string;
        public constructor()
        {
            this._lastMusicName = "";
            this._musicName = "";
            this._soundPool = {};
        }
		/**
		 * 获取soundpool
		 */
        public get soundPool(): any
        {
            return this._soundPool;
        }
		/**
		 * 设置是否打开特效音乐
		 */
        public set isEffectSoundOpen(value: boolean)
        {
            this._isEffectSoundOpen = value;
            if (!value)
            {
                for (let key in this._soundPool)
                {
                    let soundItem: SoundItem = this._soundPool[key];
                    if (soundItem != null && soundItem.sound != null)
                    {
                        if (soundItem.sound.type == egret.Sound.EFFECT)
                        {
                            soundItem.stop();
                        }
                    }
                }
            }
        }

        /**
         * 获取特效音乐是否打开
         */
        public get isEffectSoundOpen(): boolean
        {
            return this._isEffectSoundOpen;
        }
        /**
		 * 设置是否打开背景音乐
		 */
        public set isMusicSoundOpen(value: boolean)
        {
            this._isMusicSoundOpen = value;
            if (value)
            {
                if (this._bgSoundItem != null)
                {
                    this._bgSoundItem.stop();
                }
                if (this._musicName != "")
                {
                    this._bgSoundItem = this._soundPool[this._musicName];
                    if (this._bgSoundItem)
                    {
                        this._lastMusicName = this._musicName;
                        this._bgSoundItem.play(0);
                    } else
                    {
                        this.loadBgMusic(this._musicName);
                    }
                }
            }
            else if (this._bgSoundItem != null)
            {
                this._bgSoundItem.stop();
            }
        }
        /**
         * 获取背景音乐是否打开
         */
        public get isMusicSoundOpen(): boolean
        {
            return this._isMusicSoundOpen;
        }
        /**
         * 播放特效
         */
        public loadAndPlayEffect(soundType: string, loops: number = 1, isOneKey: boolean = false): void
        {
            // console.log("==============================》》》播放音效："+this._isMusicLifecycleOpen, this._isEffectSoundOpen, qmr.WebBrowerUtil.isSupportMusic());
            if (this._isMusicLifecycleOpen && this._isEffectSoundOpen)
            {
                let soundPool = this._soundPool;
                let musicCfg: MusicCfg = this.getSoundCfg(soundType);
                if (!musicCfg)
                {
                    LogUtil.log("音效不存在。。。" + soundType)
                    return;
                }
                let musicName = musicCfg.soundName;
                if (musicName == undefined || musicName == "")
                {
                    return;
                }
                let soundItem: SoundItem = soundPool[musicName];
                let isPlaySameTime: boolean = musicCfg.isPlaySameTime > 0;
                if (soundItem == null)
                {
                    let sound: egret.Sound = RES.getRes(musicName + "_mp3");
                    if (sound)
                    {
                        let item: SoundItem = soundPool[musicName];
                        if (!item)
                        {
                            soundItem = new SoundItem(sound);
                            soundPool[musicName] = soundItem;
                        }
                        if (!isPlaySameTime || isOneKey)
                        {
                            //不同时播放
                            if (!soundItem.isPlay && soundItem.position <= 0)
                            {
                                soundItem.play(0, loops);
                            }
                        }
                        else
                        {
                            soundItem.play(0, loops);
                        }
                    } else
                    {
                        ResManager.getRes(qmr.SystemPath.getEffect_musicUrl(musicName), (sound: egret.Sound) =>
                        {
                            let item: SoundItem = soundPool[musicName];
                            if (!item)
                            {
                                var loadSound: SoundItem = new SoundItem(sound);
                                soundPool[musicName] = loadSound;
                                if (!isPlaySameTime || isOneKey)
                                {
                                    //不同时播放
                                    if (!loadSound.isPlay && loadSound.position <= 0)
                                    {
                                        loadSound.play(0, loops);
                                    }
                                } else
                                {
                                    loadSound.play(0, loops);
                                }
                            }
                        }, this, LoadPriority.HIGH, RES.ResourceItem.TYPE_SOUND);
                    }
                }
                else
                {
                    if (!isPlaySameTime || isOneKey)
                    {
                        //不同时播放
                        if (!soundItem.isPlay && soundItem.position <= 0)
                        {
                            soundItem.play(0, loops);
                        }
                    } else
                    {
                        soundItem.play(0, loops);
                    }
                }
            }
        }

        /** 停止音效 */
        public stopSoundEffect(soundType: string)
        {
            let musicName = this.getMusicName(soundType);
            if (musicName == undefined || musicName == "") return;
            if (this._isEffectSoundOpen)
            {
                let soundItem: SoundItem = this._soundPool[musicName];
                if (soundItem != null)
                {
                    soundItem.stop();
                }
            }
        }
        /**
         * 播放背景音乐,一般都是无限循环的
         */
        public loadAndPlayMusic(musicName: string): void
        {
            this._musicName = musicName;
            if (musicName == null || musicName == "") return;
            if (this._isMusicLifecycleOpen && this._isMusicSoundOpen)
            {
                if (this._bgSoundItem != null)
                {
                    if (this._lastMusicName == musicName)
                    {
                        if (this._bgSoundItem.position <= 0)
                        {
                            this._bgSoundItem.stop();
                            this._bgSoundItem.play(0);
                        }
                    }
                    else
                    {
                        if (this._bgSoundItem)
                        {
                            this._bgSoundItem.stop();
                        }
                        this._bgSoundItem = this._soundPool[musicName];
                        if (this._bgSoundItem)
                        {
                            this._lastMusicName = musicName;
                            if (SoundManager.getInstance().isMusicSoundOpen)
                            {
                                this._bgSoundItem.play(0);
                            }
                        }
                        else
                        {
                            this.loadBgMusic(musicName);
                        }
                    }
                } else
                {
                    this.loadBgMusic(musicName);
                }
            }
        }

        private _soundCfgDic: Dictionary = new Dictionary();
        private getMusicName(soundType: string): string
        {
            let cfg: MusicCfg = this.getSoundCfg(soundType);
            if (cfg)
            {
                return cfg.soundName;
            }
            LogUtil.log("音效不存在。。。" + soundType)
            return "";
        }

        private getMusicIsPlaySameTime(soundType: string): number
        {
            let cfg: MusicCfg = this.getSoundCfg(soundType);
            if (cfg)
            {
                return cfg.isPlaySameTime;
            }
            LogUtil.log("音效不存在。。。" + soundType)
            return 0;
        }

        private getSoundCfg(soundType: string): MusicCfg
        {
            if (this._soundCfgDic.has(soundType))
            {
                return this._soundCfgDic.get(soundType);
            }
            let cfg: MusicCfg = ConfigManagerBase.getConf(ConfigEnumBase.MUSIC, soundType);
            if (cfg)
            {
                this._soundCfgDic.set(soundType, cfg);
            }
            return cfg;
        }

        /**
         * @description 加载背景音乐
         */
        private loadBgMusic(soundType: string): void
        {
            let musicName = this.getMusicName(soundType);
            if (musicName == undefined || musicName == "") return;
            this._lastMusicName = musicName;
            let t: SoundManager = this;
            ResManager.getRes(qmr.SystemPath.bg_music + musicName + ".mp3", (sound: egret.Sound) =>
            {
                var loadSound: SoundItem = new SoundItem(sound, egret.Sound.MUSIC);
                t._soundPool[soundType] = loadSound;
                if (t._bgSoundItem)
                {
                    t._bgSoundItem.stop();
                }
                t._bgSoundItem = loadSound;
                if (SoundManager.getInstance().isMusicSoundOpen)
                {
                    t._bgSoundItem.play(0);
                }
                // if (!egret.Capabilities.isMobile) {
                //     t._bgSoundItem.play(0);
                // }
            }, this, LoadPriority.LOW, RES.ResourceItem.TYPE_SOUND);
        }
        /**
         * 关闭背景音乐
         */
        public stopMusic(): void
        {
            let bgSoundItem = this._bgSoundItem;
            if (bgSoundItem != null && bgSoundItem.isPlay)
            {
                bgSoundItem.stop();
            }
            this._isMusicLifecycleOpen = false;
        }
        /**
         * 重新恢复背景音乐
         */
        public reStartMusic(): void
        {
            if (!this._isMusicLifecycleOpen)
            {
                this._isMusicLifecycleOpen = true;
                this.loadAndPlayMusic(this._lastMusicName);
            }
        }
    }
}
