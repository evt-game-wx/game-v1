module qmr
{
	export class BaseBean
	{
		public key: string;
		protected d: any;
		constructor(d)
		{
			this.d = d;
		}

		/** 用于两个值相merge */
		public merge(bean, rate: number = 1)
		{
			if (bean && bean.hasOwnProperty('d'))
			{
				let element = bean['d'];
				if (!this.key)
				{
					this.key = bean.key;
				}
				let sd = this.d;
				if (!sd)
				{
					sd = new Object();
					this.d = sd;
				}
				let t = this;
				for (var key in element)
				{
					let char = element[key];
					if (typeof (char) === "number")
					{
						if (!sd[key]) sd[key] = 0;
						if (!char) char = 0;
						sd[key] = parseFloat(sd[key]) + char * rate;
					}
					else if (typeof (char) === "string")
					{
						if (!sd[key]) sd[key] = "";
						if (!char) char = "";
						sd[key] = char;
					}
					else if (typeof (char) === "boolean")
					{
						if (!char) char = false;
						sd[key] = char;
					}
					else
					{
						sd[key] = char;
					}
				}
			}
		}

		public setRate(rate: number)
		{
			let sd = this.d;
			for (var key in sd)
			{
				let char: any = sd[key];
				if (typeof (char) === "number")
				{
					char = char * rate;
					sd[key] = char;
				}
			}
		}
	}
}