import java.util.Scanner;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;


public class ass1 {
	public static AVLTree avl = new AVLTree();
	public static Word[] data = new Word[50000];
	public static int dataCount = 0;
	public static int totWords = 0;

	/* query user for file name */
	public static String getFileName() {
		Scanner input = new Scanner(System.in);
		System.out.print("Enter filename: ");
		String fileName = input.nextLine();
		input.close();
		return fileName;
	}

	/* performs in-order traversal of avl tree and migrates data to array */
	public static void readTreeToArray(AVLNode node) {
		// do nothing if node is null
		if (node == null)
			return;

		// look through left child first
		readTreeToArray(node.leftNode);

		// move this nodes data to array
		data[dataCount] = node.key;
		dataCount++;

		// look through right child next
		readTreeToArray(node.rightNode);
	}

	/* primary merge sort driver function - called on array of words */
	public static void mergeSort(Word[] array, int dataCount) {
		// if the array only has 1 item, or is empty, then it is already sorted
		if (dataCount < 2) {
			return;
		}
		// split into two - divide and conquer approach
		int midIdx = dataCount / 2;
		Word[] lArray = new Word[midIdx];
		Word[] rArray = new Word[dataCount - midIdx];

		for (int i = 0; i < midIdx; i++) {
			lArray[i] = array[i];
		}
		for (int i = midIdx; i < dataCount; i++) {
			rArray[i - midIdx] = array[i];
		}
		// recursive call to merge sort - the base case is when max 2 items in array
		mergeSort(lArray, midIdx);
		mergeSort(rArray, dataCount - midIdx);
		// finally rejoin sorted arrays
		merge(array, lArray, rArray, midIdx, dataCount - midIdx);
	}

	/* dedicated merge function - only called by mergeSort driver */
	public static void merge(Word[] array, Word[] lArray, Word[] rArray, int left, int right) {

		int lArrayIdx = 0, rArrayIdx = 0, arrayIdx = 0;
		// standard implementation of merge process
		while (lArrayIdx < left && rArrayIdx < right) {
			if (lArray[lArrayIdx].count >= rArray[rArrayIdx].count) {
				array[arrayIdx++] = lArray[lArrayIdx++];
			} else {
				array[arrayIdx++] = rArray[rArrayIdx++];
			}
		}
		while (lArrayIdx < left) {
			array[arrayIdx++] = lArray[lArrayIdx++];
		}
		while (rArrayIdx < right) {
			array[arrayIdx++] = rArray[rArrayIdx++];
		}
	}

	public static void main(String[] args) {
		try {
			// file reading stuff here
			BufferedReader indata = new BufferedReader(new FileReader(getFileName()));
			String line, words[];
			while ((line = indata.readLine()) != null) {
				// skip line if empty
				if (line.compareTo("") == 0) {
					continue;
				}
				// preprocessing
				words = line.replaceAll("[^a-zA-Z ]", "").toLowerCase().split(" ");

				// add word to avl tree
				for (int i = 0; i < words.length; i++) {
					avl.rootNode = AVLTree.insertNode(avl.rootNode, new Word(words[i]));
					totWords++;
				}
			}
		} catch (FileNotFoundException e) {
			// handle file not found case
			e.printStackTrace();
			return;
		} catch (IOException e) {
			// handle io problems
			e.printStackTrace();
			return;
		}
		// move to array and sort
		readTreeToArray(avl.rootNode);
		mergeSort(data, dataCount);

		// data output as required
		if (dataCount <= 20) {
			// output everything when <20 items to prevent output overlap...
			// or array out of bounds problems
			for (int i = 0; i < dataCount; i++) {
				System.out.println(data[i].count + " x " + data[i].word);
			}
		} else {
			for (int i = 0; i < 10; i++) {
				System.out.println(data[i].count + " x " + data[i].word);
			}
			for (int i = dataCount - 10; i < dataCount; i++) {
				System.out.println(data[i].count + " x " + data[i].word);
			}
		}
		// always output total and unique words fyi
		// this is interesting but not required for desired output
		System.out.println("FINAL WORD COUNT: " + totWords);
		System.out.println("UNIQUE WORDS: " + dataCount);
	}
}
