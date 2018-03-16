import config from 'config';
import express from 'express';

import tuya from './routes/tuya';

const app = express();

app.get('/health', (req, res) => res.send('I am Alive!'));

app.use('/power_strip', tuya);

app.listen(8989, () => console.log('Server running and such.'));
