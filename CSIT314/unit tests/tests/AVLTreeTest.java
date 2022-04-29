import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Random;

import static org.junit.Assert.*;

public class AVLTreeTest {

    private Word key;
    private AVLNode node;
    private AVLNode node_left;
    private AVLNode node_right;
    private Random rand;
    private static final AVLTree avl = new AVLTree();
    private static Word[] unbalancedTree = new Word[50];
    private static Word[] expectedTree = new Word[50];
    private static int dataCount = 0;
    private int nodeCount = 0;

    @Before
    public void setUp() throws Exception {

        this.key = new Word("key");
        this.node = null;
        this.node_left = null;
        this.node_right = null;
        rand = new Random();
        avl.rootNode = null;
        this.nodeCount = 0;
    }

    @After
    public void tearDown() throws Exception {

        this.key = null;
        this.node = null;
        this.node_left = null;
        this.node_right = null;
        this.rand = null;
    }

    // for use in @Test rebalanceTree()
    public static void generateTestTreeData(String file, Word[] data) throws IOException {
        try {
            BufferedReader inData = new BufferedReader(new FileReader(file));
            String line;
            while ((line = inData.readLine()) != null) {
                if (line.compareTo("") == 0) {
                    continue;
                }
                Word word = new Word(line);
                data[dataCount] = word;
                dataCount++;
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        dataCount = 0;
    }

    // for use in @Test rebalanceTree()
    public static void readTreeToArray(AVLNode node, Word[] tree) {
        if (node == null)
            return;
        readTreeToArray(node.leftNode, tree);
        tree[dataCount] = node.key;
        dataCount++;
        readTreeToArray(node.rightNode, tree);
    }

    // for use in @Test insertNode()
    public void inorderTraversal(AVLNode node) {
        // do nothing if node is null
        if (node == null)
            return;
        // look through left child first
        this.inorderTraversal(node.leftNode);
        this.nodeCount++;
        // look through right child next
        this.inorderTraversal(node.rightNode);

    }

    @Test
    public void insertNode() {

        //check that the node exists in the tree
        //create a new node add node to an empty array assert that there is only 1 object in the tree.
        //insert the same node check if the count has gone to two.
        //insert and unique new node and ensure that there are two instances in the array.

        //----ORACLE---- Node count is set to 0 as no nodes have been added to the avl tree.
        assertEquals(0, nodeCount);
        //----ORACLE----


        Word w = new Word("Word");
        Word x = new Word("Yeet");
        //root node
        AVLNode node = new AVLNode(w);
        node.height = 0;
        node.leftNode = null;
        node.rightNode = null;

        node = AVLTree.insertNode(node, x);
        inorderTraversal(node);

        //look at root node
        //if not null traverse to and check if null everytime something is not null increment counter.

        //----ORACLE---- 2 nodes have been added to the tree as such the count is expected be 2
        assertEquals(2, nodeCount);
        //----ORACLE----

        Word a = new Word("Word");
        node = AVLTree.insertNode(node, a);

        //----ORACLE---- a duplicate node is added the count is not expected to change
        assertEquals(2, nodeCount);
        //----ORACLE----

    }

    @Test
    public void updateHeight() {

        // assert that initial null node is passed correctly
        assertNull("Tested passing node - Expected: null", this.node);

        // test data init
        int bound_start = 1;
        int bound_end = 2147483647;

        this.node = new AVLNode(this.key);
        AVLNode left_node = new AVLNode(new Word("left"));
        AVLNode right_node = new AVLNode(new Word("right"));
        this.node.leftNode = left_node;
        this.node.rightNode = right_node;

        // ------------------ ORACLE ------------------
        // generate test data for height values
        // equivalence partition test (teamed with random)
        for (int i = 0; i < 50; i++) {
            this.node.height = rand.nextInt(bound_end - bound_start + 1) + bound_start;
            left_node.height = rand.nextInt(bound_end - bound_start + 1) + bound_start;
            right_node.height = rand.nextInt(bound_end - bound_start + 1) + bound_start;
            int expected = 1 + Math.max(AVLTree.getNodeHeight(this.node.leftNode), AVLTree.getNodeHeight(this.node.rightNode));

            AVLTree.updateHeight(this.node);

            // assert that all height values should remain positive
            assertTrue("Tested height value should be positive - Expected: >= 0", this.node.height >= 0);

            // assert that height updates correctly
            assertEquals("Tested height value update", expected, AVLTree.getNodeHeight(this.node));
        }
        // -------------------------------------------
    }

    @Test
    public void rebalanceTree() throws IOException {

        // assert that initial null node is passed correctly
        assertNull("Tested passing node - Expected: null", this.node);

        // test data init
        generateTestTreeData("unit tests/test resources/randomWords", unbalancedTree);
        generateTestTreeData("unit tests/test resources/balancedTree", expectedTree);

        for (Word word : unbalancedTree) {
            avl.rootNode = AVLTree.insertNode(avl.rootNode, new Word(word.word));
        }

        // reads balanced tree to array to compare test data with expected data
        readTreeToArray(avl.rootNode, unbalancedTree);

        // assert that newly balanced tree is rebalanced correctly with expected balance
        for(int i = 0; i < expectedTree.length; i++) {
            assertEquals("Tested known set comparison", expectedTree[i].word, unbalancedTree[i].word);
        }
    }

    @Test
    public void getNodeHeight() {
        int height_0 = -2147483648;
        int height_1 = -1;
        int height_2 = rand.nextInt(height_1 - height_0) + height_0;
        int height_3 = 0;
        int height_4 = 1;
        int height_5 = 2147483647;
        int height_6 = rand.nextInt(height_5 - height_4) + height_4;

        assertEquals("Test getNodeHeight() with null node", -1, AVLTree.getNodeHeight(this.node));

        this.node = new AVLNode(this.key);              //equivalence partition test
        
        this.node.height = height_0;
        assertEquals("Test getNodeHeight() with node.height", height_0, AVLTree.getNodeHeight(this.node));   //boundary value analysis test
     
        this.node.height = height_1;
        assertEquals("Test getNodeHeight() with node.height", height_1, AVLTree.getNodeHeight(this.node));      //equivalence partition test (teamed with random)

        this.node.height = height_2;
        assertEquals("Test getNodeHeight() with node.height", height_2, AVLTree.getNodeHeight(this.node));    //boundary value analysis test

        this.node.height = height_3;
        assertEquals("Test getNodeHeight() with node.height", height_3, AVLTree.getNodeHeight(this.node));     //boundary value analysis test

        this.node.height = height_4;
        assertEquals("Test getNodeHeight() with node.height", height_4, AVLTree.getNodeHeight(this.node));      //equivalence partition test (teamed with random)

        this.node.height = height_5;
        assertEquals("Test getNodeHeight() with node.height", height_5, AVLTree.getNodeHeight(this.node));      //boundary value analysis test

        this.node.height = height_6;
        assertEquals("Test getNodeHeight() with node.height", height_6, AVLTree.getNodeHeight(this.node)); 
    }

    @Test
    public void checkBalance() {
        int height_0 = -2147483648;
        int height_1 = -1;
        int height_2 = rand.nextInt(height_1 - height_0) + height_0;     
        int height_3 = 0;
        int height_4 = 1;
        int height_5 = 2147483647;
        int height_6 = rand.nextInt(height_5 - height_4) + height_4; 

        int array_size = 7;
        int[] values = {height_0, height_1, height_2, height_3, height_4, height_5, height_6};

        //----ORACLE---- the expected value for passing a null node is simply 0
        assertEquals("Test checkBalance() null", 0, AVLTree.checkBalance(node));
        //----ORACLE----

        node = new AVLNode(key);
        node_left = new AVLNode(key);
        node_right = new AVLNode(key);
        node.leftNode = node_left;
        node.rightNode = node_right;

        for(int j = 0; j < array_size + 1; j++){
            for(int k = 0; k < array_size + 1; k++){
                if(j == array_size) node.leftNode = null;
                else node.leftNode.height = values[j];

                if(k == array_size) node.rightNode = null;
                else node.rightNode.height = values[k];

                //----ORACLE----
                int left_value;
                if(node.leftNode == null) left_value = -1;
                else left_value = values[j];

                int right_value;
                if(node.rightNode == null) right_value = -1;
                else right_value = values[k];

                int expected_value = right_value- left_value;
                
                assertEquals("Test checkBalance() all values", expected_value, AVLTree.checkBalance(node));
                //----ORACLE----

                if(node.leftNode == null) node.leftNode = new AVLNode(key);
                if(node.rightNode == null) node.rightNode = new AVLNode(key);
            }
        }
    }

    @Test
    public void rotateRight() {

        int height_0 = -2147483648;
        int height_1 = -1;
        int height_2 = rand.nextInt(height_1 - height_0) + height_0;
        int height_3 = 0;
        int height_4 = 1;
        int height_5 = 2147483647;
        int height_6 = rand.nextInt(height_5 - height_4) + height_4;
        int array_size = 7;
        int[] values = {height_0, height_1, height_2, height_3, height_4, height_5, height_6};

        //case 1
        AVLNode node_Y = null;
        try{
            AVLTree.rotateRight(node_Y);
            fail("null input node did not throw error");
        }
        catch(NullPointerException e){}

        //case 2
        node_Y = new AVLNode(new Word("Y"));

        try{
            AVLTree.rotateRight(node_Y);
            fail("null leftNode value for input node did not throw error");
        }
        catch(NullPointerException e){}

        //case 3
        {
            node_Y = new AVLNode(new Word("Y"));
            node_Y.leftNode = new AVLNode(new Word("X"));

            String input_key = node_Y.key.word;
            AVLNode node_Z = node_Y.leftNode.rightNode;
            AVLNode node_X = AVLTree.rotateRight(node_Y);
            assertEquals("Test rotateRight() return value's rightNode key equals input values key", input_key, node_X.rightNode.key.word);
            //because input values leftNode.rightNode = null, then we should expect the output values rightNode.leftNode = null
            assertEquals("Test rotateRight() return value's rightNode.leftNode equals input values leftNode.rightNode", node_Z, node_X.rightNode.leftNode);
            //Because node X.leftNode is never initialised, the height expected value for this is set as -1 as is done in the getNodeHeight function for null nodes.
            assertEquals("Test rotateRight() return value's height is 1 + the greater height value of its leftNode and rightNodes", 1 + Math.max(-1, node_X.rightNode.height), node_X.height);
        }

        //case 4
        for(int i = 0; i < array_size; i++){
            node_Y = new AVLNode(new Word("Y"));
            node_Y.leftNode = new AVLNode(new Word("X"));
            node_Y.rightNode= new AVLNode(new Word("B"));

            node_Y.rightNode.height = values[i];

            String input_key = node_Y.key.word;
            AVLNode node_Z = node_Y.leftNode.rightNode;

            AVLNode node_X = AVLTree.rotateRight(node_Y);

            assertEquals("Test rotateRight() return value's rightNode key equals input values key", input_key, node_X.rightNode.key.word);
            //because input values leftNode.rightNode = null, then we should expect the output values rightNode.leftNode = null
            assertEquals("Test rotateRight() return value's rightNode.leftNode equals input values leftNode.rightNode", node_Z, node_X.rightNode.leftNode);
            //Because node X.leftNode is never initialised, the height expected value for this is set as -1 as is done in the getNodeHeight function for null nodes.
            assertEquals("Test rotateRight() return value's height is 1 + the greater height value of its leftNode and rightNodes", 1 + Math.max(-1, node_X.rightNode.height), node_X.height);
        }

        //case 5
        for(int i = 0; i < array_size; i++){
            node_Y = new AVLNode(new Word("Y"));
            node_Y.leftNode = new AVLNode(new Word("X"));
            node_Y.leftNode.leftNode = new AVLNode(new Word("A"));

            node_Y.leftNode.leftNode.height = values[i];

            String input_key = node_Y.key.word;
            AVLNode node_Z = node_Y.leftNode.rightNode;

            AVLNode node_X = AVLTree.rotateRight(node_Y);

            assertEquals("Test rotateRight() return value's rightNode key equals input values key", input_key, node_X.rightNode.key.word);
            //because input values leftNode.rightNode = null, then we should expect the output values rightNode.leftNode = null
            assertEquals("Test rotateRight() return value's rightNode.leftNode equals input values leftNode.rightNode", node_Z, node_X.rightNode.leftNode);
            assertEquals("Test rotateRight() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.leftNode.height , node_X.rightNode.height));
        }

        //case 6
        for(int i = 0; i < array_size; i++){
            for(int j = 0; j < array_size; j++){
                node_Y = new AVLNode(new Word("Y"));
                node_Y.leftNode = new AVLNode(new Word("X"));
                node_Y.leftNode.leftNode = new AVLNode(new Word("A"));
                node_Y.rightNode = new AVLNode(new Word("B"));

                node_Y.leftNode.leftNode.height = values[i];
                node_Y.rightNode.height = values[j];

                String input_key = node_Y.key.word;
                AVLNode node_Z = node_Y.leftNode.rightNode;

                AVLNode node_X = AVLTree.rotateRight(node_Y);

                assertEquals("Test rotateRight() return value's rightNode key equals input values key", input_key, node_X.rightNode.key.word);
                //because input values leftNode.rightNode = null, then we should expect the output values rightNode.leftNode = null
                assertEquals("Test rotateRight() return value's rightNode.leftNode equals input values leftNode.rightNode", node_Z, node_X.rightNode.leftNode);
                assertEquals("Test rotateRight() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.leftNode.height , node_X.rightNode.height));
            }
        }

        //case 7
        for(int i = 0; i < array_size; i++){
            node_Y = new AVLNode(new Word("Y"));
            node_Y.leftNode = new AVLNode(new Word("X"));
            node_Y.leftNode.rightNode = new AVLNode(new Word("Z"));

            node_Y.leftNode.rightNode.height = values[i];

            String input_key = node_Y.key.word;
            String node_Z_key = node_Y.leftNode.rightNode.key.word;

            AVLNode node_X = AVLTree.rotateRight(node_Y);
            assertEquals("Test rotateRight() return value's rightNode key equals input values key", input_key, node_X.rightNode.key.word);
            assertEquals("Test rotateRight() return value's rightNode.leftNode key equals input values leftNode.rightNode key", node_Z_key, node_X.rightNode.leftNode.key.word);
            //Because node X.leftNode is never initialised, the height expected value for this is set as -1 as is done in the getNodeHeight function for null nodes.
            assertEquals("Test rotateRight() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(-1 , node_X.rightNode.height));
        }

        //case 8
        for(int i = 0; i < array_size; i++){
            for(int j = 0; j < array_size; j++){
                node_Y = new AVLNode(new Word("Y"));
                node_Y.leftNode = new AVLNode(new Word("X"));
                node_Y.leftNode.rightNode = new AVLNode(new Word("Z"));
                node_Y.rightNode= new AVLNode(new Word("B"));

                node_Y.leftNode.rightNode.height = values[i];
                node_Y.rightNode.height = values[j];

                String input_key = node_Y.key.word;
                String node_Z_key = node_Y.leftNode.rightNode.key.word;

                AVLNode node_X = AVLTree.rotateRight(node_Y);
                assertEquals("Test rotateRight() return value's rightNode key equals input values key", input_key, node_X.rightNode.key.word);
                assertEquals("Test rotateRight() return value's rightNode.leftNode key equals input values leftNode.rightNode key", node_Z_key, node_X.rightNode.leftNode.key.word);
                //Because node X.leftNode is never initialised, the expected height value for this is set as -1 as is done in the getNodeHeight function for null nodes.
                assertEquals("Test rotateRight() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(-1 , node_X.rightNode.height));
            }
        }

        //case 9
        for(int i = 0; i < array_size; i++){
            for(int j = 0; j < array_size; j++){
                node_Y = new AVLNode(new Word("Y"));
                node_Y.leftNode = new AVLNode(new Word("X"));
                node_Y.leftNode.rightNode = new AVLNode(new Word("Z"));
                node_Y.leftNode.leftNode = new AVLNode(new Word("A"));

                node_Y.leftNode.rightNode.height = values[i];
                node_Y.leftNode.leftNode.height = values[j];

                String input_key = node_Y.key.word;
                String node_Z_key = node_Y.leftNode.rightNode.key.word;

                AVLNode node_X = AVLTree.rotateRight(node_Y);
                assertEquals("Test rotateRight() return value's rightNode key equals input values key", input_key, node_X.rightNode.key.word);
                assertEquals("Test rotateRight() return value's rightNode.leftNode key equals input values leftNode.rightNode key", node_Z_key, node_X.rightNode.leftNode.key.word);
                assertEquals("Test rotateRight() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.leftNode.height, node_X.rightNode.height));
            }
        }

        //case 10
        for(int i = 0; i < array_size; i++){
            for(int j = 0; j < array_size; j++){
                for(int k = 0; k < array_size; k++){
                    node_Y = new AVLNode(new Word("Y"));
                    node_Y.leftNode = new AVLNode(new Word("X"));
                    node_Y.leftNode.rightNode = new AVLNode(new Word("Z"));
                    node_Y.leftNode.leftNode = new AVLNode(new Word("A"));
                    node_Y.rightNode = new AVLNode(new Word("B"));

                    node_Y.leftNode.rightNode.height = values[i];
                    node_Y.leftNode.leftNode.height = values[j];
                    node_Y.rightNode.height = values[k];

                    String input_key = node_Y.key.word;
                    String node_Z_key = node_Y.leftNode.rightNode.key.word;
                    AVLNode node_X = AVLTree.rotateRight(node_Y);

                    assertEquals("Test rotateRight() return value's rightNode key equals input values key", input_key, node_X.rightNode.key.word);
                    assertEquals("Test rotateRight() return value's rightNode.leftNode key equals input values leftNode.rightNode key", node_Z_key, node_X.rightNode.leftNode.key.word);
                    assertEquals("Test rotateRight() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.leftNode.height, node_X.rightNode.height));
                }
            }
        }
    }

    @Test
    public void rotateLeft() {

        int height_0 = -2147483648;
        int height_1 = -1;
        int height_2 = rand.nextInt(height_1 - height_0) + height_0;
        int height_3 = 0;
        int height_4 = 1;
        int height_5 = 2147483647;
        int height_6 = rand.nextInt(height_5 - height_4) + height_4;
        int array_size = 7;
        int[] values = {height_0, height_1, height_2, height_3, height_4, height_5, height_6};

        //case 1
        AVLNode node_Y = null;
        try{
            AVLTree.rotateLeft(node_Y);
            fail("null input node did not throw error");
        }
        catch(NullPointerException e){}

        //case 2
        node_Y = new AVLNode(new Word("Y"));

        try{
            AVLTree.rotateLeft(node_Y);
            fail("null leftNode value for input node did not throw error");
        }
        catch(NullPointerException e){}

        //case 3
        {
            node_Y = new AVLNode(new Word("Y"));
            node_Y.rightNode = new AVLNode(new Word("X"));

            String input_key = node_Y.key.word;
            AVLNode node_Z = node_Y.rightNode.leftNode;
            AVLNode node_X = AVLTree.rotateLeft(node_Y);
            assertEquals("Test rotateLeft() return value's leftNode key equals input values key", input_key, node_X.leftNode.key.word);
            assertEquals("Test rotateLeft() return value's leftNode.rightNode equals input values rightNode.leftNode", node_Z, node_X.leftNode.rightNode);
            assertEquals("Test rotateLeft() return value's height is 1 + the greater height value of its leftNode and rightNodes", 1 + Math.max(node_X.leftNode.height, -1), node_X.height);
        }

        //case 4
        for(int i = 0; i < array_size; i++){
            node_Y = new AVLNode(new Word("Y"));
            node_Y.rightNode = new AVLNode(new Word("X"));
            node_Y.leftNode= new AVLNode(new Word("B"));

            node_Y.leftNode.height = values[i];

            String input_key = node_Y.key.word;
            AVLNode node_Z = node_Y.rightNode.leftNode;

            AVLNode node_X = AVLTree.rotateLeft(node_Y);

            assertEquals("Test rotateLeft() return value's leftNode key equals input values key", input_key, node_X.leftNode.key.word);
            assertEquals("Test rotateLeft() return value's leftNode.rightNode equals input values rightNode.leftNode", node_Z, node_X.leftNode.rightNode);
            assertEquals("Test rotateLeft() return value's height is 1 + the greater height value of its leftNode and rightNodes", 1 + Math.max(node_X.leftNode.height, -1), node_X.height);
        }

        //case 5
        for(int i = 0; i < array_size; i++){
            node_Y = new AVLNode(new Word("Y"));
            node_Y.rightNode = new AVLNode(new Word("X"));
            node_Y.rightNode.rightNode = new AVLNode(new Word("A"));

            node_Y.rightNode.rightNode.height = values[i];

            String input_key = node_Y.key.word;
            AVLNode node_Z = node_Y.rightNode.leftNode;

            AVLNode node_X = AVLTree.rotateLeft(node_Y);

            assertEquals("Test rotateLeft() return value's rightNode key equals input values key", input_key, node_X.leftNode.key.word);
            assertEquals("Test rotateLeft() return value's leftNode.rightNode equals input values rightNode.leftNode", node_Z, node_X.leftNode.rightNode);
            assertEquals("Test rotateLeft() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.leftNode.height, node_X.rightNode.height));
        }

        //case 6
        for(int i = 0; i < array_size; i++){
            for(int j = 0; j < array_size; j++){
                node_Y = new AVLNode(new Word("Y"));
                node_Y.rightNode = new AVLNode(new Word("X"));
                node_Y.rightNode.rightNode = new AVLNode(new Word("A"));
                node_Y.leftNode = new AVLNode(new Word("B"));

                node_Y.rightNode.rightNode.height = values[i];
                node_Y.leftNode.height = values[j];

                String input_key = node_Y.key.word;
                AVLNode node_Z = node_Y.rightNode.leftNode;

                AVLNode node_X = AVLTree.rotateLeft(node_Y);

                assertEquals("Test rotateLeft() return value's leftNode key equals input values key", input_key, node_X.leftNode.key.word);
                assertEquals("Test rotateLeft() return value's rightNode.rightNode equals input values rightNode.leftNode", node_Z, node_X.leftNode.rightNode);
                assertEquals("Test rotateLeft() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.leftNode.height , node_X.rightNode.height));
            }
        }

        //case 7
        for(int i = 0; i < array_size; i++){
            node_Y = new AVLNode(new Word("Y"));
            node_Y.rightNode = new AVLNode(new Word("X"));
            node_Y.rightNode.leftNode = new AVLNode(new Word("Z"));

            node_Y.rightNode.leftNode.height = values[i];

            String input_key = node_Y.key.word;
            String node_Z_key = node_Y.rightNode.leftNode.key.word;

            AVLNode node_X = AVLTree.rotateLeft(node_Y);
            assertEquals("Test rotateLeft() return value's leftNode key equals input values key", input_key, node_X.leftNode.key.word);
            assertEquals("Test rotateLeft() return value's leftNode.rightNode key equals input values rightNode.leftNode key", node_Z_key, node_X.leftNode.rightNode.key.word);
            assertEquals("Test rotateLeft() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.leftNode.height, -1));
        }

        //case 8
        for(int i = 0; i < array_size; i++){
            for(int j = 0; j < array_size; j++){
                node_Y = new AVLNode(new Word("Y"));
                node_Y.rightNode = new AVLNode(new Word("X"));
                node_Y.rightNode.leftNode = new AVLNode(new Word("Z"));
                node_Y.leftNode= new AVLNode(new Word("B"));

                node_Y.rightNode.leftNode.height = values[i];
                node_Y.leftNode.height = values[j];

                String input_key = node_Y.key.word;
                String node_Z_key = node_Y.rightNode.leftNode.key.word;

                AVLNode node_X = AVLTree.rotateLeft(node_Y);
                assertEquals("Test rotateLeft() return value's leftNode key equals input values key", input_key, node_X.leftNode.key.word);
                assertEquals("Test rotateLeft() return value's leftNode.rightNode key equals input values rightNode.leftNode key", node_Z_key, node_X.leftNode.rightNode.key.word);
                assertEquals("Test rotateLeft() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.leftNode.height, -1));
            }
        }


        //case 9
        for(int i = 0; i < array_size; i++){
            for(int j = 0; j < array_size; j++){
                node_Y = new AVLNode(new Word("Y"));
                node_Y.rightNode = new AVLNode(new Word("X"));
                node_Y.rightNode.leftNode = new AVLNode(new Word("Z"));
                node_Y.rightNode.rightNode = new AVLNode(new Word("A"));

                node_Y.rightNode.rightNode.height = values[i];
                node_Y.rightNode.rightNode.height = values[j];

                String input_key = node_Y.key.word;
                String node_Z_key = node_Y.rightNode.leftNode.key.word;

                AVLNode node_X = AVLTree.rotateLeft(node_Y);
                assertEquals("Test rotateLeft() return value's leftNode key equals input values key", input_key, node_X.leftNode.key.word);
                assertEquals("Test rotateLeft() return value's leftNode.rightNode key equals input values rightNode.leftNode key", node_Z_key, node_X.leftNode.rightNode.key.word);
                assertEquals("Test rotateLeft() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.rightNode.height, node_X.leftNode.height));
            }
        }

        //case 10
        for(int i = 0; i < array_size; i++){
            for(int j = 0; j < array_size; j++){
                for(int k = 0; k < array_size; k++){
                    node_Y = new AVLNode(new Word("Y"));
                    node_Y.rightNode = new AVLNode(new Word("X"));
                    node_Y.rightNode.leftNode = new AVLNode(new Word("Z"));
                    node_Y.rightNode.rightNode = new AVLNode(new Word("A"));
                    node_Y.leftNode = new AVLNode(new Word("B"));

                    node_Y.rightNode.leftNode.height = values[i];
                    node_Y.rightNode.rightNode.height = values[j];
                    node_Y.leftNode.height = values[k];

                    String input_key = node_Y.key.word;
                    String node_Z_key = node_Y.rightNode.leftNode.key.word;
                    AVLNode node_X = AVLTree.rotateLeft(node_Y);

                    assertEquals("Test rotateLeft() return value's leftNode key equals input values key", input_key, node_X.leftNode.key.word);
                    assertEquals("Test rotateLeft() return value's leftNode.rightNode key equals input values rightNode.leftNode key", node_Z_key, node_X.leftNode.rightNode.key.word);
                    assertEquals("Test rotateLeft() return value's height is 1 + the greater height value of its leftNode and rightNodes", node_X.height, 1 + Math.max(node_X.rightNode.height, node_X.leftNode.height));
                }
            }
        }
    }
}