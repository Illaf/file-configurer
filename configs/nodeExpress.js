import inquirer from "inquirer";
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const baseConfig={
    
      
        "builds": [
          {
            "src": "src/index.js",
            "use": "@index/node-server"
          }
        ],
        "routes": [
          { "src": "/.*", "dest": "src/index.js" }
        ]
      }
export default async function nodeExpress(config){
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
      name:'main',
      message:'Specify the path f the express entry point',
      default:mainFile
    },

  ]);
  baseConfig.builds[0].src=answers.main;
  baseConfig.routes[0].dest=answers.main;
  
    return{
      ...config,...baseConfig
    }
}
