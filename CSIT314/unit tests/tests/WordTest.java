import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class WordTest {

    //test case justification
    //the compareTo function has three separate returns values when the word is equal, less than and greater than when compared with another. Too assess all three outputs
    //a control word is generated in this case the Character O two characters are then randomly generated on either side of this. The expected value is then compared to the actual
    //value using assertEquals in conjunction with the compareTo function.
    //All tests successfully pass as such it can be concluded that the compareTo functions as intended.
    private Word control = new Word("");
    private Word lessThan = new Word("");
    private Word greaterThan = new Word("");

    @Before
    public void setUp() throws Exception {
        char temp = (char)79;
        control.word = String.valueOf(temp);

        temp = (char)Math.floor(Math.random()*(78-32+1)+32);
        greaterThan.word = String.valueOf(temp);

        temp = (char)Math.floor(Math.random()*(126-79+1)+79);
        lessThan.word = String.valueOf(temp);
    }

    @After
    public void tearDown() throws Exception {
        this.control = null;
        this.lessThan = null;
        this.greaterThan = null;
    }

    @Test
    public void compareTo() {

        //----ORACLE---- The expected value when two objects are compared that are equal is 0.
        assertEquals(0, control.compareTo(control));
        //----ORACLE----

        //----ORACLE---- The expected value when two objects are compared when the first is less than the second is -1.
        assertEquals(-1, control.compareTo(lessThan));
        //----ORACLE----

        //----ORACLE---- The expected value when two objects are compared when the first is larger than the second is 1.
        assertEquals(1, control.compareTo(greaterThan));
        //----ORACLE----
    }

}