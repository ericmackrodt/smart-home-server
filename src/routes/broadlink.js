import { Router } from 'express';
import * as broadlink from '../handlers/broadlink';
import { promiseRoute } from '../utils';

const router = Router();

router.get('/activate/:command', promiseRoute((req) => broadlink.activate(req.params.command)));

export default router;
