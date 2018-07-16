import config from 'config';
import * as express from 'express';

import tuya from './routes/tuya';
import broadlink from './routes/broadlink';
import lifx from './routes/lifx';
import routines from './routes/routines';

export default () => {
    const app = express();

    app.get('/health', (req, res) => res.send('I am Alive!'));
    
    app.use('/routines', routines);
    app.use('/power_strip', tuya);
    app.use('/remotes', broadlink);
    app.use('/lights', lifx);

    app.listen(8989, () => console.log('Server running and such.'));
};
