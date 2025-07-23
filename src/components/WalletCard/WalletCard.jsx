import { Card, Box ,Typography} from "@mui/material";
import BubbleChart from "./BubbleChart";
import TopWallets from "./TopWallets";
import Divider from '@mui/material/Divider';
import PoolStatsHeader from "./PoolStatsHeader";

export default function WalletCard({currentPool}) {
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
      }}
    >
      {/* Bubble chart – fixed 75 % of card height */}
      <Box>
        <PoolStatsHeader                       // NEW component in place of old header
          currentPool={currentPool}          // pass current pool data
        />
        <Divider/>
      </Box>
      <Box sx={{ 
        flex: "0 0 70%", 
        minHeight: 0, 
        display: "flex",
        px: 5,
        }}>
        <BubbleChart poolSlug={currentPool.poolSlug}/>
      </Box>

      {/* Top wallets – fixed 25 % of card height */}
      <Box
        sx={{
          flex: "0 0 30%",   // 25 % height, scrolls inside
          minHeight: 0,
          display: "flex",
          px: 5,
        }}
      >
        <TopWallets poolSlug={currentPool.poolSlug}/>
      </Box>
    </Card>
  );
}
