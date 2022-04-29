
/*container for unique word and counter*/
class Word {
	String word;
	int count = 1;

	Word(String word) {
		this.word = word;
	}

	int getCount() {
		return count;
	}

	int compareTo(Word word) {
		// used by insert function to order alphabetically
		if (this.word.compareTo(word.word) < 0) {
			return -1;
		} else if (this.word.compareTo(word.word) > 0) {
			return 1;
		} else {
			return 0;
		}
	}
}