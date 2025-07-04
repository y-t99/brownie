// Core types

export interface CoreConfig {
  version: string;
  environment: "development" | "production" | "test";
}

export type CoreOptions = Partial<CoreConfig>;
