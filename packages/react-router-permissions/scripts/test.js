process.on('unhandledRejection', err => {
  throw err;
});

const jest = require('jest');

let argv = process.argv.slice(2);

// Watch unless on CI, in coverage mode, or explicitly running all tests
if (!process.env.CI && argv.indexOf('--coverage') === -1 && argv.indexOf('--watchAll') === -1) {
  argv.push('--watch');
}

// Generate coverage report on CI
if (process.env.CI && argv.indexOf('--coverage') === -1) {
  argv.push('--coverage');
}

jest.run(argv);
