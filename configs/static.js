import inquirer from "inquirer";
import {createRequire} from 'module';
import path from 'path';
const require = createRequire(import.meta.url);

const baseConfig={
    "name":"static",
    "version":2,
    "builds":[
        {"src":'*',"use":"@index/static"}
    ]
};
export default async function staticFile(config){
  let mainFile="src/index.js";
  try {
    const packageJSON = require('../package.json');
    mainFile=packageJSON.main;
  } catch (error) {
    console.error('error loading package.json'+error.message);
  }
  const answers= await inquirer.prompt([
    {
      typt:'text',
      name:'directory',
      message:'In what folder would you like tom deploy?',
      default:'.'
    },

  ]);
baseConfig.builds[0].src=path.join(answers.directory,"*");
  
    return{
      ...config,...baseConfig
    }
}