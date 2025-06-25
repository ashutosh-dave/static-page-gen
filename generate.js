const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Register the 'add' helper
handlebars.registerHelper('add', function(a, b) {
    return a + b;
});

// Register the 'times' helper
handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
        accum += block.fn(i);
    }
    return accum;
});

const inputPath = process.argv[2];
if(!inputPath){
    console.error("Usage: node generate.js content/london.json")
    process.exit(1);
}

const rawData = fs.readFileSync(inputPath, 'utf8');
const context = JSON.parse(rawData);

const templateFile = fs.readFileSync('template/base.hbs', 'utf8');
const template = handlebars.compile(templateFile);

const output = template(context);

const fileName = path.basename(inputPath, '.json') + '.php';
fs.writeFileSync(`build/${fileName}`, output);

console.log(`✅Generated ${fileName}`);