import "reflect-metadata";
import { App } from "./app";
import { Container } from "typedi";

const app = Container.get(App);

app.start();
