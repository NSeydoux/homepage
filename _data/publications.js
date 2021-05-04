const BibtexParser = require("bib2json");
const { readFileSync } = require("fs");

var entries = BibtexParser(readFileSync("./research/publications.bib", {
  encoding: "utf-8"
})).entries;

const processedEntries = entries.map((rawEntry) => {
  const entry = {};

  if(rawEntry.EntryType !== undefined) {
    entry.type = rawEntry.EntryType;
  }

  if(rawEntry.EntryKey !== undefined) {
    entry.key = rawEntry.EntryKey;
  }

  if(rawEntry.Fields.title !== undefined) {
    entry.title = rawEntry.Fields.title;
  }

  if(rawEntry.Fields.booktitle !== undefined) {
    entry.booktitle = rawEntry.Fields.booktitle;
  }

  if(rawEntry.Fields.author !== undefined) {
    entry.author = rawEntry.Fields.author.split(" and ").map((fullName) => {
      return fullName.split(", ").reverse().join(" ");
    }).join(", ");
  }

  if(rawEntry.Fields.month !== undefined) {
    entry.month = rawEntry.Fields.month;
  }

  if(rawEntry.Fields.year !== undefined) {
    entry.year = rawEntry.Fields.year;
  }

  if(rawEntry.Fields.url !== undefined) {
    entry.url = rawEntry.Fields.url;
  }

  if(rawEntry.Fields.journal !== undefined) {
    entry.journal = rawEntry.Fields.journal;
  }

  if(rawEntry.Fields.publisher !== undefined) {
    entry.publisher = rawEntry.Fields.publisher;
  }

  if(rawEntry.Fields.address !== undefined) {
    entry.address = rawEntry.Fields.address;
  }

  if(rawEntry.Fields.institution !== undefined) {
    entry.institution = rawEntry.Fields.institution;
  }

  return entry;
});

const journal = processedEntries.filter((entry) => [
  "ITL2018", 
  "sensors2018"
].includes(entry.key));

const internationalConferences = processedEntries.filter((entry) => [
  "COOPIS2018",
  "WI2018",
  "ICSOC2017",
  "EKAW2016",
  "InterIoT2016"
].includes(entry.key));

const nationalConferences = processedEntries.filter((entry) => [
  "IC2019",
  "IC2016",
  "IC2015",
].includes(entry.key));

const workshops = processedEntries.filter((entry) => [
  "SWIT2017",
  "SWIT2016",
].includes(entry.key));

const posters = processedEntries.filter((entry) => [
  "ISWC2016",
].includes(entry.key));

const tutorials = processedEntries.filter((entry) => [
  "NCTU2018",
  "TutoISWC2017",
  "TutoIC2017",
].includes(entry.key));

const whitepapers = processedEntries.filter((entry) => [
  "whitepaper2016",
].includes(entry.key));

const standards = processedEntries.filter((entry) => [
  "oneM2M2015",
].includes(entry.key));

const thesis = processedEntries.filter((entry) => [
  "thesisseydoux",
].includes(entry.key));

module.exports = {
  journal, 
  internationalConferences, 
  nationalConferences, 
  workshops,
  posters,
  tutorials,
  standards,
  whitepapers,
  thesis
};