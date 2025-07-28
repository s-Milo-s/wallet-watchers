import { Box, Typography, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon  from "@mui/icons-material/ChevronLeft";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { useQuery } from "@tanstack/react-query";
const apiBase = import.meta.env.VITE_API_BASE;

// ------------------------------------------------------------------
// Hook – fetch ingest stats
// ------------------------------------------------------------------
function usePoolStats(poolSlug) {
  return useQuery({
    queryKey: ["poolStats", poolSlug],
    queryFn: async () => {
      const res = await fetch(`${apiBase}/api/ingest-stats/${poolSlug}`);
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
    staleTime: 60_000,
    enabled: !!poolSlug,
  });
}

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(n % 1_000 ? 1 : 0) + "k";
  return n.toString();
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function PoolStatsHeader({
  currentPool,
  showInsights,
  onToggle,
}) {
  const { data = {}, isLoading } = usePoolStats(currentPool.poolSlug);

  const logsPerSecond = data.logs_per_second ?? 0;
  const totalRows     = data.total_logs      ?? 0;
  const lastUpdated   = data.timestamp ? new Date(data.timestamp) : new Date();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 1.5,
        py: 1,
      }}
    >
      {/* Pool name (left) */}
      <Typography sx={{ color: "grey.500", flexShrink: 0, mr: 1 }}>
        {currentPool.name}
      </Typography>

      {/* Stats block (flex-grow) */}
      <Box sx={{ textAlign: "right", lineHeight: 1.2, flexGrow: 1 }}>
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

      {/* Arrow (far right) */}
      <IconButton onClick={onToggle} size="small" sx={{ ml: 1 }}>
        {showInsights ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
}
