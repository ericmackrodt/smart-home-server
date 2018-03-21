import { Router } from 'express';
import * as tuya from '../handlers/tuya';
import { promiseRoute } from '../utils';

const router = Router();

router.get('/turn/:device/:state', promiseRoute((req) => tuya.turn(req.params.device, req.params.state)));

export default router;
