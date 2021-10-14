/**
 * Convert PTS PED proofread 2021 Roman to many pali scripts
 * Last modified Oct 2021
 */

const fs = require("fs");
const PC = require("./pali-script.js");

let inTabfile = "PTSPED-2021-noVethuis";
const op = "No_vethuis_tabfiles";

try {
    fs.mkdirSync(op, { recursive: true });
} catch (e) {}

const readline = require("readline");
let c = 0;

for (let s of Object.keys(PC.Script)) {
    toAllScripts(inTabfile, PC.Script[s]);
}

function toAllScripts(f, lang) {
    if (lang == "ro") {
        console.log("Skipping Roman script");
        return;
    }

    let res = "";
    let n = 0;
    const rl = readline.createInterface({
        input: fs.createReadStream(f, { encoding: "utf8" }),
        crlfDelay: Infinity /*Recognise \r\n*/,
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
            let newWord = "<b>" + targetS + "</b>: ";
            let n = defi.indexOf("<p>");
            let nplus = "<p>".length;
            let css = defi.slice(0, n + nplus);
            defi = css + newWord + defi.slice(n + nplus);
        }

        // Add target lang in the defi
        res += targetS + "\t" + defi.trim() + "\n";
        n++;
    });

    rl.on("close", (s) => {
        let ap = PC.paliScriptInfo.get(lang)[0].trim();
        // filename should not contain a space, otherwise will have issues with pyglossary
        ap = ap.replace(/\s+/g, "");
        fs.writeFileSync(op + "/" + ap + "-" + f.replace('-noVethuis', ''), res);
        c++;
        console.log(c + ". Converting to: " + lang + " done!");
    });
}
