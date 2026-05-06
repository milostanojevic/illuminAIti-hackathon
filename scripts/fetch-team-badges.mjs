/**
 * Populates public/teams/<slug>.png from TheSportsDB free API (test key 3).
 * On failure writes initials fallback SVG to public/teams/<slug>.svg.
 * Run: node scripts/fetch-team-badges.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "teams");

const API_KEY = "3";
const THROTTLE_MS = 1500;

const SLUG_OVERRIDES = {
  "Man City": "man-city",
  "Man Utd": "man-utd",
  "SuperSport Utd": "supersport-utd",
  "Chippa Utd": "chippa-utd",
};

const SEARCH_OVERRIDES = {
  "Man City": "Manchester City",
  "Man Utd": "Manchester United",
  Newcastle: "Newcastle United",
  Tottenham: "Tottenham Hotspur",
  Wolves: "Wolverhampton Wanderers",
  "West Ham": "West Ham United",
  "Aston Villa": "Aston Villa",
  Atletico: "Atletico Madrid",
  Sociedad: "Real Sociedad",
  Athletic: "Athletic Bilbao",
  Bayern: "Bayern Munich",
  Dortmund: "Borussia Dortmund",
  Leverkusen: "Bayer Leverkusen",
  Leipzig: "RB Leipzig",
  Frankfurt: "Eintracht Frankfurt",
  Wolfsburg: "VfL Wolfsburg",
  Gladbach: "Borussia Monchengladbach",
  Mainz: "Mainz 05",
  Hoffenheim: "1899 Hoffenheim",
  Freiburg: "SC Freiburg",
  PSG: "Paris Saint-Germain",
  Inter: "Inter Milan",
  "SuperSport Utd": "SuperSport United",
  "Chippa Utd": "Chippa United",
  Sekhukhune: "Sekhukhune United",
  "Richards Bay": "Richards Bay FC",
  "Cape Town City": "Cape Town City FC",
  Stellenbosch: "Stellenbosch FC",
};

/** Prefer South Africa when multiple soccer clubs match these display names */
const PSL_DISPLAY_NAMES = new Set([
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
]);

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

function pickTeam(teams, displayName) {
  if (!Array.isArray(teams) || teams.length === 0) return null;
  const soccer = teams.filter((t) => !t.strSport || t.strSport === "Soccer");
  const pool = soccer.length ? soccer : teams;

  if (PSL_DISPLAY_NAMES.has(displayName)) {
    const sa = pool.filter((t) => t.strCountry === "South Africa");
    if (sa.length) return sa[0];
  }

  const exact = pool.find((t) => (t.strTeam || "").toLowerCase() === displayName.toLowerCase());
  if (exact) return exact;

  return pool[0];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function downloadBuffer(url, attempt = 1) {
  const maxAttempts = 8;
  try {
    const buf = await new Promise((resolve, reject) => {
      const req = https.get(
        url,
        {
          headers: { "User-Agent": "illuminAIti-hackathon/1.0 (team badge fetch)" },
          timeout: 35000,
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const next = res.headers.location.startsWith("http")
              ? res.headers.location
              : new URL(res.headers.location, url).href;
            res.resume();
            return downloadBuffer(next, 1).then(resolve).catch(reject);
          }
          if (res.statusCode === 429 && attempt < maxAttempts) {
            res.resume();
            return reject(Object.assign(new Error("HTTP 429"), { retryable: true }));
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
    return buf;
  } catch (e) {
    if (e.retryable && attempt < maxAttempts) {
      await sleep(3000 * attempt);
      return downloadBuffer(url, attempt + 1);
    }
    throw e;
  }
}

function fetchJson(url) {
  return downloadBuffer(url).then((buf) => {
    const text = buf.toString("utf8");
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("invalid JSON");
    }
  });
}

function isPng(buf) {
  return buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "other.svg"), OTHER_SVG, "utf8");

  /** @type {Set<string>} */
  const pngWritten = new Set();

  const seen = new Set();
  for (const name of TEAM_NAMES) {
    const slug = slugify(name);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const query = SEARCH_OVERRIDES[name] ?? name;
    const apiUrl = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/searchteams.php?t=${encodeURIComponent(query)}`;

    const destPng = path.join(OUT, `${slug}.png`);
    const destSvg = path.join(OUT, `${slug}.svg`);

    try {
      const data = await fetchJson(apiUrl);
      const team = pickTeam(data?.teams, name);
      const badgeUrl = team?.strTeamBadge || team?.strBadge || "";

      if (!badgeUrl || !/^https?:\/\//i.test(badgeUrl)) {
        fs.writeFileSync(destSvg, fallbackSvg(name), "utf8");
        console.log(`no-match: ${slug} (no badge URL)`);
        await sleep(THROTTLE_MS);
        continue;
      }

      const buf = await downloadBuffer(badgeUrl);
      if (!isPng(buf)) {
        fs.writeFileSync(destSvg, fallbackSvg(name), "utf8");
        console.log(`fallback (not PNG): ${slug}`);
        await sleep(THROTTLE_MS);
        continue;
      }

      fs.writeFileSync(destPng, buf);
      pngWritten.add(slug);
      console.log(`ok: ${slug}`);
    } catch (e) {
      fs.writeFileSync(destSvg, fallbackSvg(name), "utf8");
      console.log(`fallback (${e.message}): ${slug}`);
    }

    await sleep(THROTTLE_MS);
  }

  for (const slug of pngWritten) {
    const svgPath = path.join(OUT, `${slug}.svg`);
    if (fs.existsSync(svgPath)) {
      fs.unlinkSync(svgPath);
      console.log(`removed stale: ${slug}.svg`);
    }
  }

  /** Remove any *.svg that still sits beside a successful *.png (e.g. partial run). */
  for (const f of fs.readdirSync(OUT).filter((x) => x.endsWith(".png"))) {
    const slug = f.replace(/\.png$/i, "");
    if (!slug) continue;
    const svgPath = path.join(OUT, `${slug}.svg`);
    if (fs.existsSync(svgPath)) {
      fs.unlinkSync(svgPath);
      console.log(`removed stale: ${slug}.svg`);
    }
  }

  const pngCount = fs.readdirSync(OUT).filter((x) => x.endsWith(".png")).length;
  console.log("done:", OUT, `(${pngCount} PNG)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
