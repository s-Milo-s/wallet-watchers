import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useQuery } from "@tanstack/react-query";
const apiBase = import.meta.env.VITE_API_BASE;

function usePoolStats(poolSlug) {
  return useQuery({
    queryKey: ["poolStats", poolSlug],
    queryFn: async () => {
      const res = await fetch(`${apiBase}/api/ingest-stats/${poolSlug}`);
      if (!res.ok) throw new Error("Network error");
      return res.json();                         // { timestamp, logs_per_second, total_logs, ... }
    },
    staleTime: 60_000,                           // 1 min cache
    enabled: !!poolSlug,
  });
}

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(n % 1_000 ? 1 : 0) + "k";
  return n.toString();
}

export default function PoolStatsHeader({
  currentPool
}) {
    const { data = {}, isLoading } = usePoolStats(currentPool.poolSlug);
    const logsPerSecond = data.logs_per_second ?? 0;
    const totalRows     = data.total_logs      ?? 0;
    const lastUpdated   = data.timestamp       ? new Date(data.timestamp) : new Date();
  return (
    
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        px: 1.5,
        py: 1,
      }}
    >
      <Typography sx={{ color: "grey.500" , alignSelf: "center"}}>{currentPool.name}</Typography>

      <Box sx={{ textAlign: "right", lineHeight: 1.2 }}>
        <Typography variant="caption" color="grey.500" display="block">
          Last updated:&nbsp;
          {isLoading ? "…" : dayjs(lastUpdated).fromNow()}
        </Typography>
        <Typography variant="caption" color="grey.500">
            {isLoading
            ? "…"
            : `${fmt(logsPerSecond)} logs/s • ${fmt(totalRows)} total`}
        </Typography>
      </Box>
    </Box>
  );
}
