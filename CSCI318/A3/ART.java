import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;

class ART {
	private int categoriesChoices = 28;
	public int candidatesCount = 10;
	public String grepV1 = "grep_bad";
	public String grepV2 = "grep_oracle";
	public String filePath = "SlyFox.txt";
	private ArrayList<String> candidates;
	private ArrayList<String> grepPool;
	public int max_runs = 1000;

	private String feedInputGrepv1(String test_case) throws IOException {
		// generate commands based on OS
		String prefix = "";
		if (System.getProperty("os.name").toLowerCase().contains("win")) {
			prefix = "wsl ";
		}

		Process process = Runtime.getRuntime().exec(prefix + grepV1 + " " + test_case + " " + filePath);

		BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
		String line = "";
		String output = "";
		while ((line = reader.readLine()) != null)
			output += line;
		reader.close();
		return output;
	}

	private String feedInputGrepv2(String test_case) throws IOException {
		// generate commands based on OS
		String prefix = "";
		if (System.getProperty("os.name").toLowerCase().contains("win")) {
			prefix = "wsl ";
		}

		Process process = Runtime.getRuntime().exec(prefix + grepV2 + " " + test_case + " " + filePath);

		BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
		String line = "";
		String output = "";
		while ((line = reader.readLine()) != null)
			output += line;
		reader.close();
		return output;
	}

	public void generatePool() {
		// category -> choices -> expression
		String[] normalChar = { "", "z", "?" }; // literal chars i
		String[] wordSymbol = { "", "\\w", "\\W" }; // \w \W i
		String[] spaceSymbol = { "", "\\s", "\\S" }; // \s \S i
		String[] namedSymbol = { "", "[[:alpha:]]", "[[:upper:]]", "[[:lower:]]", "[[:digit:]]", "[[:xdigit:]]", "[[:space:]]", "[[:punct:]]",
				"[[:alnum:]]", "[[:print:]]", "[[:graph:]]", "[[:cntrl:]]", "[[:blank:]]" }; // i
		String[] anyChar = { "", "." }; // "." i
		String[] range = { "", "[0-9]", "[A-P]", "[a-p]" }; // [0-9] [A-Z] [a-z] i

		// categories
		String[][] independentCategories = { normalChar, wordSymbol, spaceSymbol, namedSymbol, anyChar, range };
		ArrayList<String> grepInputPool = new ArrayList<String>();

		// int cnt = 0;

		for (int i = 0; i != independentCategories[0].length; i++) {
			for (int j = 0; j != independentCategories[1].length; j++) {
				for (int k = 0; k != independentCategories[2].length; k++) {
					for (int l = 0; l != independentCategories[3].length; l++) {
						for (int m = 0; m != independentCategories[4].length; m++) {
							for (int n = 0; n != independentCategories[5].length; n++) {
								grepInputPool.add(independentCategories[0][i] + independentCategories[1][j] + independentCategories[2][k]
										+ independentCategories[3][l] + independentCategories[4][m] + independentCategories[5][n]);
							}
						}
					}
				}
			}
		}
		grepPool = grepInputPool;
		//generatePool currently produces an empty string as input which grep doesnt like.. so manually removing it here.
		grepPool.remove(0);
		// return grepInputPool;
	}

