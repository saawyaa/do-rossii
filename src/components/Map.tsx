import { memo } from "react";
import { geoConicConformal, geoPath } from "d3-geo";
import geography from "../data/russia.json";
import { locations } from "../data/locations";
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
export const Map = memo(function Map({
  final = false,
  travel = false,
}: {
  final?: boolean;
  travel?: boolean;
}) {
  const suffix = travel ? "-travel" : final ? "-final" : "";
  return (
    <div className={`map-world ${final ? "final-map" : ""}`}>
      <svg
        viewBox="0 0 1230 715"
        role="img"
        aria-label="Карта четырёх памятников: Кермек, Денисова пещера, Костёнки, Сунгирь"
      >
        <defs>
          {points.map((p) => (
            <pattern
              key={p.id}
              id={`photo-${p.id}${suffix}`}
              width="1"
              height="1"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              <image
                href={p.image}
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          ))}
        </defs>
        <path className="land" d={path} />
        <path
          className="route"
          d={`M${points.map((p) => p.point.join(",")).join(" L")}`}
        />
        {points.map((p) => (
          <g key={p.id} className={`map-location location-${p.id}`}>
            <path className="leader" d={`M${p.point} l${p.dx},${p.dy}`} />
            <circle
              id={`marker-${p.id}${suffix}`}
              className="marker photo-marker"
              data-image={p.image}
              cx={p.point[0]}
              cy={p.point[1]}
              r="26"
              style={{ fill: `url(#photo-${p.id}${suffix})` }}
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
});
