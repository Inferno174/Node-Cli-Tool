#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { program } = require('commander');

const stubDir = path.join(__dirname, 'stubs');

const availableTypes = fs.existsSync(stubDir)
  ? fs.readdirSync(stubDir)
      .filter(file => file.endsWith('.stub'))
      .map(file => file.replace('.stub', ''))
  : [];

function listAvailableCommands() {
  console.log(`\nAvailable Commands:`);
  availableTypes.forEach(type => {
    console.log(`  ${type.padEnd(15)} -> Creates a ${type}.js`);
  });
  console.log(`\nUsage: create <type> <FilePath>\n`);
}

function createFile(type, inputPath) {
  if (!availableTypes.includes(type)) {
    console.error(`\nStub not found for type: "${type}"`);
    listAvailableCommands();
    return;
  }

  const stubPath = path.join(stubDir, `${type}.stub`);
  const parts = inputPath.split(/[\/\\]/);
  const fileName = parts.pop();

  const baseDir = path.join(process.cwd(), `${type}s`);
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const targetDir = parts.length > 0
    ? path.join(baseDir, ...parts)
    : baseDir;

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const stubContent = fs.readFileSync(stubPath, 'utf8').replace(/__NAME__/g, fileName);
  const filePath = path.join(targetDir, `${fileName}.js`);

  fs.writeFileSync(filePath, stubContent);
  console.log(`${type} created successfully: ${filePath}`);
}

program
  .name('create')
  .usage('<type> <FilePath>')
  .description('Generate files from stub templates based on type')
  .argument('<type>', 'Type of file to create (controller, model, etc.)')
  .argument('[path]', 'File path relative to the base type directory')
  .action((type, inputPath) => {
    if (!inputPath) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question(`Enter file path for ${type}: `, (answer) => {
        rl.close();
        createFile(type.toLowerCase(), answer.trim());
      });
    } else {
      createFile(type.toLowerCase(), inputPath);
    }
  });

if (process.argv.length <= 2) {
  listAvailableCommands();
  process.exit(0);
}

program.parse(process.argv);
