import {
  Box,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function WalletRow({ row, rank, maxVol }) {
    const pct = row ? Math.sqrt(row.turnover_24h / maxVol) * 100 : 0;
    const volLabel = row ? `$${row.turnover_24h.toLocaleString()}` : "";
    const blueTealGreenGradient =
        "linear-gradient(90deg,\
    #0a1a3d 0%,  #102b63 10%,\
    #173e8c 20%, #1e52b5 30%,\
    #2364cc 40%, #2a7ede 50%,\
    #2f92e6 60%, #38a6dc 70%,\
    #3fbacb 80%, #46cfa9 90%,\
    #4ae18a 100%)";
    /* tooltips render even if empty strings—hook order stays */
    return (
        <>
        <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: 1,                // space between the four chunks
      }}
    >
        <Box sx={{ width: 20, textAlign: "right", pr: 1, opacity: 0.7 }}>
            {rank}.
        </Box>

        <Tooltip title={row ? row.wallet : ""} arrow>
            <Box
            sx={{
                flexBasis: "40%",
                fontFamily: "monospace",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: row ? "help" : "default",
                opacity: row ? 1 : 0,
            }}
            >
            {row ? `${row.wallet.slice(0, 15)}…` : "placeholder"}
            </Box>
        </Tooltip>

        <Tooltip title={volLabel} arrow>
            <Box
            sx={{
                flexBasis: "30%",
                mx: 1,
                height: 6,
                position: "relative",
                borderRadius: 1,
                background: blueTealGreenGradient,
                overflow: "hidden",
                cursor: row ? "help" : "default",
                opacity: row ? 1 : 0,
            }}
            >
            <Box
                sx={{
                position: "absolute",
                left: `${pct}%`,
                right: 0,
                top: 0,
                bottom: 0,
                bgcolor: "grey.800",
                }}
            />
            </Box>
        </Tooltip>

        <Box
            sx={{
            flexBasis: "20%",
            textAlign: "right",
            opacity: row ? 0.7 : 0,
            whiteSpace: "nowrap",
            minWidth: 70,
            }}
        >
            {row ? `${dayjs(row.last_trade).fromNow(true)} ago` : ""}
        </Box>
        </Box>
        </>
    );
}
