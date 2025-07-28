// src/components/HeatMap.jsx
import React, { useMemo } from "react";
import Plot from "react-plotly.js";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
const apiBase = import.meta.env.VITE_API_BASE;

/* ---------- helpers -------------------------------------------------- */
const DAYS  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);          // 0‑23
const ODD_HOURS = HOURS.filter(h => h % 2 === 1);               // 1,3,5…

const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

function buildMatrix(rows) {
  // rows => [{dow, hr, vol_usd}]
  const mat = Array.from({ length: 7 }, () => Array(24).fill(0));
  rows.forEach(({ dow, hr, vol_usd }) => {
    mat[dow][hr] = vol_usd;
  });
  // order Monday‑Sunday (Postgres dow: 0=Sun)
  return [1,2,3,4,5,6,0].map((d) => mat[d]);
}

/* ---------- component ------------------------------------------------ */
export default function HeatMap({ poolSlug }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["heatmap", poolSlug],
    queryFn: () =>
      fetchJSON(
        `${apiBase}/api/pool-flow/heatmap?pool=${encodeURIComponent(poolSlug)}`
      ),
    staleTime: 5 * 60 * 1000,
  });

  const z = useMemo(() => (data ? buildMatrix(data) : []), [data]);

  if (isPending)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  if (error || !data)
    return (
      <Box sx={{ color: "error.main", textAlign: "center", py: 4 }}>
        Error loading heat‑map
      </Box>
    );

  return (
    <Plot
      data={[
        {
          z,
          x: HOURS,
          y: DAYS,
          type: "heatmap",
          colorscale: "Viridis",                         // 🎨 update palette here
          hovertemplate:
            "%{y} %{x}:00<br>Volume $%{z:,.0f}<extra></extra>",
        },
      ]}
      layout={{
        title: {
          text: `Hourly Volume Heat‑map (30 Days)`,
          x: 0.15,
          xanchor: "center",
          font: { size: 16 },
        },
        autosize: true,
     
        margin: { l: 70, r: 20, t: 60, b: 70 },
        xaxis: {
          title: "Hour (EST)",
          tickmode: "array",
          tickvals: ODD_HOURS,
          ticktext: ODD_HOURS.map(String),
        },
        yaxis: { autorange: "reversed" },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "#cbd5e1", size: 10 },
        showlegend: false,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
