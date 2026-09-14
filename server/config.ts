import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: '0.0.0.0',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/compliance_scanner',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  ocrProvider: process.env.OCR_PROVIDER || 'mock',
  demoMode: process.env.DEMO_MODE !== 'false',
  useRedis: process.env.USE_REDIS === 'true',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  aiProvider: process.env.AI_PROVIDER || 'mock',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  googleCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
  agentWebSearchEnabled: process.env.AGENT_WEB_SEARCH_ENABLED === 'true',
  agentBrowserEnabled: process.env.AGENT_BROWSER_ENABLED === 'true',
  agentLicenseLookupEnabled: process.env.AGENT_LICENSE_LOOKUP_ENABLED === 'true',
  agentPriceLookupEnabled: process.env.AGENT_PRICE_LOOKUP_ENABLED === 'true',
};
