process.on('unhandledRejection', err => {
  throw err;
});

const execSync = require('child_process').execSync;

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv),
  });

console.log('Building CommonJS modules ...');

exec('babel src -d . --ignore src/__tests__', {
  BABEL_ENV: 'cjs',
});

console.log('\nBuilding ES modules ...');

exec('babel src -d es --ignore src/__tests__', {
  BABEL_ENV: 'es',
});
