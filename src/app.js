// import program from 'commander';
import server from './server';
import program from 'commander';
import rmLearner from './rm.learner';
import prompt from 'prompt';
import * as util from './utils';

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
          util.addCommandToJson('rm-commands.json', result);
        });
      });
  });

program
  .command('serve')
  .description('Serves the application.')
  .action(function () {
    server();
  });
 
program.parse(process.argv);
