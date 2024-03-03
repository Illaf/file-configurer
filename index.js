#! /usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import nodeExpress from "./configs/nodeExpress.js";
import staticFile from "./configs/static.js ";
import commonConfig from "./configs/commonConfig.js";

const existingConfig = fs.existsSync("config.json");
const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);
const currFile = new URL(import.meta.url).pathname.split("/").pop();

async function buildConfig() {
  let config = {
    version: 2,
  };
  const answers = await inquirer.prompt([
    {
      type: "text",
      name: "name",
      message: "What is the name of your project?",
      default: currFile,
    },
    {
      type: "list",
      name: "type",
      message: "What is the type of your project?",
      choices: ["node-express", "static", "react", "vue", "static-build"],
    },
  ]);
  config.name = answers.name;
  switch (answers.type) {
    case "node-express":
      config = await nodeExpress(config);
      break;
    case "static":
      config = await staticFile(config);
      break;
    case "react":
      config = await commonConfig(config,'build');
      break;
      case "vue":
      config = await commonConfig(config);
      break;
      case "static-build":
      config = await commonConfig(config);
      break;
  }
  const aliases = await inquirer.prompt([
    {
      type: "confirm",
      name: "specifyAlias",
      message: "Would you like to specify an alias?(Specify multiple separated by commas)",
      default: true,
    },
    {
      type: "text",
      name: "alias",
      message: "Mention the alias?",
      default: answers.name,
      when: a => a.specifyAlias,
    },
    // {
    //   type: "confirm",
    //   name: "deploy",
    //   message: "Would you like to deploy?",
    //   default: false,
    // },
  ]);
  config.alias = aliases.alias?aliases.alias.split(','):undefined;
  fs.writeFileSync("config.json",JSON.stringify(config,null,2),'utf-8');
  console.log('All done!');
  process.exit(0);
  if(aliases.deploy){
    
  }
  console.log(config);
}

if (existingConfig) {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "config.json already exists.Do you want to overwrite?",
        default: false,
      },
    ])
    .then((answers) => {
      if (answers.overwrite) {
        buildConfig();
      } else {
        console.log("OK cool");
      }
    });
}else{
  buildConfig();
}
