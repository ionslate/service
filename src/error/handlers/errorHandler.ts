import log from '@logger/log';
import { DB_ERRORS } from '@error/constants';
import { ErrorRequestHandler } from 'express-serve-static-core';

export const errorHandler: ErrorRequestHandler = (error, _, res) => {
  log.error(error);

  if (DB_ERRORS.includes(error.name)) {
    return res.status(500).send('Internal server error...');
  }

  return res.status(error.status || 500).send(error.meesage);
};
