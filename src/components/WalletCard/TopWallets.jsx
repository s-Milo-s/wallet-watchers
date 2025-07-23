import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import WalletRow from "./WalleRow";
const apiBase = import.meta.env.VITE_API_BASE;

/* -------- data fetch helper -------- */
const useTopWallets = (pool) =>
  useQuery({
    queryKey: ["topWallets", pool],
    queryFn: async () => {
      const r = await fetch(`${apiBase}/api/top-wallets/${pool}`);
      if (!r.ok) throw new Error("network");
      return r.json();
    },
    staleTime: 60_000,
  });

/* -------- component -------- */
export default function TopWallets({
  poolSlug   = "arbitrum_uniswap_v3_wethusdc",
  maxShown   = 20,          // render at most 20 rows; extras ignored
  maxHeight  = 170,         // px – keep under the chart
}) {
  const { data: wallets = [], isLoading, error } = useTopWallets(poolSlug);

  /* loading / error / empty */
  if (isLoading)
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  if (error)
    return <Box sx={{ p: 2, color: "error.main" }}>Failed to load wallets</Box>;
  if (!wallets.length)
    return <Box sx={{ p: 2, opacity: 0.6 }}>No active wallets today.</Box>;

  /* slice to a sane upper-bound; any further trimming is done by CSS overflow */
  const visible = wallets.slice(0, maxShown);
  const maxVol  =
    visible.reduce((m, w) => Math.max(m, w.turnover_24h ?? 0), 1) || 1;

  return (
    <Box sx={{ flexGrow: 1, px: 3, pb: 4, color: "grey.200" }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Most Active Today — 24 h Volume
      </Typography>

      <Box
        sx={{
          /* 1 column on mobile, 2 columns ≥ md */
          columnCount: { xs: 1, md: 2 },
          columnGap:   2,
          maxHeight,                 // don’t eat into the chart
          overflow:   "hidden",      // quietly clip anything that can’t fit
        }}
      >
        {visible.map((row, idx) => (
          <Box
            key={row.wallet || idx}
            sx={{
              /* each row must be a “column-box” participant */
              display: "block",
              breakInside: "avoid",   // keep a row from splitting across pages
              p: 0.75,
              borderRadius: 1,
              fontSize: 14,
              bgcolor: idx % 2 ? "rgba(255,255,255,0.02)" : "transparent",
              mb: 1,                  // vertical gap between rows
            }}
          >
            <WalletRow row={row} rank={idx + 1} maxVol={maxVol} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
