import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Response {
    success: (data: any, message?: string) => this;
    error: (message: string, status?: number) => this;
  }
}