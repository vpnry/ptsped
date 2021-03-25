/**
 * Convert PTS PED proofread 2021 Roman to many pali scripts
 */

const fs = require("fs");

const PC = require("./pali-script.js");
const readline = require("readline");

// PTSPED-2021 raw output must be manually fixed some errors before using here

let dicTabFile = "PTSPED-2021";
const op = "output";
fs.mkdirSync(op, { recursive: true });

let c = 0;

for (let s of Object.keys(PC.Script)) {
  toAllScripts(dicTabFile, PC.Script[s]);
}

function toAllScripts(f, lang) {
  if (lang == "ro") {
    console.log("Skipping Roman");
    return;
  }

  let res = "";
  let n = 0;
  const rl = readline.createInterface({
    input: fs.createReadStream(f, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    line = line.trim();
    let pos = line.indexOf("\t");
    let word = line.slice(0, pos).trim();
    let defi = line.slice(pos).trim();

    let si = PC.TextProcessor.convertFrom(word, "ro");
    let targetS = PC.TextProcessor.convert(si, lang);

    // escape info
    if (word == "001info" || word == "002info" || word == "000License") {
      targetS = word;
      defi = defi;
    } else {
      defi = "<p><b>" + targetS + "</b>: " + defi.slice(defi.indexOf("<p>") + "<p>".length);
    }

    // Add target lang in the defi
    res += targetS + "\t" + defi.trim() + "\n";
    n++;
  });

  rl.on("close", (s) => {
    let ap = PC.paliScriptInfo.get(lang)[0].trim();
    // filename should not contain a space, otherwise will have issues with pyglossary
    ap = ap.replace(/\s+/g, "");
    fs.writeFileSync(op + "/" + ap + "-" + f, res);
    c++;
    console.log(c + ". Converting to: " + lang + " done!");
  });
}
