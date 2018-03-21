import Lifx from 'node-lifx-lan';

export const turnOn = () => {
  return Lifx.turnOnBroadcast({
    duration: 1000
  });
};

export const turnOff = () => {
  return Lifx.turnOffBroadcast({
    duration: 1000
  });
}
