declare namespace NodeJS {
  interface ProcessEnv {
    API_PORT: string;
    JWT_SECRET: string;
    DATABASE_NAME: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_HOST: string;
    DATABASE_DIALECT: "postgres";
  }
}
