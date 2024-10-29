declare namespace NodeJS {
  interface ProcessEnv {
    API_HOST: string;
    API_PORT: number;
    
    JWT_SECRET: string;
    
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DIALECT: "postgres";
  }
}
