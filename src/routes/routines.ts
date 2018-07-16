import { Router } from 'express';
import * as routines from '../handlers/routines';
import { promiseRoute } from '../utils';

const router = Router();

router.get('/execute/:command', promiseRoute((req) => routines.execute(req.params.command)));

export default router;
