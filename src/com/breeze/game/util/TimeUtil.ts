module qmr
{
    /*
    * name;
    */
    export class TimeUtil
    {
        /** 一天的毫秒数 **/
        public static DAY_MICRO_SECONDS: number = 24 * 3600 * 1000;
        /** 一小时的毫秒数 **/
        public static HOUR_MICRO_SECONDS: number = 3600 * 1000;
        /** 一分钟的毫秒数 **/
        public static MINUTE_MICRO_SECONDS: number = 60 * 1000;
        /** 一秒钟的毫秒数 **/
        public static SECOND_MICRO_SECONDS: number = 1000;
        /** 年 **/
        public static readonly CN_YEAR: string = "年";
        /** 月 **/
        public static readonly CN_MONTH: string = "月";
        /** 日 **/
        public static readonly CN_SUN: string = "日";
        /** 天 **/
        public static readonly CN_DAY: string = "天";
        /** 小时 **/
        public static readonly CN_HOUR: string = "小时";
        /** 分 **/
        public static readonly CN_MIN: string = "分";
        /** 秒 **/
        public static readonly CN_SEC: string = "秒";
        /**
         *时间误差，精确到毫秒 
         */
        private static tickOffset: number = 0;


        constructor()
        {

        }

        /**
         * 获取服务器时间，返回当前秒数(本机时间，所有活动计算时差请用getZoneOffsetSeverSecond方法)
         * @return 
         * 
         */
        public static getServerSecond(): number
        {
            return Math.floor((egret.getTimer() + this.tickOffset) / 1000);
        }
        /**
         *  获取服务器时间，返回毫秒
         * @return 
         */
        public static get serverTime(): number
        {
            return (egret.getTimer() + this.tickOffset);
        }
        /**
         * 获得服务器Unix时间，返回Date
         */
        public static getSeverDate(): Date
        {
            return (new Date(this.getServerSecond() * 1000));
        }
        /**
         * 获得服务器显示时间
         */
        public static getZoneOffsetSeverDate(): Date
        {
            return new Date(this.getZoneOffsetSeverSecond() * 1000);
        }
        /**
         * 获得服务器，显示秒
         */
        public static getZoneOffsetSeverSecond(): number
        {
            return this.getServerSecond();
        }

        public static syncServerTime(timeStamp: number): void
        {
            this.tickOffset = timeStamp - egret.getTimer();
            // console.log("tickOffset:",this.tickOffset);
            // console.log("serverTime:",new Date(timeStamp).toString());
            // console.log("ServerSecond:",this.getServerSecond());
        }

        /**
         * 根据时间返回字符串时间
         * */
        public static getTimeBySecond(second: number): string
        {
            var str: string = "";
            if (second >= 60)
            {
                str = this.dateStringFillZero(Math.floor(second / 60)) + ":";
            }
            str += this.dateStringFillZero(Math.floor(second % 60));

            return str;
        }

        /**
         * 根据时间戳返回字符串 xxxx-xx-xx 00:00:00
         * @time 毫秒
         */
        private static date: Date;
        public static getDateByTimer(time: number): string
        {
            if (!TimeUtil.date)
            {
                TimeUtil.date = new Date();
            }
            TimeUtil.date.setTime(time);
            var year: number = TimeUtil.date.getFullYear();
            var month: number = TimeUtil.date.getMonth() + 1;
            var day: number = TimeUtil.date.getDate();
            var hour: number = TimeUtil.date.getHours();
            var min: number = TimeUtil.date.getMinutes();
            var sec: number = TimeUtil.date.getSeconds();
            var monthStr: string = month < 10 ? ("0" + month) : month.toString();
            var dayStr: string = day < 10 ? ("0" + day) : day.toString();
            var hourStr: string = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();
            return year + "-" + month + "-" + day + " " + hourStr + ":" + minStr + ":" + secStr;
        }

        /**
         * 根据时间戳返回字符串 xxxx-xx-xx 00:00:00
         * @time 秒
         */
        public static getDateByTimerSecond(time: number): string
        {
            return TimeUtil.getDateByTimer(time * 1000);
        }
        /**
		 * 获取当前时间到明天00:00:00还有多少秒
		 */
        public static getDayOverTime(): number
        {
            var date: Date = this.getSeverDate();
            var toDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            return (toDate.getTime() - date.getTime()) / 1000;
        }
        /**
		 * 获取当前时间点
		 */
        public static getDayTime(): number
        {
            var date: Date = this.getSeverDate();
            var toDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return (date.getTime() - toDate.getTime()) / 1000;
        }
        /**
		 * 转换成今天的时间点
		 */
        public static getTimeToNow(time: number): number
        {
            var date: Date = new Date(time);
            var toDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return (date.getTime() - toDate.getTime()) / 1000;
        }

        /**
         * 根据时间返回字符串 00:00:00
         */
        public static formatDate(date: Date): string
        {
            var hour: number = date.getHours();
            var min: number = date.getMinutes();
            var sec: number = date.getMilliseconds();
            var hourStr: string = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();
            return hourStr + ":" + minStr + ":" + secStr;
        }
        /**
         * 根据时间返回字符串 00:00:00,超过24小时，只会显示超过的时间
         */
        public static formatTime(second: number): string
        {
            var hour: number = Math.floor(second / 60 / 60) % 24;
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            var hourStr: string = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();

            return hourStr + ":" + minStr + ":" + secStr;
        }

        /**
         * 根据时间返回字符串 00:00:00
         */
        public static formatTime1(second: number): string
        {
            var hour: number = Math.floor(second / 60 / 60);
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            var hourStr: string = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();

            return hourStr + ":" + minStr + ":" + secStr;
        }

        /**
         * 小时分钟
         * @param second
         * @return 
         */
        public static formatTime4(second: number): string
        {
            var hour: number = Math.floor(second / 60 / 60) % 24;
            var min: number = Math.floor(second / 60) % 60;
            var hourStr: string = hour < 10 ? ("" + hour) : hour.toString();
            var minStr: string = min < 10 ? ("" + min) : min.toString();
            return hourStr + this.CN_HOUR + minStr + this.CN_MIN;
        }

        /**
             *根据时间返回字符串 00分00秒
         */
        public static formatTime5(second: number): string
        {
            var hour: number = Math.floor(second / 60 / 60) % 24;
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            var hourStr: string = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();
            if (hour > 0)
            {
                return hourStr + this.CN_HOUR + minStr + this.CN_MIN + secStr + this.CN_SEC;
            }
            return minStr + this.CN_MIN + " " + secStr + this.CN_SEC;
        }

        /**
         * 根据时间返回字符串 00:00
         */
        public static formatTime2(second: number): string
        {
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();
            return (minStr + ":" + secStr);
        }
        /**
         * 根据时间返回字符串 00:00:00
         */
        public static formatTime3(second: number): string
        {
            var day: number = Math.floor(second / 60 / 60 / 24);
            var hour: number = Math.floor(second / 60 / 60) % 24 + day * 24;
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            var hourStr: string = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();
            return hourStr + ":" + minStr + ":" + secStr;
        }

        /**
         * 根据时间返回字符串 xx分xx秒
         */
        public static formatTime6(second: number): string
        {
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();
            return (minStr + "分" + secStr + "秒");
        }

        /** 00:00 一天当中的多少小时分钟 */
        public static formatTime7(second: number): string
        {
            let date = new Date(second);
            let min: number = date.getMinutes();
            let hour: number = date.getHours();
            let hourStr = hour < 10 ? ("0" + hour) : hour.toString();
            let minStr: string = min < 10 ? ("0" + min) : min.toString();

            return hourStr + ":" + minStr;
        }
        /**
         * 格式化数据网格列日期 MM-DD JJ:NN
         */
        public static formatColumnDate(tempDate: Date): string
        {
            var m: string = ((tempDate.getMonth() + 1 < 10) ? "0" : "") + (tempDate.getMonth() + 1);
            var day: string = ((tempDate.getDate() < 10) ? "0" : "") + tempDate.getDate();
            var rect: string = "";
            rect += m + "-" + day + " ";
            rect += ((tempDate.getHours() < 10) ? "0" : "") + tempDate.getHours();
            rect += ":";
            rect += ((tempDate.getMinutes() < 10) ? "0" : "") + tempDate.getMinutes();
            return rect;
        }
        /**
         * 
         * @param date
         * @return 
         * 2012/12/12 12:12
         */
        public static formatDate1(date: Date): string
        {
            var year: string = date.getFullYear().toString();
            var month: string = ((date.getMonth() + 1 < 10) ? "0" : "") + (date.getMonth() + 1);
            var day: string = ((date.getDate() < 10) ? "0" : "") + date.getDate();
            var hour: string = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours().toString();
            var min: string = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes().toString();

            return year + "/" + month + "/" + day + " " + hour + ":" + min;
        }
        /**
         * XX年XX月XX日
         */
        public static formatYMD(date: Date): string
        {
            var time: string = date.getFullYear() + this.CN_YEAR
                + (date.getMonth() + 1) + this.CN_MONTH
                + date.getDate() + this.CN_SUN;
            return time;
        }


        /**
         * 显示时间（英文格式）月/日/年
         * @return 
         */
        public static formatYMDForEn(date: Date): string
        {
            var time: string = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
            return time;
        }

        /**
         * 年/月/日（例：2012/12/12）
         */
        public static formatYMD1(date: Date): string
        {
            var time: string = date.getFullYear() + "/"
                + (date.getMonth() + 1) + "/"
                + date.getDate() + "/";
            return time;
        }

        /**
         * XX天XX时XX分XX秒
         */
        public static formatRemain(second: number): string
        {
            var day: number = Math.floor(second / 60 / 60 / 24);
            var hour: number = Math.floor(second / 60 / 60) % 24;
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            return day + this.CN_DAY + " " + hour + this.CN_HOUR + " " + min + this.CN_MIN + " " + sec + this.CN_SEC;
        }

        /**
         * XX天XX时XX分
         */
        public static formatRemain1(second: number): string
        {
            var day: number = Math.floor(second / 60 / 60 / 24);
            var hour: number = Math.floor(second / 60 / 60) % 24;
            var min: number = Math.floor(second / 60) % 60;
            return day + this.CN_DAY + hour + this.CN_HOUR + min + this.CN_MIN;
        }

        public static formatRemain3(second: number): string
        {
            var hour: number = Math.floor(second / 60 / 60) % 24;
            var min: number = Math.floor(second / 60) % 60;
            return hour + " " + this.CN_HOUR + " " + min + " " + this.CN_MIN;
        }

        /**
         * 
         * @param second
         * @return [day,hour,min]
         * 
         */
        public static formatRemain2(second: number): Array<any>
        {
            var day: number = Math.floor(second / 60 / 60 / 24);
            var hour: number = Math.floor(second / 60 / 60) % 24;
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            return [day, hour, min];
        }
        /**
         * 返回不为0的格式
         */
        public static formatRemain4(second: number): string
        {
            var str: string = "";
            let getZeroize = TimeUtil.getZeroize;
            var day: number = Math.floor(second / 60 / 60 / 24);
            if (day != 0)
            {
                str += getZeroize(day) + this.CN_DAY;
            }
            var hour: number = Math.floor(second / 60 / 60) % 24;
            if (hour != 0)
            {
                str += getZeroize(hour) + this.CN_HOUR;
            }
            var min: number = Math.floor(second / 60) % 60;
            if (min != 0)
            {
                str += getZeroize(min) + this.CN_MIN;
            }
            var sec: number = Math.floor(second % 60);
            if (sec != 0)
            {
                str += getZeroize(sec) + this.CN_SEC;
            }
            return str;
        }

        /**
         * xxd,xxh,xxm,xxs
         */
        public static formatRemain5(second: number): string
        {
            var day: number = Math.floor(second / 60 / 60 / 24);
            if (day != 0)
            {
                return day + "d";
            }
            var hour: number = Math.floor(second / 60 / 60) % 24;
            if (hour != 0)
            {
                return hour + "h";
            }
            var min: number = Math.floor(second / 60) % 60;
            if (min != 0)
            {
                return min + "m";
            }
            var sec: number = Math.floor(second % 60);
            if (sec != 0)
            {
                return sec + "s";
            }
            return "";
        }
        /**
         *  xd 00:00:00
         */
        public static formatRemain6(second: number): string
        {
            var str: string = "";
            let getZeroize = TimeUtil.getZeroize;
            var day: number = Math.floor(second / 60 / 60 / 24);
            if (day != 0)
            {
                str += day + this.CN_DAY + " ";
            }
            var hour: number = Math.floor(second / 60 / 60) % 24;
            if (hour != 0)
            {
                str += getZeroize(hour) + ":";
            } else
            {
                str += "00" + ":";
            }
            var min: number = Math.floor(second / 60) % 60;
            if (min != 0)
            {
                str += getZeroize(min) + ":";
            }
            else
            {
                str += "00" + ":";
            }
            var sec: number = Math.floor(second % 60);
            if (sec != 0)
            {
                str += getZeroize(sec);
            } else
            {
                str += "00";
            }
            return str;
        }

        /**
         *  xd 00:00:00 / 00:00 
         */
        public static formatRemain7(second: number): string
        {
            var str: string = "";
            let getZeroize = TimeUtil.getZeroize;
            var day: number = Math.floor(second / 60 / 60 / 24);
            if (day != 0)
            {
                str += day + this.CN_DAY + " ";
            }
            var hour: number = Math.floor(second / 60 / 60) % 24;
            if (hour != 0)
            {
                str += getZeroize(hour) + ":";
            }
            var min: number = Math.floor(second / 60) % 60;
            if (min != 0)
            {
                str += getZeroize(min) + ":";
            }
            else
            {
                str += "00" + ":";
            }
            var sec: number = Math.floor(second % 60);
            if (sec != 0)
            {
                str += getZeroize(sec);
            } else
            {
                str += "00";
            }
            return str;
        }

        /**
         * 返回不为0的格式X天X小时X分钟X秒
         */
        public static formatRemain8(second: number): string
        {
            var str: string = "";
            let getZeroize = TimeUtil.getZeroize;
            var day: number = Math.floor(second / 60 / 60 / 24);
            if (day != 0)
            {
                str += day + this.CN_DAY;
            }
            var hour: number = Math.floor(second / 60 / 60) % 24;
            if (hour != 0)
            {
                str += hour + this.CN_HOUR;
            }
            var min: number = Math.floor(second / 60) % 60;
            if (min != 0)
            {
                str += min + this.CN_MIN + "钟";
            }
            var sec: number = Math.floor(second % 60);
            if (sec != 0)
            {
                str += sec + this.CN_SEC;
            }
            return str;
        }
        /**
         * 00:00:00
         */
        public static formatRemainForEn(second: number): string
        {
            var day: number = Math.floor(second / 60 / 60 / 24);
            var hour: number = Math.floor(second / 60 / 60) % 24;
            var totalH: number = (day * 24 + hour);
            var min: number = Math.floor(second / 60) % 60;
            var sec: number = Math.floor(second % 60);
            var hourStr: string = totalH < 10 ? ("0" + totalH) : totalH.toString();
            var minStr: string = min < 10 ? ("0" + min) : min.toString();
            var secStr: string = sec < 10 ? ("0" + sec) : sec.toString();
            return hourStr + ":" + minStr + ":" + secStr;

        }

        /**
         * 获取两个时间之间的相差（天、时、分、秒）
         * @param time1:Number 时间1(ms)
         * @param time2:Number 时间2(ms)
         * @return Array = [天,时,分,秒]
         */
        public static getTimeDifference(time1: number, time2: number): Array<any>
        {
            var res: Array<any> = [0, 0, 0, 0];

            var val: number = time2 - time1;

            res[0] = Math.floor(val / 86400000);
            res[1] = Math.floor(val % 86400000 / 3600000);
            res[2] = Math.floor(val % 86400000 % 3600000 / 60000);
            res[3] = Math.floor(val % 86400000 % 3600000 % 60000 / 1000);

            return res;
        }

        public timeStrToDate(timeStr: string): Date
        {
            var arr: Array<string> = timeStr.split(" ");
            var yearArr: Array<any> = (arr[0]).split("-");
            var timeArr: Array<any> = (arr[1]).split("-");
            var date: Date = new Date(yearArr[0], yearArr[1], yearArr[2], timeArr[0], timeArr[1], timeArr[2]);
            return date;
        }

        /**
         * 不够两位的补零
         */
        public static dateStringFillZero(num: number): string
        {
            return (num >= 10 ? ((num * 0.1) >> 0).toString() : "0") + (num % 10).toString();
        }

        public static gettodayTimeByHour(hour: number): number
        {
            let data = this.getZoneOffsetSeverDate();
            data.setHours(hour);
            data.setMinutes(0);
            data.setSeconds(0);
            return data.getTime() / 1000;
        }

        /**
		 * 获取时分秒
		 * @param _second
		 * @return
		 *
		 */
        public static changeServerTimeToSeconds(_second: number): number
        {
            var date: Date = new Date(_second);
            var seconds: number = (date.getHours() * 3600) + (date.getMinutes() * 60) + date.getSeconds();
            return seconds;
        }

        /**
		 * 将当日时间(非时间戳)转为毫秒
		 * @param hours 小时
		 * @param minutes 分钟
		 * @param seconds 秒
		 * @return 当日时间毫秒数
		 */
        public static timeToMilSeconds(hours: number = 0, minutes: number = 0, seconds: number = 0): number
        {
            var time: number = (hours * 3600 + minutes * 60 + seconds) * 1000;
            return time;
        }

        /**
         * 获取一个指定月日时分秒时间戳（毫秒）
         */
        public static getTimeStamp2(month: number = 0, day: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0): number
        {
            var date: Date = new Date(TimeUtil.serverTime);
            date.setMonth(month - 1);
            date.setDate(day);
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            date.setMilliseconds(0);
            return date.getTime();
        }

        /**
         * 获取一个指定年月日时分秒时间戳（毫秒）
         */
        public static getTimeStamp3(year: number = 0, month: number = 0, day: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0): number
        {
            var date: Date = new Date();
            date.setFullYear(year);
            date.setMonth(month - 1);
            date.setDate(day);
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            date.setMilliseconds(0);
            return date.getTime();
        }

        /**
         * 获取当前服务器时间是周几
         */
        public static getCurDay(): number
        {
            var date: Date = new Date(TimeUtil.serverTime);
            var day: number = date.getDay();
            if (day == 0) day = 7;
            return day;
        }

        /**
        * 获取指定时 分 服务器所在的时间戳(毫秒)
        * @param hour 
        * @param minutes 
        */
        public static getTimeStamp(hour: number, minutes: number): number
        {
            let date: Date = new Date(TimeUtil.serverTime);
            date.setHours(hour);
            date.setMinutes(minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date.getTime();
        }
        /**
         * 获取距离当前时间间隔天数的时间戳
         */
        public static getDayTimeStamp(addDay: number): number
        {
            let timeStamp: number = TimeUtil.serverTime + addDay * 24 * 60 * 60 * 1000;
            return timeStamp;
        }
        /**
        * 获取指定时 分 指定时间点所在的时间戳(毫秒)
        * @param hour 
        * @param minutes 
        */
        public static getTimeStampByTime(timeStamp: number, hour: number, minutes: number): number
        {
            let date: Date = new Date(timeStamp);
            date.setHours(hour);
            date.setMinutes(minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date.getTime();
        }

        /**
		 *获取日期之间相距的天数
		 * @param startDate
		 * @param endDate
		 * @return
		 *
		 */
        public static getBetweenDays(endTime: number, startTime: number): number
        {
            return this.getTotalDaysByTime(endTime) - this.getTotalDaysByTime(startTime);
        }

        /**
        *获取经过的总天数。距离 1970 年 1 月 1 日
        * @param date
        * @return
        *
        */
        static getTotalDays(date: Date): number
        {
            var localTimeZone: number = -8;
            return Math.floor(date.getTime() - localTimeZone * 60 * 60 * 1000) / (24 * 60 * 60 * 1000);
        }

        /**
		 *获取经过的总天数。距离 1970 年 1 月 1 日
		 * @param time	毫秒级时间
		 * @return
		 *
		 */
        static getTotalDaysByTime(time: number): number
        {
            var localTimeZone: number = -8;
            return Math.floor((time - localTimeZone * 60 * 60 * 1000) / (24 * 60 * 60 * 1000));
        }

        /**
		 * 把一个时间戳转化为年月日
		 */
        public static getTimeNoHourSecond(time: number): number
        {
            var date: Date = new Date(time);
            var toDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return toDate.getTime();
        }

        /** 不足两位补0 */
        static getZeroize(time: number): string
        {
            return (time < 10) ? "0" + time : time + "";
        }

        /** 去掉小时，分，秒今天的时间戳 */
        public static getTodayStartTime(): number
        {
            return TimeUtil.getTimeNoHourSecond(TimeUtil.serverTime);
        }

        /**
         * 时间格式拆分返回
         * timeStr  --"2018-10-19 19:07:00"
         */
        public static getTimesplit(timeStr: string): Object
        {
            var timeObj = {};
            var timeArr: string[] = timeStr.split(" ");
            var timeStr1: string = timeArr[0];
            var timeStr2: string = timeArr[1];
            var timeStr1Arr: string[] = timeStr1.split("-");
            timeObj["year"] = parseInt(timeStr1Arr[0]);
            timeObj["month"] = parseInt(timeStr1Arr[1]);
            timeObj["day"] = parseInt(timeStr1Arr[2]);
            var timeStr2Arr: string[] = timeStr2.split(":");
            timeObj["hour"] = parseInt(timeStr2Arr[0]);
            timeObj["minute"] = parseInt(timeStr2Arr[1]);
            timeObj["second"] = parseInt(timeStr2Arr[2]);
            return timeObj;
        }

        /**
         * 获取今天凌晨的时间戳（昨晚12点）
         */
        public static fun10()
        {
            let today = new Date();
            return today.getTime() - today.getHours() * 60 * 60 * 1000 - today.getMinutes() * 60 * 1000 - today.getSeconds() * 1000 - today.getMilliseconds();
        }

        /** 根据年月日获取星期几 0表示星期日,1表示星期一*/
        public static getWeekByTime(year: number, month: number, day: number): number
        {
            if (month == 1 || month == 2)
            {
                month += 12;
                --year;
            }

            let week = (day + 2 * month + Math.floor(3 * (month + 1) / 5) + year +
                Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) + 1) % 7;

            return week;
        }

        /** 根据年月日获取星期几 0表示星期日,1表示星期一*/
        public static getWeekByTimeStr(year: number, month: number, day: number): string
        {
            let week = TimeUtil.getWeekByTime(year, month, day);
            let weekStr = "";
            switch (week)
            {
                case 1: weekStr = "星期一"; break;
                case 2: weekStr = "星期二"; break;
                case 3: weekStr = "星期三"; break;
                case 4: weekStr = "星期四"; break;
                case 5: weekStr = "星期五"; break;
                case 6: weekStr = "星期六"; break;
                case 0: weekStr = "星期日"; break;
            }
            return weekStr;
        }
    }
}
import TimeUtil = qmr.TimeUtil;