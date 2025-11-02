declare namespace NodeJS {
  interface ProcessEnv {
    // Server
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;

    // Mail Configuration
    MAIL_MAILER: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;
    MAIL_ENCRYPTION: string;
    MAIL_FROM_ADDRESS: string;
    MAIL_FROM_NAME: string;

    // JWT
    JWT_SECRET: string;

    // App URLs
    APP_URL: string;
  }
}
