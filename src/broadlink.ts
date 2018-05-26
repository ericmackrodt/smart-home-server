import { ILearnedCommand } from "./models/broadlink";

// From: https://github.com/jor3l/broadlinkrm-ifttt/blob/master/device.js
const BroadlinkJS = require('broadlinkjs-rm');
const macRegExp = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export default class Broadlink {
  private _broadlink: any;
  private _discoveredDevices: any; 
  private _discovering: boolean;

  constructor() {
    this._broadlink = new BroadlinkJS();
    this._discoveredDevices = {};
  }

  _discoverDevices() {
    return new Promise((resolve, reject) => {
      this._discovering = false;
      let count = 0;
      let interval = null;

      this._broadlink.on('deviceReady', (device) => {
        const macAddressParts = device.mac.toString('hex').match(/[\s\S]{1,2}/g) || []
        const macAddress = macAddressParts.join(':')
        device.host.macAddress = macAddress
      
        if (this._discoveredDevices[device.host.address] || this._discoveredDevices[device.host.macAddress]) return;
      
        console.log(`Discovered Broadlink RM device at ${device.host.address} (${device.host.macAddress})`)
      
        this._discoveredDevices[device.host.address] = device;
        this._discoveredDevices[device.host.macAddress] = device;
        clearInterval(interval);
        resolve(device);
      });

      interval = setInterval(() => {
        this._discovering = true;
        if (count >= 5) {
          this._discovering = false;
          clearInterval(interval);
          reject(new Error('No devices found!'));
          return;
        }
        this._broadlink.discover();
        count++;
      }, 5000);
    });
  }

  discover() {
    return this._discoverDevices();
  }

  getDevice({ host, learnOnly }: { host: string, learnOnly?: boolean }) {
    let device;

    if (host) {
      device = this._discoveredDevices[host];
    } else {
      const hosts = Object.keys(this._discoveredDevices);
      if (hosts.length === 0) {
        console.log(`Send data (no devices found)`);
        if (!this._discovering) {
          console.log(`Attempting to discover RM devices for 5s`);

          return this._discoverDevices();
        }
      }

      // Only return device that can Learn codes
      if (learnOnly) {
        hosts.every((c) => {
          const currentDevice = this._discoveredDevices[c];
          if (currentDevice.enterLearning) {
            device = currentDevice;
            return false;
          }
          return true;
        });
        
        if(!device) {
          console.log(`Learn Code (no device found at ${host})`);
        }
        if (!device && !this._discovering) {
          console.log(`Attempting to discover RM devices for 5s`);
          return this._discoverDevices();
        }
      } else {
        device = this._discoveredDevices[hosts[0]];
        if(!device) {
          console.log(`Learn Code (no device found at ${host})`);
        }
        if (!device && !this._discovering) {
          console.log(`Attempting to discover RM devices for 5s`);
          return this._discoverDevices();
        }
      }
    }

    if (!device && !this._discovering) {
      console.log(`Attempting to discover RM devices for 5s`);
      return this._discoverDevices();
    }

    return Promise.resolve(device);
  }

  learnCommand(host): Promise<ILearnedCommand> {
    return this.getDevice({ host, learnOnly: true })
      .then((device) => {
        if (!device.enterLearning) {
          console.log(`Learn Code (IR learning not supported for device at ${host})`);          
        }
        if (!device.enterLearning && !device.enterRFSweep)  {
          throw new Error(`Scan RF (RF learning not supported for device at ${host})`);
        }

        return new Promise<ILearnedCommand>((resolve, reject) => {
          device.cancelRFSweep && device.cancelRFSweep();

          let cancelLearning = () => {
            device.cancelRFSweep && device.cancelRFSweep();
            device.removeListener("rawData", onRawData);
      
            clearTimeout(getTimeout);
            clearTimeout(getDataTimeout);
          };

          let getTimeout = setTimeout(() => {
            cancelLearning();
            console.log(JSON.stringify({ error: "Timeout." }));
          }, 20000);
      
          let getDataTimeout = setTimeout(() => {
            getData(device);
          }, 1000);
      
          const getData = device => {
            if (getDataTimeout) clearTimeout(getDataTimeout);
      
            device.checkData();
      
            getDataTimeout = setTimeout(() => {
              getData(device);
            }, 1000);
          };
      
          let onRawData = message => {
            cancelLearning();
      
            return resolve({
              secret: Math.random()
                .toString(36)
                .substring(3),
              mac: macRegExp.test(host) ? host : false,
              ip: macRegExp.test(host) ? false : host,
              data: message.toString("hex")
            });
          };
      
          device.on("rawData", onRawData);
      
          // Start learning:
          device.enterLearning ? device.enterLearning() : device.enterRFSweep();
        });
      });
  }
}
