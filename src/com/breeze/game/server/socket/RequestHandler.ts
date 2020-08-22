module qmr {
	/**
	 *
	 * @description 请求对象
	 *
	 */
	export class RequestHandler {
    	public callBack:Function;               //收到数据后的回调
    	public timeOutCallBack:Function;        //超时后的回调，rpc回调才起作用
    	public timeOut:number;                  //超时时间,单位是秒
    	public thisObject:any;                  //回调函数的作用域对象
    	public isRpc:boolean;                   //是否是rpc
    	public isLog:boolean;                   //是否显示日志
    	public sendTime:number;                 //发送时间
    	public clientData:any;                  //携带的客户端数据
		public constructor() {
		}
	}
}
