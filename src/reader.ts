import { Service } from "typedi";
import path from "path";
import readLine from "readline";
import { once } from "events";
import { createReadStream } from "fs";

@Service()
export class Reader {
  private filePath: string = path.resolve(__dirname, "../files/catalog.csv");
  private counter = 0;

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
        const images: string = chunks[1];
        const product: string = values[3];
        const price: number = Number(values[2]);
        const category: string = values[1];
        const weight: number = Number(values[0]);
        if (isNaN(price)) {
          //console.log(chunks[0]);
          console.log("Anomaly at line", this.counter);
        }
        console.log(product);

        /* console.log({
          product,
          price,
          weight,
          category,
        }); */
      }
      this.counter++;
    });

    // Stop process till a close event is fired on rl stream emitter
    await once(rl, "close");

    console.timeEnd("read");
  }
}
