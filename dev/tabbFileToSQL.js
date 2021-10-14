// Tabfile to sql
// Usable in http://play.google.com/store/apps/details?id=mm.pndaza.tipitakapali

const fs = require("fs");
let res = "";
let lines = fs.readFileSync("PTSPED-2021-NoVethuis", {
    encoding: "utf8",
    flag: "r",
});
lines = lines.split(/\r?\n/);

let dictNumberInDb = 5;

for (let line of lines) {
    line = line.trim();
    if (line.length < 1) continue;
    line = line.replace(/'/g, "''");
    let pos = line.indexOf("\t");

    let word = line.substr(0, pos).trim();
    let defi = line.substr(pos).trim();

    // Some lines not: line.endsWith("</p>"), so here just use append span tag
    defi = `<span class="definition">` + defi + "</span>";
    res +=
        `INSERT INTO "dictionary" VALUES ('${word}','${defi}', ${dictNumberInDb});` +
        "\n";
}

fs.writeFileSync("PTSPED-2021-5.sql", res, { encoding: "utf8" });

console.log("Done");
