import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Fleet Management API',
  environment: process.env.APP_ENV || 'development',
  port: parseInt(process.env.APP_PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  apiVersion: process.env.API_VERSION || 'v1',
}))