import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useState } from "react";
import { countryCoordinates } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProgramAccount } from "@coral-xyz/anchor";
import type { Provider } from "@/lib/types";

interface Props {
  providers: ProgramAccount<Provider>[];
  hoveredCountry: string | null;
  setHoveredCountry: (country: string | null) => void;
  onSelect: (provider: Provider) => void;
}

export const ProvidersMap = ({
  providers,
  hoveredCountry,
  setHoveredCountry,
  onSelect,
}: Props) => {
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(1);

  return (
    <ComposableMap width={1000} height={600}>
      <ZoomableGroup
        center={center}
        zoom={zoom}
        onMoveEnd={({ coordinates, zoom }) => {
          setCenter(coordinates);
          setZoom(zoom);
        }}
      >
        <Geographies geography="/geography.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "#212121",
                    stroke: "#09090b",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  hover: {
                    fill: "#212121",
                    stroke: "#09090b",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  pressed: {
                    fill: "#212121",
                    stroke: "#09090b",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                }}
                onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                onClick={() => {
                  const match = providers.find(
                    (p) => p.account.country === geo.properties.name,
                  );
                  if (match) onSelect(match.account);
                }}
              />
            ))
          }
        </Geographies>

        {providers.map((provider) => {
          const coords = countryCoordinates[provider.account.country];
          if (!coords) return null;
          const isHovered = hoveredCountry === provider.account.country;

          return (
            <Tooltip key={provider.account.ip} open={isHovered}>
              <TooltipTrigger asChild>
                <Marker
                  coordinates={coords}
                  onMouseEnter={() =>
                    setHoveredCountry(provider.account.country)
                  }
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => onSelect(provider.account)}
                >
                  <circle
                    className={`marker 
                      ${provider.account.availability ? "available" : "unavailable"} 
                      ${isHovered ? "hovered" : ""}
                    `}
                    r={5 / zoom}
                    style={{
                      strokeWidth: `${2 / zoom}`,
                    }}
                  />
                </Marker>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                {Object.entries(provider.account).map(([key, value]) => (
                  <div key={key}>
                    <b>{key}: </b>
                    {String(value)}
                    <br />
                  </div>
                ))}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
};
