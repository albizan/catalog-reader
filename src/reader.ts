import { Service } from "typedi";
import path from "path";
import readLine from "readline";
import { once } from "events";
import { createReadStream } from "fs";
const fs = require("fs");

const USD_TO_EUR = 0.89;
const POUNDS_TO_KG = 0.45;

@Service()
export class Reader {
  private filePath: string = path.resolve(__dirname, "../files/catalog.csv");
  private counter = 0;
  private products = "";

  async read() {
    console.log("Reading catalog...");
    console.time("read");
    const rl = readLine.createInterface({
      input: createReadStream(this.filePath),
    });

    rl.on("line", (line) => {
      // Sometimes there are
      if (this.counter > 0) {
        // Divide images and actual specifics
        const chunks = line.split('"', 2);

        // Reverse teh sppecifics portion of the string and remose the first 2 character (' ,')
        let reversed = chunks[0].split("").reverse().join("").slice(2);
        let values: string[] = reversed.split(" ,", 4);
        values = values.map((s) => s.trim().split("").reverse().join(""));
        const imageUrl: string = chunks[1].split(",")[0].split("?")[0];
        const product: string = values[3].substring(0, 120);
        const price: string = (Number(values[2]) * USD_TO_EUR).toFixed(2);
        const category: string = values[1];
        const weight: string = (Number(values[0]) * POUNDS_TO_KG).toFixed(2);

        if (isNaN(Number(price))) {
          //console.log(chunks[0]);
          console.log("Anomaly at line", this.counter);
        }
        // console.log(images);
        const row = `${product};1;10;${price};${weight};99;${imageUrl}\r\n`;
        this.products += row;
      }
      this.counter++;
    });

    // Stop process till a close event is fired on rl stream emitter
    await once(rl, "close");

    fs.writeFile("./files/products.csv", this.products, (err: any) => {
      if (err) console.log(err);
      else {
        // console.log("File written successfully\n");
      }
    });

    console.timeEnd("read");
  }
}
