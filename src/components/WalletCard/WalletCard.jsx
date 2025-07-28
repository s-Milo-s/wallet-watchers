import { Card, Box, Divider, Slide } from "@mui/material";
import { useState } from "react";
import BubbleChart from "./BubbleChart";
import TopWallets  from "./TopWallets";
import PoolStatsHeader from "./PoolStatsHeader";
import InsightsPanel   from "../Insights/InsightsPanel";

export default function WalletCard({ currentPool }) {
  const [showInsights, setShowInsights] = useState(false);

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        border: "0px solid #444c52",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        p: 1,
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Header with toggle arrow */}
      <PoolStatsHeader
        currentPool={currentPool}
        showInsights={showInsights}
        onToggle={() => setShowInsights((v) => !v)}
      />
      <Divider />

      {/* MAIN BODY – slide between two views */}
      <Box sx={{ position: "relative", flexGrow: 1, minHeight: 0 }}>
        {/* Wallet metrics view */}
        <Slide direction="right" in={!showInsights} mountOnEnter unmountOnExit>
          <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
            <Box sx={{ flex: "0 0 70%", minHeight: 0, px: 5 }}>
              <BubbleChart poolSlug={currentPool.poolSlug} />
            </Box>
             <Divider sx={{ my: 2 }} />
            <Box sx={{ flex: "0 0 30%", minHeight: 0, px: 5 }}>
              <TopWallets poolSlug={currentPool.poolSlug} />
            </Box>
          </Box>
        </Slide>

        {/* Insights view */}
        <Slide direction="left" in={showInsights} mountOnEnter unmountOnExit>
          <Box sx={{ position: "absolute", inset: 0 }}>
            <InsightsPanel poolSlug={currentPool.poolSlug} />
          </Box>
        </Slide>
      </Box>
    </Card>
  );
}
