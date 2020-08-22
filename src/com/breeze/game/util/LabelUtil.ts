module qmr
{
	export class LabelUtil
	{
		public static addInputListener(textInput: eui.TextInput, thisObject: any)
		{
			textInput.addEventListener(egret.FocusEvent.FOCUS_IN, LabelUtil.focusInTxtHandler, thisObject)
			textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, LabelUtil.focusInTxtHandler, thisObject)
		}

		public static removeInputListener(textInput: eui.TextInput, thisObject: any)
		{
			textInput.addEventListener(egret.FocusEvent.FOCUS_IN, LabelUtil.focusInTxtHandler, thisObject)
			textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, LabelUtil.focusInTxtHandler, thisObject)
		}

		public static focusInTxtHandler()
		{
			var inputFocus = function ()
			{
				if (document && document.body)
				{
					setTimeout(function ()
					{
						if(window.scrollTo){
							window.scrollTo(0, document.body.clientHeight);
						}
						
					}, 400);
				}
			};
			inputFocus();
		}
	}
}