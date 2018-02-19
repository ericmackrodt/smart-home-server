// http://pubsub.pubnub.com/publish/pub-c-f70a6abd-10be-40b9-a7bd-c0bc1a94e9df/sub-c-1ae35e90-0ff1-11e8-839f-32cdab8fe55b/0/power_strip/0/%7B"function":"turnOff","part":"all"%7D
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
