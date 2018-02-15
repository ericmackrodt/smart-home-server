import TuyaDevice from 'tuyapi';
import BaseController from '../base.controller';
import config from 'config';

export const tuya = new TuyaDevice(config.get('tuya'));



function getDevice(part) {
    part = part.toLowerCase();
    if (part.indexOf('tv') > 1) return 1;
    if (part.indexOf('retro') > 1) return 2;
    if (part.indexOf('new') > 1) return 3;
    if (part.indexOf('light') > 1) return 4;
    if (part.indexOf('usb') > 1) return 5;
    if (part.indexOf('all') > 1) return 6;
}

export default class TuyaController extends BaseController {
    constructor(tuya) {
        super('power_strip');
        this._tuya = tuya;
        this._tuya.resolveIds();        
    }

    turnOn({ part }) {
        const device = getDevice(part);
        this._tuya.set({set: true, dps: device})
            .then(result => {
                console.log('Enabled:', device);
            })
            .catch(err => console.log('Error: ', err));
    }

    turnOff({ part }) {
        const device = getDevice(part);
        this._tuya.set({set: false, dps: device})
            .then(result => {
                console.log('Disabled:', device);
            })
            .catch(err => console.log('Error: ', err));
    }
}
