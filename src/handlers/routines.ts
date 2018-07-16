import * as broadlink from "./broadlink";
import * as tuya from './tuya';
import { delay } from "../utils";

const routines: { [key: string]: (() => Promise<any>)[] } = {
  'tv-chromecast': [
    () => delay(10),
    () => tuya.turn('usb', 'on'),
    () => tuya.turn('tv', 'on'),
    () => delay(10),
    () => broadlink.activate('tv-power'),
    () => broadlink.activate('hdmi-5')
  ]
};

export async function execute(command: string) {
  const routine = routines[command];
  if (!routine) {
    return false;
  }

  routine.reduce(async (previousValue, currentValue, currentIndex, array) => {
    await previousValue;
    console.log(currentIndex);
    return currentValue();
  }, Promise.resolve());

  return true;
}
