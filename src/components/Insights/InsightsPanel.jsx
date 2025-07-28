import { Box, Typography, Divider } from "@mui/material";
import HeatMap        from "./HeatMap";        // TODO: implement
import BuySellPressureChart from "./BuySellPressureChart"; // TODO: implement

export default function InsightsPanel({ poolSlug }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", px: 5 }}>
      {/* Heat‑map */}
      <Box sx={{ flex: "0 0 65%", minHeight: 0 }}>
        <BuySellPressureChart poolSlug={poolSlug}/>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Buy / Sell pressure */}
      <Box sx={{ flex: "0 0 35%", minHeight: 0 }}>
        <HeatMap poolSlug={poolSlug} /> 
      </Box>
    </Box>
  );
}
