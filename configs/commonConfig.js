import inquirer from "inquirer";
import {createRequire} from 'module';
import fs from "fs";
const require = createRequire(import.meta.url);
import path from 'path';
const baseConfig={
   
    "builds": [
      {
        "src": "package.json",
        "use": "@now/static-build",
        "config": { "distDir": "build" }
      }
    ],
    "routes": [
      { "handle": "filesystem" },
      { "src": "/.*", "dest": "index.html" }
    ]
  }
export default async function commonConfig(config,defaultBuild='dist'){
  let buildScript;
  let packageJSONpath
  const answers= await inquirer.prompt([
    {
      type:'text',
      name:'directory',
      message:'What is the build command?',
      default:defaultBuild
    },
    {
        type:'confirm',
        name:'addBuildScript',
        message:'Do you want to add/update a "now-build" script to your package.json ?',
        default:true
      }
  ]);
  console.log( path.join(process.cwd(),'package.json'))
  if(answers.addBuildScript){
    
    try {
       packageJSONpath= path.join(process.cwd(),'package.json');
      console.log(packageJSONpath);
        const packageJSON= require('../package.json');
         buildScript=(packageJSON.scripts || {})['now-build'] || 'npm-run-build';
        const buildAnswers= await inquirer.prompt([
          {
            typt:'text',
            name:'buildScript',
            message:'What is the build command?',
            default:buildScript
          }
        ]);
        packageJSON.scripts= packageJSON.scripts || {};
        packageJSON.scripts['now-build'] = buildAnswers.buildScript;
        fs.writeFileSync(packageJSONpath,JSON.stringify(packageJSON,null,2),'utf-8')
        
    } catch (error) {
      console.error("package.json does not exist!");
      
      process.exit(1);  
    }
  }


 baseConfig.builds[0].config.distDir=answers.directory;
  
    return{
      ...config,...baseConfig
    }
}
//module.exports=commonConfig;