import * as utils from "../utils"
import Broadlink from './../broadlink';

"use stict";
const PORT = 1880;

//34:EA:34:42:F6:EC
// const commands = [{
//   command: "command",
//   secret: "7yh2h9aiv9avildm8z0ejyvi",
//   mac: "34:ea:34:42:f6:ec",
//   ip: false,
//   data:"260060000001269414111436121214111436133612381410143614111435143614351411143614351411143614351436141014111411121212381411141013121436143514361435150004d70001274b14000c4f0001264b12000c510001294813000d050000000000000000"
// }]

const broadlink = new Broadlink();
broadlink.discover();

let commands = [];

utils.loadFile('rm-commands.json').then((result) => {
    commands = result;
    console.log("Loaded commands");
});

function sendData(device = false, hexData = false) {
    if (device === false || hexData === false) {
        console.log('Missing params, sendData failed', typeof device, typeof hexData);
        return;
    }

    const hexDataBuffer = new Buffer(hexData, 'hex');
    device.sendData(hexDataBuffer);
}

export const activate = (cmd) => {
    const command = commands.find((e) => { return e.command == cmd; });

    if (command) {
        let host = (command.mac || command.ip).toLowerCase();
        return broadlink.getDevice({ host }).then((device) => {
            if (!device) {
                console.log(`${cmd} sendData(no device found at ${host})`);
            } else if (!device.sendData) {
                console.log(`[ERROR] The device at ${device.host.address} (${device.host.macAddress}) doesn't support the sending of IR or RF codes.`);
            } else if (command.data && command.data.includes('5aa5aa555')) {
                console.log('[ERROR] This type of hex code (5aa5aa555...) is no longer valid. Use the included "Learn Code" accessory to find new (decrypted) codes.');
            } else {
                if ('sequence' in command) {
                    console.log('Sending sequence..');
                    for (var i in command.sequence) {
                        let find = command.sequence[i];
                        let send = commands.find((e) => { return e.command == find; });
                        if (send) {
                            setTimeout(() => {
                                console.log(`Sending command ${send.command}`)
                                sendData(device, send.data);
                            }, 1000 * i);
                        } else {
                            console.log(`Sequence command ${find} not found`);
                        }
                    }
                } else {
                    sendData(device, command.data);
                }

                return true;
            }

            return false;
        });
    } else {
        console.log(`Command not found: ${cmd}`);
        return false;
    }
};