const inquirer = require("inquirer");
const fs = require("fs");

const choices = fs
  .readdirSync("./examples")
  .filter(fileName => fileName !== "index.ts");

const questions = [
  {
    type: "list",
    name: "exampleFileName",
    message: `What do example would you like to run?`,
    choices
  }
];

inquirer.prompt(questions).then(({ exampleFileName }) => {
  require(`./${exampleFileName}`);
});
