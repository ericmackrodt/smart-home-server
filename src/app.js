// import program from 'commander';
const program = require('commander');
const rmLearner = require('./rm.learner').default;
const prompt = require('prompt');

program
  .command('learn <host>')
  .description('Learns RM commands.')
  // .option('-r, --recursive', 'Remove recursively')
  .action(function (host, cmd) {
    console.log('Learning commands for: ' + host);
    rmLearner(host)
      .then((result) => {
        
      })
      .catch((err) => {
        console.log(err);
        prompt.start();
        prompt.get(['commandName'], (err, result) => {
          console.log('commandName: ', result.commandName);
        });
      });
  });

program
  .command('serve')
  .description('Serves the application.')
  .action(function () {
    console.log('serves!');
  });
 
program.parse(process.argv);
