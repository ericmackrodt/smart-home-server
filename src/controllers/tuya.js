import TuyaDevice from 'tuyapi';
import BaseController from '../base.controller';
import config from 'config';

export const tuya = new TuyaDevice(config.get('tuya'));

function getDevice(part) {
    return {
        tv: 1,
        retro: 2,
        new: 3,
        light: 4,
        usb: 5,
        all: 6
    }[part];
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
