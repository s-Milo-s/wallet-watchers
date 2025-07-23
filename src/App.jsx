import React, { useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  Drawer,
  Box,
  IconButton,
  Divider
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon  from "@mui/icons-material/KeyboardDoubleArrowLeft";

import WalletCard from "./components/WalletCard/WalletCard";
import PoolsList  from "./components/PoolList/PoolList";
import raw from "./resources/pools.json";
const drawerWidthOpen   = 240;
const drawerWidthClosed = 72;   // just wide enough for the icon

/* -------- dark theme (unchanged) -------- */
const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0f1115", paper: "#0f1115" },
    primary:   { main: "#111214" },
  },
});

export default function App() {

  const pools = raw.data.map((p, idx) => ({
        id:   idx + 1,
        ...p
  }));

  console.log(pools)
  const [open, setOpen] = useState(true);
  const [currentPool, setCurrentPool] = useState({
        "poolSlug":"arbitrum_uniswap_v3_wethusdc",
        "name": "Arbitrum - Uniswap - WETH/USDC",
        "chain":"Arbitrum", 
        "DEX": "Uniswap",
        "pair": "WETH/USDC"
        });

  const toggleDrawer = () => setOpen((o) => !o);
  const drawerWidth  = open ? drawerWidthOpen : drawerWidthClosed;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ------------- SIDEBAR ------------- */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1a1a1a",
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            height: 56,           // same as default MUI toolbar height
          }}
        >
          {open && (
            <Typography variant="subtitle1" noWrap>
              Wallet Watchers
            </Typography>

          )}
          <IconButton
          onClick={toggleDrawer}
          // disableFocusRipple   // ⟵ no focus ring
          disableRipple        // ⟵ no ripple
         sx={{
            color: "grey.300",
            transform: open ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s",
            ml: "auto",
            "&:focus": { outline: "none" },  
          }}
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        </Box>

        {/* List only when expanded */}
                {/* ← always render; let width & opacity animate */}
       <Box
          sx={{
           overflow: "hidden",
            transition: "max-width 0.2s, opacity 0.2s",
            maxWidth: open ? drawerWidthOpen : 0,
            opacity:  open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",   // disable clicks when closed
          }}
        >
          <PoolsList poolList = {pools} onUpdate={setCurrentPool} />
       </Box>
      </Drawer>

      {/* ------------- MAIN ------------- */}
      <Box
        component="main"
        sx={{
          ml: `${drawerWidth}px`,
          width: `calc(100vw - ${drawerWidth}px)`,
          p: 0,
          mt: 0,                       /* space below drawer header */
          height: "calc(100vh)",/* 56 = drawer header height */
          transition: "margin-left 0.2s, width 0.2s",
        }}
      >
        <WalletCard currentPool={currentPool}/>
      </Box>
    </ThemeProvider>
  );
}
