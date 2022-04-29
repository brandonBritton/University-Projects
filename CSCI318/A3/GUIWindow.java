import javax.swing.*;
import java.awt.GridBagLayout;
import java.awt.GridBagConstraints;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Dimension;
import java.io.*;
import java.util.ArrayList;

public class GUIWindow {
	ART art = new ART();
	Font labelFont = new Font(Font.SANS_SERIF, Font.BOLD, 14);
	Font buttonFont = new Font(Font.SANS_SERIF, Font.BOLD, 13);
	Font inputFont = new Font(Font.MONOSPACED, Font.PLAIN, 14);
	Font outputFont = new Font(Font.MONOSPACED, Font.PLAIN, 15);
	Font headerFont = new Font(Font.SANS_SERIF, Font.BOLD, 20);

	// GUI components
	private JFrame mainWindow = new JFrame();
	private JPanel mainPanel = new JPanel();
	private JLabel applicationLabel = newLabel("GREP(A)RT - A tool to test GREP with ART and RT");
	private JLabel numberOfCandidatesInputLabel = newLabel("Number of Candidates: ");
	private JSpinner numberOfCandidatesInput = newSpinner();
	private JLabel pathToOldGrepInputLabel = newLabel("Path to Older GREP executable: ");
	private JTextField pathToOldGrepInput = newInputField();
	private JButton pathToOldGrepInputFileChooserButton = newButton("Open File");
	private JLabel pathToNewGrepInputLabel = newLabel("Path to GREP Oracle executable: ");
	private JTextField pathToNewGrepInput = newInputField();
	private JButton pathToNewGrepInputFileChooserButton = newButton("Open File");
	private JLabel pathToTextFileInputLabel = newLabel("Path to text file for testing: ");
	private JTextField pathToTextFileInput = newInputField();
	private JButton pathToTextFileInputFileChooserButton = newButton("Open File");
	private JLabel numberOfRunsInputLabel = newLabel("Maximum number of runs: ");
	private JSpinner numberOfRunsInput = newSpinner();

	// Checkboxes for select ART or RT
	private JLabel runOptionLabel = newLabel("Run options: ");
	private JCheckBox artRunCheckbox = newCheckBox("Run ART");
	private JCheckBox rtRunCheckbox = newCheckBox("Run RT");

	private JLabel outputTextAreaLabel = newLabel("Output: ");
	private JTextArea outputTextArea = newTextArea();
	private JScrollPane outputTextAreaScrollPane = new JScrollPane(this.outputTextArea);

	// Button to run test
	private JButton runTestButton = newButton("Run Test");

	// Create GridBagConstraints for the gridbaglayout inside of the input panel
	GridBagConstraints constraints = new GridBagConstraints();

	// User home directory
	private String systemHomeDir = getHomeDir();

	// pre-populate inputs with default values
	public void setDefaultInputs() {
		numberOfCandidatesInput.setModel(new SpinnerNumberModel(art.candidatesCount, 5, 50, 1));
		numberOfRunsInput.setModel(new SpinnerNumberModel(art.max_runs, 1, 1000, 1));
		// Set spinner fields left align text
		((JSpinner.DefaultEditor) numberOfRunsInput.getEditor()).getTextField().setHorizontalAlignment(JTextField.LEFT);
		((JSpinner.DefaultEditor) numberOfCandidatesInput.getEditor()).getTextField().setHorizontalAlignment(JTextField.LEFT);

		outputTextArea.setText("Testing output will appear here.");
		pathToOldGrepInput.setText("./grep_bad");
		pathToNewGrepInput.setText("./grep_oracle");
		pathToTextFileInput.setText("./SlyFox.txt");
	}

	// Gets user home directory
	private String getHomeDir() {
		String home = System.getProperty("user.home");
		if (System.getProperty("os.name").toLowerCase().contains("win")) {
			home = home.replaceFirst("C:", "/mnt/c");
			home = home.replace("\\", "/");
		}
		return home;
	}

	// Utility functions for making UI elements
	private JTextArea newTextArea() {
		JTextArea area = new JTextArea();
		area.setFont(outputFont);
		return area;
	}

