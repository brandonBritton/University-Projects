/* implementation of AVL tree */
class AVLTree {
	AVLNode rootNode;

	static AVLNode insertNode(AVLNode node, Word key) {
		// recursive insert function looks through tree and places new leaf
		// the tree is rebalanced after each insert except for when count...
		// is incremented or root added (in which case balancing is pointless)
		if (node == null) {
			return new AVLNode(key);
		} else if (node.key.compareTo(key) == 1) {
			node.leftNode = insertNode(node.leftNode, key);
		} else if (node.key.compareTo(key) == -1) {
			node.rightNode = insertNode(node.rightNode, key);
		} else {
			node.key.count++;
			return node;
		}
		return rebalanceTree(node);
	}

	/* simple height update function */
	/* takes a node and recalculates its height */
	static void updateHeight(AVLNode node) {
		node.height = 1 + Math.max(getNodeHeight(node.leftNode), getNodeHeight(node.rightNode));
	}

	/* returns the height value of a non-null node */
	static int getNodeHeight(AVLNode node) {
		if (node == null) {
			return -1;
		} else {
			return node.height;
		}
	}

	/*
	 * check tree balance - used to determine whether right or left rotation is
	 * needed
	 */
	static int checkBalance(AVLNode node) {
		if (node == null) {
			return 0;
		} else {
			return getNodeHeight(node.rightNode) - getNodeHeight(node.leftNode);
		}
	}

	/*
	 * there are 4 rebalancing cases - this determines which is needed and executes
	 * the case
	 */
	static AVLNode rebalanceTree(AVLNode node) {
		updateHeight(node);
		int balance = checkBalance(node);
		if (balance > 1) {
			if (getNodeHeight(node.rightNode.rightNode) > getNodeHeight(node.rightNode.leftNode)) {// case 1
				node = rotateLeft(node);
			} else {// case 2
				node.rightNode = rotateRight(node.rightNode);
				node = rotateLeft(node);
			}
		} else if (balance < -1) {
			if (getNodeHeight(node.leftNode.leftNode) > getNodeHeight(node.leftNode.rightNode)) {// case 3
				node = rotateRight(node);
			} else {// case 4
				node.leftNode = rotateLeft(node.leftNode);
				node = rotateRight(node);
			}
		}
		return node;
	}

	/* performs right rotation on passed node */
	static AVLNode rotateRight(AVLNode y) {
		AVLNode x = y.leftNode;
		AVLNode z = x.rightNode;
		x.rightNode = y;
		y.leftNode = z;
		updateHeight(y);
		updateHeight(x);
		return x;
	}

	/* performs left rotation on passed node */
	static AVLNode rotateLeft(AVLNode y) {
		// System.err.println("Rotate LEFT: " + y.key.word);
		AVLNode x = y.rightNode;
		AVLNode z = x.leftNode;
		x.leftNode = y;
		y.rightNode = z;
		updateHeight(y);
		updateHeight(x);
		return x;
	}
}