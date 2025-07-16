import { Card, Box } from "@mui/material";
import BubbleChart from "./BubbleChart";
import TopWallets from "./TopWallets";

export default function WalletCard() {
  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        border: "1px solid #444c52",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        p: 1,
        gap: 0,
      }}
    >
      {/* Bubble chart – fixed 75 % of card height */}
      <Box sx={{ flex: "0 0 70%", minHeight: 0, display: "flex"}}>
        <BubbleChart />
      </Box>

      {/* Top wallets – fixed 25 % of card height */}
      <Box
        sx={{
          flex: "0 0 30%",   // 25 % height, scrolls inside
          minHeight: 0,
          display: "flex",
        }}
      >
        <TopWallets />
      </Box>
    </Card>
  );
}
