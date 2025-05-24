import express from 'express';
import {
  start,
  stop,
  updateRate,
  status,
  initController,
  getCurrentRate
} from './controller';
import { Request, Response } from 'express';
import {
  ControlRateRequest,
  ControlStartRequest,
  ControlStatus
} from './types';

export function createControlAPI(port: number = 4000): void {
  const app = express();
  app.use(express.json());

  app.post('/control/start', (req: Request<{}, {}, ControlStartRequest>, res: Response) => {
    start(req.body.rate);
    res.send({ message: 'Started' });
  });

  app.post('/control/stop', (req: Request<{}, {}, ControlStartRequest>, res: Response) => {
    stop();
    res.send({ message: 'Stopped' });
  });

  app.post('/control/rate', (req: Request<{}, {}, ControlRateRequest>, res: Response) => {
    updateRate(req.body.rate);
    res.send({ message: 'Rate updated' });
  });

  app.get('/control/status', (_req: Request, res: Response<ControlStatus>) => {
    res.send(status());
  });
  

  app.listen(port, () => console.log(`🧠 Control API running on port ${port}`));
}

export {
  start,
  stop,
  updateRate,
  status,
  initController,
  getCurrentRate
};
