const fs = require("fs").promises;
const inquirer = require("inquirer");

// Define constants for checkbox prompts and license choices
const checkboxPrompt = [
  "Table of Contents",
  "Description",
  "Installation",
  "Usage",
  "Contributing",
  "License",
  "Tests",
  "Questions",
];

const licensePrompt = ["MIT", "GPLv3", "Mozilla"];

// Function to prompt user for description of a section
async function promptDescription(section) {
  const data = await inquirer.prompt([
    {
      type: "input",
      message: `Give a description for the ${section} section`,
      name: "description",
    },
  ]);

  // Append the section description to the README file
  await fs.appendFile("README.md", `## ${section} \n ${data.description} \n \n`);
  console.log(`${section} Section Added`);
}

// Function to prompt user for project-related questions
async function promptQuestions() {
  try {
    // Prompt the user for project details
    const data = await inquirer.prompt([
      {
        type: "input",
        message: "What is the name of your project?",
        name: "projectName",
      },
      {
        type: "checkbox",
        message: "What sections do you want in your README?",
        name: "checkboxSections",
        choices: checkboxPrompt,
      },
      {
        type: "list",
        message: "Pick a license",
        name: "readmeLicense",
        choices: licensePrompt,
      },
    ]);

    // Create the project title in the README file
    await fs.appendFile("README.md", `# ${data.projectName} \n \n`);

    // Loop through selected sections
    for (const section of data.checkboxSections) {
      if (section === "License") {
        // Handle the License section separately based on the selected license
        await handleLicenseSection(data.readmeLicense);
      } else {
        // Prompt the user for description of non-license sections
        await promptDescription(section);
      }
    }

  } catch (err) {
    console.error("Error during promptQuestions:", err);
  }
}

// Function to handle the License section based on the selected license
async function handleLicenseSection(selectedLicense) {
  try {
    let badgeURL = "";
    switch (selectedLicense) {
      case "MIT":
        badgeURL = "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)\n \n";
        break;
      case "GPLv3":
        badgeURL = "[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)\n \n";
        break;
      case "Mozilla":
        badgeURL = "[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)\n \n";
        break;
    }

    // Append the License section with the corresponding badge to the README file
    await fs.appendFile("README.md", `## License \n \n ${badgeURL}`);
    console.log("License Section Added");

  } catch (err) {
    console.error("Error during handleLicenseSection:", err);
  }
}

// Function to create an empty README file
async function writeToFile() {
  try {
    await fs.writeFile("README.md", "");
    console.log("README.md File Created");

  } catch (err) {
    console.error("Error creating README file:", err);
  }
}

// Initialize the process by creating an empty README file and prompting the user for project details
async function init() {
  await writeToFile();
  await promptQuestions();
}

// Start the initialization process
init();
