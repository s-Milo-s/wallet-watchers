// src/components/BuySellPressureChart.jsx
import React from "react";
import Plot from "react-plotly.js";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
const apiBase = import.meta.env.VITE_API_BASE;

const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export default function BuySellPressureChart({ poolSlug }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["pressure", poolSlug],                 // NEW v5 object form
    queryFn: () =>
      fetchJSON(
        `${apiBase}/api/pool-flow/pressure?pool=${encodeURIComponent(poolSlug)}`
      ),
    staleTime: 5 * 60 * 1000, // 5 min
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }
  if (error || !data) {
    return (
      <Box sx={{ color: "error.main", textAlign: "center", py: 4 }}>
        Error loading chart
      </Box>
    );
  }

  const { ts, pressure, volume } = data;

  return (
    <Plot
      data={[
        {
          x: ts,
          y: pressure,
          type: "scatter",
          mode: "lines",
          name: "Net flow ratio",
          line: { color: "#1e90ff", width: 2.5 },
          yaxis: "y1",
          hovertemplate: "%{y:.2f}<extra></extra>",
        },
        {
          x: ts,
          y: volume,
          type: "bar",
          name: "Volume (USD)",
          marker: { color: "rgba(200,200,200,0.35)" },
          yaxis: "y2",
          hovertemplate: "%{x|%Y‑%m‑%d %H:00}<br>"+
          "$%{y:,.0f}<extra></extra>",
        },
      ]}
      layout={{
        title: {
          text: `Buy / Sell Pressure & Volume (30 Days)`,
          x: 0.5,              // left‑align
          xanchor: "center",
          y: 0.95,
          font: { size: 18 },
        },
        autosize: true,
        margin: { t: 60, l: 60, r: 40, b: 60 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "#cbd5e1" },
        legend: {
          orientation: "h",
          y: 1.08,
          x: 1,
          xanchor: "right",
        },
        xaxis: { gridcolor: "#333" },
        yaxis: {
          title: "Net flow ratio",
          range: [-1, 1],
          zerolinecolor: "#666",
          gridcolor: "#333",
        },
        yaxis2: {
          title: "Volume (USD)",
          overlaying: "y",
          side: "right",
          rangemode: "tozero",
          showgrid: false,
        },
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%", height: "105%" }}
    />
  );
}
