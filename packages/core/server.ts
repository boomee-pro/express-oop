import express, { Application, type RequestHandler } from "express";
import type { PassportStatic } from "passport";
import "reflect-metadata";
import type { HttpRoute } from "../types/http";
import { Controller } from "./controller";
import Strategy from "./strategy";

export class Server {
  private readonly app: Application;
  private passport: PassportStatic;

  constructor(passport: PassportStatic) {
    this.app = express();
    this.passport = passport;
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }

  public setMiddlewares(middlewares: RequestHandler[]): void {
    for (const middleware of middlewares) {
      this.app.use(middleware);
    }
  }

  public setController(controllers: Array<new () => Controller>): void {
    for (const controller of controllers) {
      const instance = new controller();
      const path: string = Reflect.getMetadata("path", controller);
      const routes: HttpRoute[] = Reflect.getMetadata("routes", controller);

      const router = express.Router();
      for (const route of routes) {
        const handler = instance[route.handler];
        router[route.method](route.path, handler);
      }
      this.app.use(path, router);
    }
  }

  public setStrategies(strategies: Strategy[]): void {
    for (const strategy of strategies) {
      this.passport.use(strategy.name, strategy.strategy);
    }
  }

  public setSerializers(serializers: Function[]): void {
    for (const serializer of serializers) {
      this.passport.serializeUser(serializer);
    }
  }

  public setDeserializers(deserializers: Function[]): void {
    for (const deserializer of deserializers) {
      this.passport.deserializeUser(deserializer);
    }
  }
}
