const fs = require("fs");
let res = "";
let lines = fs.readFileSync("PTSPED-2021", { encoding: "utf8", flag: "r" });
lines = lines.split(/\r?\n/);

for (let line of lines) {
  line = line.trim();
  if (line.length < 1) continue;
  line = line.replace(/'/g, "''");
  let pos = line.indexOf("\t");
  let word = line.substr(0, pos).trim();
  let defi = line.substr(pos).trim();
  // Some lines not: line.endsWith("</p>"), so here just use append span tag
  defi = `<span class="definition">` + defi + "</span>";
  res += `INSERT INTO "dictionary" VALUES ('${word}','${defi}', 5);` + "\n";
}

fs.writeFileSync("PTSPED-2021-5.sql", res);

console.log("Done");
