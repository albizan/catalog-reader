import { Inject, Service } from "typedi";
import { Reader } from "./reader";

@Service()
export class App {
  constructor(private reader: Reader) {}

  async start() {
    await this.reader.read();
  }
}
