import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class TestRunner {
    public static void main(String[] args) {

        System.out.println("\n-- Starting Tests --\n");

        Result result = JUnitCore.runClasses(JUnitTestSuite.class);

        System.out.println("Number of Tests: " + result.getRunCount() + "\nRuntime: " + result.getRunTime() + "ms");
        if(result.wasSuccessful()) System.out.println("Test Result: Success");
        else System.out.println("Test Result: Fail");

        System.out.println("\n-- Testing Complete --\n");

        if(!result.wasSuccessful()) {
            System.out.println("Failures:");
            for (Failure failure : result.getFailures()) {
                System.out.println(failure.toString());
            }
        }
    }
}  	