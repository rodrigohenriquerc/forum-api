import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["**/tests/**/*.ts", "**/?(*.)+(test).ts"],
  watchman: false,
};

export default config;