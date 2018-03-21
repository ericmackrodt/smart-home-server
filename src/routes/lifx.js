import { Router } from 'express';
import * as lifx from '../handlers/lifx';
import { promiseRoute } from '../utils';

const router = Router();

router.get('/turnOn', promiseRoute((req) => lifx.turnOn()));
router.get('/turnOff', promiseRoute((req) => lifx.turnOff()));

export default router;
