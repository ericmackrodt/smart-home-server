// import program from 'commander';
import server from './server';
import program from 'commander';
import Broadlink from './broadlink';
import prompt from 'prompt';
import * as util from './utils';

console.log('Ran...');

program
  .command('learn <host>')
  .description('Learns RM commands.')
  // .option('-r, --recursive', 'Remove recursively')
  .action(function (host, cmd) {
    console.log('Learning commands for: ' + host);
    const bl = new Broadlink();
    bl.learnCommand(host).then((result) => {
      console.log(result);
      prompt.start();
      prompt.get(['commandName'], (err, cmds) => {
        result.command = cmds.commandName;
        util.addCommandToJson('rm-commands.json', result).then(() => process.exit(0));
      });
    });
    // (new Promise((resolve, reject) => {
    //   const id = setTimeout(() => {
    //     clearTimeout(id);
    //     resolve(null);
    //   }, 3000)})).then(() => rmLearner(host))
    //   .then((result) => {
    //     console.log(result);
    //     prompt.start();
    //     prompt.get(['commandName'], (err, cmds) => {
    //       result.command = cmds.commandName;
    //       util.addCommandToJson('rm-commands.json', result);
    //     });
    //   })
    //   .catch((err) => {
    //     console.log('Oops: ', err);
    //   });
  });

program
  .command('serve')
  .description('Serves the application.')
  .action(function () {
    server();
  });
 
if (process.argv.length === 0) {
  process.argv.push('learn 192.168.1.4')
}
program.parse(process.argv);
