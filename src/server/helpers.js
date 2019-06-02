const hbs = require('hbs');

hbs.registerHelper('multiply', (a, b) => {
    return a * b;
});