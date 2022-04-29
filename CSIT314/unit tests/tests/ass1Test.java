import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Comparator;

import static org.junit.Assert.*;

public class ass1Test {
    private String fileName;

    @Before
    public void setUp() throws Exception {
        int lengthOfString = (int)Math.floor(Math.random()*(1000-1+1)+1);
        fileName = "";
        for(int i=0; i<lengthOfString; i++){
            int randomNumberGreater = (int)Math.floor(Math.random()*(126-32+1)+32);
            fileName += (char)randomNumberGreater;
        }

    }

    @After
    public void tearDown() throws Exception {
        this.fileName = null;
    }

    @Test
    public void getFileName() {

        //test case justification
        //as getFileName requires a user input the test data cannot be empty as the scanner...
        // will find no line, the value should be initialized to a value other than null
        // as getFileName returns a string as such a string of random length between 1 and 1000 characters...
        // is randomly generate this is then passed to the getFileName
        //and compared at the end to ensure that the string remains unchanged.
        //a input stream is defined to automate use input

        InputStream sysInBackup = System.in;
        ByteArrayInputStream in = new ByteArrayInputStream(fileName.getBytes());
        System.setIn(in);
        String actual = ass1.getFileName();

        assertEquals(fileName, actual);
        System.setIn(sysInBackup);

    }

    @Test
    public void readTreeToArray() {
        ass1 a = new ass1();

        Word[] data_original = a.data.clone();

        //case 1 - null node passed
        //should do nothing
        a.readTreeToArray(null);

        //should not have changed the data array
        assertEquals(data_original, a.data);
        //should not have changed dataCount
        assertEquals(0, a.dataCount);

        //case 2 - single node passed
        //should result in single array entry
        a = new ass1();

        //create single AVLNode and convert to array
        Word test_word = new Word("testword");
        AVLNode root = new AVLNode(test_word);
        a.readTreeToArray(root);

        //should now be one entry in the data array
        assertEquals(1, a.dataCount);
        //single entry should contain the word that was passed to root AVLNode constructor
        assertEquals(test_word, a.data[0]);

        //case 3 - normal case with populated AVL tree
        a = new ass1();
        //create required test words
        Word word1 = new Word("word1");
        Word word2 = new Word("word2");
        Word word3 = new Word("word3");

        //initialize the root node and insert test words into tree
        root = new AVLNode(test_word);
        root = AVLTree.insertNode(root, word1);
        root = AVLTree.insertNode(root, word2);
        root = AVLTree.insertNode(root, word3);

        //read avl tree into data array
        a.readTreeToArray(root);

        //all words should be in the data array in alphabetical order
        //if all these cases are satisfied then it is verified that...
        //the readTreeToArray function is working correctly
        assertEquals(test_word, a.data[1]);
        assertEquals(word1, a.data[2]);
        assertEquals(word2, a.data[3]);
        assertEquals(word3, a.data[4]);
    }

    @Test
    public void mergeSort() {
        ass1 a = new ass1();

        //case 1 - empty array of words
        Word[] test_array = new Word[0];
        Word[] original_array = test_array.clone();

        a.mergeSort(test_array, 0);

        //mergeSort should not mutate an empty array
        //expect both to still be the same
        assertArrayEquals(original_array, test_array);

        //case 2 - array with one element
        test_array = new Word[1];
        test_array[0] = new Word("myword");
        original_array = test_array.clone();

        a.mergeSort(test_array, 1);

        //mergeSort should not mutate a single element array
        //expect both to still be the same
        assertArrayEquals(original_array, test_array);

        //case 3 - invalid dataCount: dataCount < 0
        //dataCount should be a non-negative integer
        //using original un-mutated array from above
        test_array = original_array.clone();
        a.mergeSort(test_array, -1);

        //mergeSort does not have specific protection against bad dataCount
        //values, but it implicitly treats negative values as an empty array.
        //array should ideally remain un-mutated from the original
        assertArrayEquals(original_array, test_array);

        //case 4 - normal array with correct arguments
        //generates a random number between 2 and 1001
        int numWords = (int)Math.floor((Math.random() * 1000) + 2);
        test_array = new Word[numWords];
        for (int i = 0; i < numWords; i++){
            //populate the test_array with random words
            String word = "";

            //generate words with random length - 0-99
            int wordLength = (int)Math.random() * 100;

            for(int j = 0; j < wordLength; i++){
                //generate a random char and append to word string
                word += (char)(int)(Math.random() * 95 + 32);
            }
            test_array[i] = new Word(word);
        }
        original_array = test_array.clone();

        //test_array is an array of random size (2-1001) of Word objects
        //each Word object has a count of 1 and has a random length (0-99)
        //this represents a normal application of the mergeSort function
        a.mergeSort(test_array, test_array.length);

        //this uses the built in Java sorting functionality as an oracle
        //we assume that it works correctly and can use it to validate mergeSort
        Arrays.sort(original_array, Comparator.comparing(Word::getCount));

        //test that the outputs are the same
        //this test can be run multiple times using a range of random arrays
        assertArrayEquals(original_array, test_array);

        //case 5 - invalid dataCount: dataCount > 0
        //in this case mergeSort is only aware of Words up to the dataCount index
        //it is expected that only the first n objects will be sorted (n = dataCount)
        //generates a random number between 10 and 1009
        numWords = (int)Math.floor((Math.random() * 1000) + 10);
        int numWordsExcluded = (int)(Math.random() * numWords);
        test_array = new Word[numWords];
        for (int i = 0; i < numWords; i++){
            //populate the test_array with random words
            String word = "";

            //generate words with random length - 0-99
            int wordLength = (int)Math.random() * 100;

            for(int j = 0; j < wordLength; i++){
                //generate a random char and append to word string
                word += (char)(int)(Math.random() * 95 + 32);
            }
            test_array[i] = new Word(word);
        }
        original_array = test_array.clone();

        //test_array is an array of random size (10-1009) of Word objects
        //each Word object has a count of 1 and has a random length (0-99)
        //this test provides an incorrect value for dataCount
        a.mergeSort(test_array, test_array.length - numWordsExcluded);

        //this uses the built in Java sorting functionality as an oracle
        //the above test is the same as using the built in functions to sort an array containing
        //only the first n elements of the original_array (n = dataCount)
        //create a new array from the required elements and call Arrays.sort()
        Word[] truncated_array = new Word[original_array.length - numWordsExcluded];
        System.arraycopy(original_array, 0, truncated_array, 0, original_array.length - numWordsExcluded);
        Arrays.sort(truncated_array, Comparator.comparing(Word::getCount));

        //the first n elements of the resulting test_array should be in the same order as elements in truncated_array
        //break the first n elements of test_array into their own array and test if same as truncated_array
        Word[] trimmed_test_array = new Word[original_array.length - numWordsExcluded];
        System.arraycopy(test_array, 0, trimmed_test_array, 0, original_array.length - numWordsExcluded);

        //test that the outputs are the same
        //this test can be run multiple times using a range of random arrays
        //these should be the same if mergeSort is working as expected
        assertArrayEquals(truncated_array, trimmed_test_array);
    }
}