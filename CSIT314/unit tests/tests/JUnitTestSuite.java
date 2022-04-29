import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

//JUnit Suite Test
@RunWith(Suite.class)

@SuiteClasses({
   ass1Test.class, AVLTreeTest.class, WordTest.class
})

public class JUnitTestSuite {
}