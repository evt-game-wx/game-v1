module qmr
{
	/**
	 * 实现一个简单的链表结构
	 */
	export class LinkedList
	{
		private _head: LinkNode;//头节点
		private nodeLen: number = 0;//节点长度

		public constructor()
		{

		}

		/**
		 * 添加一个节点
		 */
		public append(element): void
		{
			var node: LinkNode = new LinkNode(element);
			var current: LinkNode;
			if (!this._head)//直接设置头节点
			{
				this._head = node;
			}
			else
			{
				current = this._head;
				while (current.next)
				{
					current = current.next;
				}
				current.next = node;//放到链表尾
			}
			this.nodeLen += 1;

		}

		/**获取节点索引*/
		public indexOf(element): number
		{
			if (!this._head) return -1;
			var index: number = -1;
			var current: LinkNode = this._head;
			while (current)
			{
				index += 1;
				if (current.current === element)
				{
					return index;
				}
				current = current.next;
			}
			return -1;
		}

		/**
		 * 移除某个索引位置的节点
		 */
		public removeAt(pos: number): void
		{
			if (!this._head) return;
			if (pos > -1 && pos < this.size)
			{
				if (pos == 0)//删除头节点
				{
					this._head = this._head.next;
				}
				else
				{
					var currentNode: LinkNode = this.getNodeAt(pos);
					var prevNode: LinkNode = this.getNodeAt(pos - 1);
					if (currentNode && prevNode)//前个节点和后个节点链接起来
					{
						prevNode.next = currentNode.next;
					}
				}

				this.nodeLen -= 1;
			}
		}

		/**
		 * 获取某个索引下的节点
		 */
		public getNodeAt(index: number): LinkNode
		{
			if (!this._head) return null;
			var current: LinkNode = this._head;
			var ind: number = -1;
			while (current)
			{
				ind += 1;
				if (ind === index)
				{
					return current;
				}
				current = current.next;
			}
			return null;
		}

		/**获取一个头节点*/
		public get head(): LinkNode
		{
			return this._head;
		}

		/**节点长度*/
		public get size(): number
		{
			return this.nodeLen;
		}
	}

	/**
	 * 链表中的节点
	 */
	export class LinkNode
	{
		/**当前自身信息*/
		public current: any;
		/**下个节点*/
		public next: LinkNode;

		public constructor(element)
		{
			this.current = element;
		}

	}
}