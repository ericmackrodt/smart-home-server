import BaseController from "../base.controller";

"use stict";
const PORT = 1880;
 
const BroadlinkServer = require('broadlink-rm-server');
//34:EA:34:42:F6:EC
const commands = [{
  command: "command",
  secret: "7yh2h9aiv9avildm8z0ejyvi",
  mac: "34:ea:34:42:f6:ec",
  ip: false,
  data:"260060000001269414111436121214111436133612381410143614111435143614351411143614351411143614351436141014111411121212381411141013121436143514361435150004d70001274b14000c4f0001264b12000c510001294813000d050000000000000000"
}]
 
let app = BroadlinkServer(commands);
    app.listen(PORT);
 
console.log('Broadlink running, go to http://localhost:' + PORT);

export default class Broadlink extends BaseController {
  constructor() {
    super('broadlink');
  }

  
}