	private JCheckBox newCheckBox(String text) {
		JCheckBox checkbox = new JCheckBox(text);
		checkbox.setFont(labelFont);
		return checkbox;
	}

	private JSpinner newSpinner() {
		JSpinner spinner = new JSpinner();
		spinner.setFont(inputFont);
		return spinner;
	}

	private JButton newButton(String text) {
		JButton button = new JButton(text);
		button.setFont(buttonFont);
		return button;
	}

	private JTextField newInputField() {
		JTextField field = new JTextField();
		field.setFont(inputFont);
		return field;
	}

	private JLabel newLabel(String text) {
		JLabel label = new JLabel(text);
		label.setFont(labelFont);
		return label;
	}

	private void addConstraintSet(JComponent comp, int gridx, int gridy, int weightx, int weighty, int fill, int gridwidth, int gridheight) {
		constraints.gridx = gridx;
		constraints.gridy = gridy;
		constraints.weightx = weightx;
		constraints.weighty = weighty;
		constraints.fill = fill;
		constraints.gridwidth = gridwidth;
		constraints.gridheight = gridheight;
		this.mainPanel.add(comp, constraints);
	}

	public GUIWindow() {
		this.mainPanel.setBorder(BorderFactory.createEmptyBorder(5, 15, 5, 15));
		this.mainWindow.setContentPane(this.mainPanel);
		this.mainWindow.setTitle("GREP(A)RT");

		// Linking the labels to their components
		this.numberOfCandidatesInputLabel.setLabelFor(this.numberOfCandidatesInput);
		this.pathToOldGrepInputLabel.setLabelFor(this.pathToOldGrepInput);
		this.pathToNewGrepInputLabel.setLabelFor(this.pathToOldGrepInput);
		this.pathToTextFileInputLabel.setLabelFor(this.pathToTextFileInput);
		this.numberOfRunsInputLabel.setLabelFor(this.numberOfRunsInput);
		this.outputTextAreaLabel.setLabelFor(this.outputTextAreaScrollPane);

		// Get the current content pane which is running with the borderlayout by
		// default
		this.mainPanel.setLayout(new GridBagLayout());

		constraints.anchor = GridBagConstraints.BASELINE_LEADING;
		constraints.ipady = 14;

		// Application Label
		addConstraintSet(applicationLabel, 0, 0, 1, 0, GridBagConstraints.HORIZONTAL, GridBagConstraints.REMAINDER, 1);

		// Number of Candidates
		addConstraintSet(numberOfCandidatesInputLabel, 0, 1, 0, 0, GridBagConstraints.NONE, 1, 1);
		addConstraintSet(numberOfCandidatesInput, 1, 1, 1, 0, GridBagConstraints.HORIZONTAL, 3, 1);

		// Path to Older GREP Executable
		addConstraintSet(pathToOldGrepInputLabel, 0, 2, 0, 0, GridBagConstraints.NONE, 1, 1);
		addConstraintSet(pathToOldGrepInput, 1, 2, 1, 0, GridBagConstraints.HORIZONTAL, 2, 1);
		addConstraintSet(pathToOldGrepInputFileChooserButton, 3, 2, 0, 0, GridBagConstraints.NONE, GridBagConstraints.REMAINDER, 1);

		// Path to Older GREP Executable
		addConstraintSet(pathToNewGrepInputLabel, 0, 3, 0, 0, GridBagConstraints.NONE, 1, 1);
		addConstraintSet(pathToNewGrepInput, 1, 3, 1, 0, GridBagConstraints.HORIZONTAL, 2, 1);
		addConstraintSet(pathToNewGrepInputFileChooserButton, 3, 3, 0, 0, GridBagConstraints.NONE, GridBagConstraints.REMAINDER, 1);

		// Path to Text file for testing
		addConstraintSet(pathToTextFileInputLabel, 0, 4, 0, 0, GridBagConstraints.NONE, 1, 1);
		addConstraintSet(pathToTextFileInput, 1, 4, 1, 0, GridBagConstraints.HORIZONTAL, 2, 1);
		addConstraintSet(pathToTextFileInputFileChooserButton, 3, 4, 0, 0, GridBagConstraints.NONE, GridBagConstraints.REMAINDER, 1);

		// Number of Runs
		addConstraintSet(numberOfRunsInputLabel, 0, 5, 0, 0, GridBagConstraints.NONE, 1, 1);
		addConstraintSet(numberOfRunsInput, 1, 5, 1, 0, GridBagConstraints.HORIZONTAL, GridBagConstraints.REMAINDER, 1);

		// Checkboxes and button to run
		addConstraintSet(runOptionLabel, 0, 6, 0, 0, GridBagConstraints.NONE, 1, 1);
		addConstraintSet(artRunCheckbox, 1, 6, 0, 0, GridBagConstraints.NONE, 1, 1);
		addConstraintSet(rtRunCheckbox, 2, 6, 0, 0, GridBagConstraints.NONE, 1, 1);
		addConstraintSet(runTestButton, 3, 6, 0, 0, GridBagConstraints.HORIZONTAL, GridBagConstraints.REMAINDER, 1);

		// Output area
		addConstraintSet(outputTextAreaLabel, 0, 7, 1, 0, GridBagConstraints.HORIZONTAL, GridBagConstraints.REMAINDER, 1);
		addConstraintSet(outputTextAreaScrollPane, 0, 8, 1, 1, GridBagConstraints.BOTH, GridBagConstraints.REMAINDER, GridBagConstraints.REMAINDER);

		setupFileChooser();
		this.applicationLabel.setFont(headerFont);

		// Set output text area to false for editable
		this.outputTextArea.setEditable(false);
		setDefaultInputs();

		// Set the default options when closing to exit_on_close
		this.mainWindow.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.mainWindow.setResizable(false);
		this.mainWindow.pack();
		this.mainWindow.setMinimumSize(new Dimension(600, 800));
		this.mainWindow.setVisible(true);
	}

