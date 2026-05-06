/**
 * Populates public/teams/*.svg — tries Wikimedia upload URLs, writes initials fallback on failure.
 * Run: node scripts/fetch-team-badges.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "teams");

const SLUG_OVERRIDES = {
  "Man City": "man-city",
  "Man Utd": "man-utd",
  "SuperSport Utd": "supersport-utd",
  "Chippa Utd": "chippa-utd",
};

function slugify(name) {
  if (SLUG_OVERRIDES[name]) return SLUG_OVERRIDES[name];
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function initials(name) {
  if (name === "Other") return "+";
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

function fallbackSvg(name) {
  const ini = initials(name);
  const fsz = ini.length > 2 ? 14 : 18;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#e8eaf0"/><text x="32" y="42" text-anchor="middle" font-size="${fsz}" font-weight="bold" fill="#475569" font-family="system-ui,sans-serif">${ini.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></svg>`;
}

const OTHER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#dde0ee"/><text x="32" y="42" text-anchor="middle" font-size="28" fill="#64748b" font-family="system-ui,sans-serif">+</text></svg>`;

/** Wikimedia / Wikipedia upload URLs (SVG). Fallback used if not listed or download fails. */
const URL_BY_SLUG = {
  arsenal: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  liverpool: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  chelsea: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  "man-utd": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "man-city": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  tottenham: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  newcastle: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
  "aston-villa": "https://upload.wikimedia.org/wikipedia/en/9/9a/Aston_Villa_FC_new_crest_2016.svg",
  "west-ham": "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
  wolves: "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
  "real-madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  barcelona: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  atletico: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Atl%C3%A9tico_Madrid_logo_2024.svg",
  sevilla: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg",
  "real-betis": "https://upload.wikimedia.org/wikipedia/en/1/13/Real_Betis_logo.svg",
  valencia: "https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg",
  villarreal: "https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg",
  athletic: "https://upload.wikimedia.org/wikipedia/en/9/98/Athletic_Club_logo.svg",
  sociedad: "https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg",
  osasuna: "https://upload.wikimedia.org/wikipedia/en/d/d4/CA_Osasuna_logo.svg",
  bayern: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
  dortmund: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
  leverkusen: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg",
  leipzig: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg",
  frankfurt: "https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg",
  wolfsburg: "https://upload.wikimedia.org/wikipedia/commons/f/f3/VfL_Wolfsburg_Logo.svg",
  gladbach: "https://upload.wikimedia.org/wikipedia/commons/8/81/Borussia_M%C3%B6nchengladbach_logo.svg",
  freiburg: "https://upload.wikimedia.org/wikipedia/de/1/14/SC_Freiburg_Logo.svg",
  hoffenheim: "https://upload.wikimedia.org/wikipedia/commons/e/e7/TSG_1899_Hoffenheim_logo.svg",
  mainz: "https://upload.wikimedia.org/wikipedia/commons/9/9e/1._FSV_Mainz_05_Logo.svg",
  psg: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  inter: "https://upload.wikimedia.org/wikipedia/commons/0/05/Inter_Milan_logo_2021.svg",
  brazil: "https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg",
  france: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
  argentina: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_Argentina.svg",
  england: "https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg",
  germany: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg",
  spain: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
  portugal: "https://upload.wikimedia.org/wikipedia/en/5/5c/Flag_of_Portugal.svg",
  netherlands: "https://upload.wikimedia.org/wikipedia/en/a/a3/Flag_of_the_Netherlands.svg",
  "south-africa": "https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg",
  morocco: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg",
  "mamelodi-sundowns": "https://upload.wikimedia.org/wikipedia/en/1/1b/Mamelodi_Sundowns_FC_logo.svg",
  "orlando-pirates": "https://upload.wikimedia.org/wikipedia/commons/0/07/Orlando_Pirates_FC_logo.svg",
  "kaizer-chiefs": "https://upload.wikimedia.org/wikipedia/en/8/8a/Kaizer_Chiefs_FC_logo.svg",
  "cape-town-city": "https://upload.wikimedia.org/wikipedia/en/2/25/Cape_Town_City_FC_logo.svg",
  stellenbosch: "https://upload.wikimedia.org/wikipedia/en/5/5c/Stellenbosch_FC_logo.svg",
  "supersport-utd": "https://upload.wikimedia.org/wikipedia/en/1/19/SuperSport_United_FC_logo.svg",
  amazulu: "https://upload.wikimedia.org/wikipedia/en/4/4e/AmaZulu_FC_logo.svg",
  sekhukhune: "https://upload.wikimedia.org/wikipedia/en/3/3e/Sekhukhune_United_FC_logo.svg",
  "richards-bay": "https://upload.wikimedia.org/wikipedia/en/7/7b/Richards_Bay_FC_logo.svg",
  "chippa-utd": "https://upload.wikimedia.org/wikipedia/en/7/70/Chippa_United_FC_logo.svg",
};

const TEAM_NAMES = [
  "Mamelodi Sundowns",
  "Orlando Pirates",
  "Kaizer Chiefs",
  "Cape Town City",
  "Stellenbosch",
  "SuperSport Utd",
  "AmaZulu",
  "Sekhukhune",
  "Richards Bay",
  "Chippa Utd",
  "Arsenal",
  "Man City",
  "Liverpool",
  "Chelsea",
  "Tottenham",
  "Man Utd",
  "Newcastle",
  "Aston Villa",
  "West Ham",
  "Wolves",
  "Real Madrid",
  "Barcelona",
  "Atletico",
  "Sevilla",
  "Real Betis",
  "Valencia",
  "Villarreal",
  "Athletic",
  "Sociedad",
  "Osasuna",
  "Bayern",
  "Dortmund",
  "Leverkusen",
  "Leipzig",
  "Frankfurt",
  "Wolfsburg",
  "Gladbach",
  "Freiburg",
  "Hoffenheim",
  "Mainz",
  "PSG",
  "Inter",
  "Brazil",
  "France",
  "Argentina",
  "England",
  "Germany",
  "Spain",
  "Portugal",
  "Netherlands",
  "South Africa",
  "Morocco",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: { "User-Agent": "illuminAIti-hackathon/1.0 (team badge fetch)" },
        timeout: 20000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          res.resume();
          return download(next).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "other.svg"), OTHER_SVG, "utf8");

  const seen = new Set();
  for (const name of TEAM_NAMES) {
    const slug = slugify(name);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const dest = path.join(OUT, `${slug}.svg`);
    const url = URL_BY_SLUG[slug];
    if (!url) {
      fs.writeFileSync(dest, fallbackSvg(name), "utf8");
      console.log(`fallback (no URL): ${slug}`);
      continue;
    }
    try {
      const buf = await download(url);
      const text = buf.toString("utf8").trim();
      if (!text.includes("<svg") && !text.includes("<?xml")) {
        throw new Error("not svg");
      }
      fs.writeFileSync(dest, text, "utf8");
      console.log(`ok: ${slug}`);
    } catch (e) {
      fs.writeFileSync(dest, fallbackSvg(name), "utf8");
      console.log(`fallback (${e.message}): ${slug}`);
    }
    await sleep(750);
  }
  console.log("done:", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
