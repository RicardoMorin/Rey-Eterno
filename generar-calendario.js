#!/usr/bin/env node
/* Genera versiculos.ics a partir de versiculos.js
   Uso:  node generar-calendario.js
   Vuelve a correrlo (y sube el .ics) cuando cambies la lista o cada año.
   Cubre desde el 1 de enero del año actual hasta el 31 de diciembre del año siguiente. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dir = __dirname;
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, "versiculos.js"), "utf8") + "\nthis.VERS=VERS;", ctx);
const VERS = ctx.VERS;
const n = VERS.length;

const SITIO = "https://rey-eterno.com/";
const pad = (x) => String(x).padStart(2, "0");
const ymd = (d) => d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate());

/* Mismo cálculo que la página: día del año (1 de enero = 1), versículo = VERS[día % total] */
function numeroDia(d) {
  return Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5);
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/* Las líneas del .ics se doblan a 75 bytes (UTF-8) máximo */
function doblar(linea) {
  const out = [];
  let actual = "", bytes = 0, limite = 75;
  for (const ch of linea) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > limite) {
      out.push(actual);
      actual = " ";
      bytes = 1;
      limite = 75;
    }
    actual += ch;
    bytes += b;
  }
  out.push(actual);
  return out.join("\r\n");
}

const hoy = new Date();
const anio = hoy.getUTCFullYear();
const ini = Date.UTC(anio, 0, 1);
const fin = Date.UTC(anio + 1, 11, 31);
const sello = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");

const L = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Iglesia Rey Eterno//Versiculo del dia//ES",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "X-WR-CALNAME:Versículo del día · Rey Eterno",
  "X-WR-CALDESC:Un versículo nuevo cada día de la Iglesia Cristiana Rey Eterno.",
  "X-WR-TIMEZONE:America/Monterrey",
  "REFRESH-INTERVAL;VALUE=DURATION:P1D",
  "X-PUBLISHED-TTL:P1D",
  "X-APPLE-CALENDAR-COLOR:#4A2C7A",
];

let total = 0;
for (let t = ini; t <= fin; t += 864e5) {
  const d = new Date(t);
  const v = VERS[numeroDia(d) % n];
  const sig = new Date(t + 864e5);
  L.push(
    "BEGIN:VEVENT",
    "UID:versiculo-" + ymd(d) + "@rey-eterno.com",
    "DTSTAMP:" + sello,
    "DTSTART;VALUE=DATE:" + ymd(d),
    "DTEND;VALUE=DATE:" + ymd(sig),
    "SUMMARY:" + esc("“" + v[0] + "” — " + v[1]),
    "DESCRIPTION:" + esc("“" + v[0] + "”\n" + v[1] + "\n\nIglesia Cristiana Rey Eterno\n" + SITIO),
    "URL:" + SITIO + "versiculo.html",
    "TRANSP:TRANSPARENT",
    "CATEGORIES:Versículo del día",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:" + esc(v[1]),
    "TRIGGER:PT7H",
    "END:VALARM",
    "END:VEVENT"
  );
  total++;
}
L.push("END:VCALENDAR");

fs.writeFileSync(path.join(dir, "versiculos.ics"), L.map(doblar).join("\r\n") + "\r\n", "utf8");
console.log("Listo: versiculos.ics con " + total + " días (" + ymd(new Date(ini)) + " a " + ymd(new Date(fin)) + ").");
