# Wetter-Dashboard

Zeigt das aktuelle Wetter und eine 7-Tage-Vorhersage für eine beliebige Stadt,
mit echten Live-Daten von [Open-Meteo](https://open-meteo.com) (kostenlos,
kein API-Key nötig).

## Features

- Stadtsuche über die Open-Meteo-Geocoding-API
- Aktuelle Temperatur, Wetterlage, Windgeschwindigkeit
- 7-Tage-Vorhersage als kleines Balkendiagramm (Min/Max-Temperatur, Wettericon)
- Fehlerbehandlung bei ungültigen Stadtnamen

## Tech

Reines HTML, CSS und JavaScript — kein Framework, kein Build-Schritt. Nutzt
`fetch` für zwei öffentliche APIs (Geocoding + Forecast).

## Lokal öffnen

`index.html` einfach im Browser öffnen, fertig.
