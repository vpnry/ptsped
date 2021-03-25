// PED to tab file - uPnry 06 Mar 2021

/**
 * Dict data html source ped-stand-alone.html file is adapted from buddhadust.net
 
 * License
 * Corrected reprint © The Pali Text Society
 * Commercial Rights Reserved
 * Creative Commons Licence by-nc/3.0/
 */

/**
 * Warning:
 * The output file still has some issues that need to be edited manually
 * We did not cover it in this script since these cases are not so many
 * For example:
 * avadhāna,	<p><b>Avadhāna
 * word2,  <p>
 * etc... that you need to replace manually
 */

const fs = require("fs");

let tabct = mapToTSV(toMap("ped-stand-alone-extract.htm")).trim() + "\n";

// fix single case [niyaṅgama,
tabct = tabct.replace("[niyaṅgama,", "niyaṅgama");

fs.writeFileSync("PTSPED-2021", tabct);

console.log("Done");

function toMap(f) {
  let M = new Map();
  let text = fs.readFileSync(f, { encoding: "utf8", flag: "r" });
  let lines = text.trim().split(/\r?\n/);
  let n = 0;
  let currentW = "";
  for (let line of lines) {
    line = line.trim();
    if (line.length < 1) {
      continue;
    } else if (line.indexOf("<p><b>:") < 0) {
      if (currentW === "") continue;
      M.set(currentW, M.get(currentW) + line);
    } else if (line.indexOf("<p><b>:") === 0) {
      n++;
      currentW = getWord(line);
      let str = line.replace("<p><b>:", "<p><b>").replace("<p><b> ", "<p><b>");
      if (M.has(currentW)) {
        M.set(currentW, M.get(currentW) + "<hr>" + str);
      } else {
        M.set(currentW, str);
      }
    }
  }
  console.log("Total words: " + n);
  return M;
}

function getWord(line) {
  let word = line.replace(/^<p><b>:(.*?)<\/b>.*/g, (_, t1) => {
    t1 = t1.toLowerCase().trim();
    t1 = t1.replace(/<.*?>/g, "");
    return t1.trim();
  });
  return word.trim().replace(/\d+$/g, "");
}

function mapToTSV(M) {
  let str = "";
  for (let [key, value] of M.entries()) {
    str += key + "\t" + value + "\n";
  }
  return str;
}
