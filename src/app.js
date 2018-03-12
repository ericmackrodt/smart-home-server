// import program from 'commander';
const program = require('commander');
const rmLearner = require('./rm.learner').default;

program
  .command('learn <host>')
  .description('Learns RM commands.')
  // .option('-r, --recursive', 'Remove recursively')
  .action(function (host, cmd) {
    console.log('Learning commands for: ' + host);
    rmLearner(host);
  });

program
  .command('serve')
  .description('Serves the application.')
  .action(function () {
    console.log('serves!');
  });
 
program.parse(process.argv);

console.log('ran');
