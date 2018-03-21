import wol from 'wakeonlan';
import BaseController from '../base.controller';

export default class PCController extends BaseController {
  constructor() {
      super('pc');      
  }

  wakeUp() {
    wol('04:18:D6:A0:47:27').then(() => {
      console.log('wol sent!')
    });
  }
}
