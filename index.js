import inquirer from 'inquirer';
import fs from 'fs';
import open from 'open';
import { JSDOM } from 'jsdom';
import SVG from 'svg.js';

const shapes = ['circle', 'triangle', 'square'];

function generateLogo(text, textColor, shape, shapeColor) {
  const { document } = new JSDOM().window;
  const svg = SVG().addTo(document.body).size(300, 200);
  let shapeElement;

  switch (shape) {
    case 'circle':
      shapeElement = svg.circle(100).center(150, 100).fill(shapeColor);
      break;
    case 'triangle':
      shapeElement = svg.polygon([150, 50, 100, 150, 200, 150]).fill(shapeColor);
      break;
    case 'square':
      shapeElement = svg.rect(100, 100).move(100, 50).fill(shapeColor);
      break;
    default:
      console.error('Invalid shape.');
      return;
  }

  svg.text(text).move(100, 100).fill(textColor);
  fs.writeFileSync('logo.svg', document.documentElement.outerHTML);
  console.log('Generated logo.svg');

  open('logo.svg', { wait: true }); // Open the SVG in the default browser.
}

async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: 'Enter up to three characters for the text:',
      validate: (input) => (input.length <= 3 ? true : 'Text must be up to three characters.'),
    },
    {
      type: 'input',
      name: 'textColor',
      message: 'Enter text color (color keyword or hexadecimal number):',
    },
    {
      type: 'list',
      name: 'shape',
      message: 'Select a shape:',
      choices: shapes,
    },
    {
      type: 'input',
      name: 'shapeColor',
      message: 'Enter shape color (color keyword or hexadecimal number):',
    },
  ]);

  const { text, textColor, shape, shapeColor } = answers;
  generateLogo(text, textColor, shape, shapeColor);
}

promptUser();
