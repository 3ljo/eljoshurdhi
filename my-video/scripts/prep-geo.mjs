// Bakes the geographic data used by the Location scene, so the video needs no
// map tiles or network access. Run with: node scripts/prep-geo.mjs
//
// Outputs:
//   src/geo/land-dots.json  [lon, lat] points on land, for the dotted globe
//   src/geo/balkans.json    detailed outlines of Albania and its neighbours

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "src", "geo");
mkdirSync(out, { recursive: true });

const readTopo = (name) =>
  JSON.parse(readFileSync(require.resolve(`world-atlas/${name}`), "utf8"));

// Dotted globe: roughly equal-area spacing, so dots don't bunch at the poles.
const land = feature(
  readTopo("land-110m.json"),
  readTopo("land-110m.json").objects.land,
);
const dots = [];
const STEP = 1.7;
for (let lat = -56; lat <= 78; lat += STEP) {
  const lonStep = STEP / Math.cos((lat * Math.PI) / 180);
  for (let lon = -180; lon < 180; lon += lonStep) {
    if (geoContains(land, [lon, lat])) {
      dots.push([Math.round(lon * 100) / 100, Math.round(lat * 100) / 100]);
    }
  }
}
writeFileSync(join(out, "land-dots.json"), JSON.stringify(dots));
console.log(`land-dots.json: ${dots.length} dots`);

// Detailed (1:10m) outlines for the zoomed-in shot.
const NAMES = [
  "Albania",
  "Kosovo",
  "Macedonia",
  "Montenegro",
  "Greece",
  "Serbia",
  "Bosnia and Herz.",
  "Croatia",
  "Italy",
  "Bulgaria",
];
const countries = readTopo("countries-10m.json");
const all = feature(countries, countries.objects.countries);
const round = (coords) =>
  typeof coords[0] === "number"
    ? coords.map((c) => Math.round(c * 1000) / 1000)
    : coords.map(round);
const balkans = {
  type: "FeatureCollection",
  features: all.features
    .filter((f) => NAMES.includes(f.properties.name))
    .map((f) => ({
      type: "Feature",
      properties: { name: f.properties.name },
      geometry: {
        type: f.geometry.type,
        coordinates: round(f.geometry.coordinates),
      },
    })),
};
writeFileSync(join(out, "balkans.json"), JSON.stringify(balkans));
console.log(
  `balkans.json: ${balkans.features.map((f) => f.properties.name).join(", ")}`,
);
