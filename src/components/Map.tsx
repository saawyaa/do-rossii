import { geoConicConformal, geoPath } from "d3-geo";
import geography from "../data/russia.json";
import { locations } from "../data/locations";
const locationImages: Record<string, string> = {
  kermek: "/assets/kermek.webp",
  denisova: "/assets/denisova.webp",
  kostenki: "/assets/kostenki.webp",
  sungir: "/assets/sungir.webp",
};
const projection = geoConicConformal()
  .rotate([-105, 0])
  .parallels([50, 70])
  .fitExtent(
    [
      [80, 35],
      [1150, 610],
    ],
    geography as never,
  );
const path = geoPath(projection)(geography as never) || "";
const points = locations.map((p) => ({
  ...p,
  point: projection([p.lon, p.lat])!,
}));
export function Map({ final = false }: { final?: boolean }) {
  return (
    <div className={`map-world ${final ? "final-map" : ""}`}>
      <svg
        viewBox="0 0 1230 715"
        role="img"
        aria-label="Карта: Кермек на Тамани, Денисова пещера на Алтае, Костёнки на Дону и Сунгирь под Владимиром"
      >
        <path className="land" d={path} />
        <path
          className="route"
          d={`M${points.map((p) => p.point.join(",")).join(" L")}`}
        />
        {points.map((p) => (
          <g key={p.id} className={`map-location location-${p.id}`}>
            <image
              className="marker-photo"
              href={locationImages[p.id]}
              x={p.point[0] - 22}
              y={p.point[1] - 22}
              width="44"
              height="44"
              preserveAspectRatio="xMidYMid slice"
            />
            <path className="leader" d={`M${p.point} l${p.dx},${p.dy}`} />
            <circle
              id={`marker-${p.id}${final ? "-final" : ""}`}
              className="marker"
              cx={p.point[0]}
              cy={p.point[1]}
              r="7"
            />
            <text
              x={p.point[0] + p.dx + (p.dx < 0 ? -12 : 12)}
              y={p.point[1] + p.dy}
              textAnchor={p.dx < 0 ? "end" : "start"}
            >
              {p.name}
              <tspan x={p.point[0] + p.dx + (p.dx < 0 ? -12 : 12)} dy="25">
                {p.region}
              </tspan>
            </text>
          </g>
        ))}
      </svg>
      <span className="map-caption">
        СОВРЕМЕННАЯ ГЕОГРАФИЯ · МАРШРУТ ПРЕЗЕНТАЦИИ
      </span>
    </div>
  );
}