	private int[] returnS(String test_case) {
		int S[] = new int[categoriesChoices];
		Arrays.fill(S, 0);

		if (test_case.contains("u"))
			S[1] = 1;
		else if (test_case.contains("?"))
			S[2] = 1;
		else
			S[0] = 1;

		if (test_case.contains("\\w"))
			S[4] = 1;
		else if (test_case.contains("\\W"))
			S[5] = 1;
		else
			S[3] = 1;

		if (test_case.contains("\\s"))
			S[7] = 1;
		else if (test_case.contains("\\S"))
			S[8] = 1;
		else
			S[6] = 1;

		if (test_case.contains("[:alpha:]"))
			S[10] = 1;
		else if (test_case.contains("[:upper:]"))
			S[11] = 1;
		else if (test_case.contains("[:lower:]"))
			S[12] = 1;
		else if (test_case.contains("[:digit:]"))
			S[13] = 1;
		else if (test_case.contains("[:xdigit:]"))
			S[14] = 1;
		else if (test_case.contains("[:space:]"))
			S[15] = 1;
		else if (test_case.contains("[:punct:]"))
			S[16] = 1;
		else if (test_case.contains("[:alnum:]"))
			S[17] = 1;
		else if (test_case.contains("[:print:]"))
			S[18] = 1;
		else if (test_case.contains("[:graph:]"))
			S[19] = 1;
		else if (test_case.contains("[:cntrl:]"))
			S[20] = 1;
		else if (test_case.contains("[:blank:]"))
			S[21] = 1;
		else
			S[9] = 1;

		if (test_case.contains("."))
			S[23] = 1;
		else
			S[22] = 1;

		if (test_case.contains("[0-9]"))
			S[25] = 1;
		else if (test_case.contains("[A-P]"))
			S[26] = 1;
		else if (test_case.contains("[a-p]"))
			S[27] = 1;
		else
			S[24] = 1;

		return S;
	}

	private int calculate_sum_distance(int numTestCases, int S_array[], int candidate_S[]) {
		int sum = 0;
		for (int i = 0; i < categoriesChoices; i++) {
			if (candidate_S[i] == 1)
				sum += (numTestCases - S_array[i]);
		}
		return sum;
	}

	private String getRandomTestCase() {
		return grepPool.get(new Random().nextInt(grepPool.size()));
	}

	private ArrayList<String> generateCandiates() {
		ArrayList<String> candidates = new ArrayList<>();
		for (int i = 0; i < candidatesCount; i++)
			candidates.add(getRandomTestCase());
		return candidates;
	}

	public String runART() {
		String outputs="";
		int[] S = new int[categoriesChoices];
		Arrays.fill(S, 0);

		String test_case;
		String candidate;

		int[] S_test_case;
		int[] S_candidate;

		int max_sum;
		int current_sum;
		int max_candidate_index = -1;

		String grepv1output = "";
		String grepv2output = "";

		for (int j = 0; j < max_runs; j++) {
			if (j == 0)
				test_case = getRandomTestCase();
			else {
				candidates = generateCandiates();
				max_sum = -1;

				for (int i = 0; i < candidatesCount; i++) {
					candidate = candidates.get(i);
					S_candidate = returnS(candidate);

					current_sum = calculate_sum_distance(j, S, S_candidate);

					if (current_sum > max_sum) {
						max_sum = current_sum;
						max_candidate_index = i;
					}
				}
				test_case = candidates.get(max_candidate_index);

				try {
					grepv1output = feedInputGrepv1(test_case);
					grepv2output = feedInputGrepv2(test_case);
				} catch (Exception e) {
					System.out.println("error feeding input to grep");
					break;
				}

				if (!grepv1output.equals(grepv2output)) {
					outputs="outputs do not match. Bug found.\n" + test_case + "\n" + (j+1);
					System.out.println("outputs do not match. Bug found.");
					System.out.println(test_case);
					System.out.println((j+1));
					System.out.println("grepv1output: "+grepv1output);
					System.out.println("grepv2output: "+grepv2output);
					break;
				}
			}

			S_test_case = returnS(test_case);
			for (int i = 0; i < categoriesChoices; i++) {
				if (S_test_case[i] == 1)
					S[i]++;
			}
		}
		return outputs;
	}

	public String runRT() {
		String outputs = "";
		String test_case = "";
		String grepv1output = "";
		String grepv2output = "";

		for (int i = 0; i < max_runs; i++) {
			test_case = getRandomTestCase();
			try {
				grepv1output = feedInputGrepv1(test_case);
				grepv2output = feedInputGrepv2(test_case);
			} catch (Exception e) {
				System.out.println("error feeding input to grep");
				break;
			}
			if (!grepv1output.equals(grepv2output)) {
				outputs="outputs do not match. Bug found.\n" + test_case + "\n" + (i+1);
				System.out.println("outputs do not match. Bug found.");
				System.out.println(test_case);
				System.out.println((i+1));
				break;
			}
		}
		return outputs;
	}
}