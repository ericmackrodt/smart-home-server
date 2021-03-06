// http://pubsub.pubnub.com/publish/pub-c-f70a6abd-10be-40b9-a7bd-c0bc1a94e9df/sub-c-1ae35e90-0ff1-11e8-839f-32cdab8fe55b/0/power_strip/0/%7B"function":"turnOff","part":"all"%7D


import * as TuyaDevice from 'tuyapi';
import * as config from 'config';

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

tuya.resolveIds();

export function turn(device, state) {
    const part = getDevice(device);
    return tuya.set({set: state === 'on', dps: part})
        .then(result => {
            console.log('Changed:', part, result);
            return { done: true };
        })
        .catch(err => console.log('Error: ', err));
}
