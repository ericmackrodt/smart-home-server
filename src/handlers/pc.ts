import wol from 'wakeonlan';


export function wakeUp() {
  wol('04:18:D6:A0:47:27').then(() => {
    console.log('wol sent!')
  });
}