	// initialize and run ART and RT according to ticked checkboxes
	public void initPoolAndRunTests() {
		outputTextArea.setText("Initializing...");
		art.generatePool();
		art.candidatesCount = (Integer) numberOfCandidatesInput.getValue();
		art.grepV1 = pathToOldGrepInput.getText();
		art.grepV2 = pathToNewGrepInput.getText();
		art.filePath = pathToTextFileInput.getText();
		art.max_runs = (Integer) numberOfRunsInput.getValue();
		outputTextArea.append("Done\n");

		String output;
		if (artRunCheckbox.isSelected()) {
			outputTextArea.append("Running ART...\n");
			output = art.runART();
			outputTextArea.append(output + "\n");
			outputTextArea.append("Done.\n");
			outputTextArea.append("------------------------------------------------------------------\n");
		}
		if (rtRunCheckbox.isSelected()) {
			outputTextArea.append("\nRunning RT...\n");
			output = art.runRT();
			outputTextArea.append(output + "\n");
			outputTextArea.append("Done.\n\n");
		}
	}

	// Handles file select popup
	public void getPath(JTextField field) {
		JFileChooser chooser = new JFileChooser();
		chooser.setCurrentDirectory(new File(System.getProperty("user.home")));
		int result = chooser.showOpenDialog(null);
		if (result == JFileChooser.APPROVE_OPTION) {
			String path = chooser.getSelectedFile().getAbsolutePath();
			if (System.getProperty("os.name").toLowerCase().contains("win")) {
				path = path.replaceFirst("C:", "/mnt/c");
				path = path.replace("\\", "/");
			}
			field.setText(path);
		}
	}

	// Event listeners for GUI
	private void setupFileChooser() {
		this.runTestButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				initPoolAndRunTests();
			}
		});
		this.pathToOldGrepInputFileChooserButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				getPath(pathToOldGrepInput);
			}
		});
		this.pathToNewGrepInputFileChooserButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				getPath(pathToNewGrepInput);
			}
		});
		this.pathToTextFileInputFileChooserButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				getPath(pathToTextFileInput);
			}
		});
	}
}