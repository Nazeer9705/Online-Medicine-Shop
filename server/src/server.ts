import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`===========================================================`);
  logger.info(` MEDICARE V2.0 Enterprise REST API Server Running!`);
  logger.info(` Server URL: http://localhost:${PORT}`);
  logger.info(` API v1 Endpoint: http://localhost:${PORT}/api/v1`);
  logger.info(` Environment: ${config.nodeEnv}`);
  logger.info(`===========================================================`);
});
