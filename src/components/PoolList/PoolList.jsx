// PoolsList.jsx
import React, { useState } from "react";
import { Box, List, Typography } from "@mui/material";
import raw from "../../resources/pools.json";
import PoolTabRich from "./PoolTabRich";           // ← import the rich tab

export default function PoolsList({ value, onUpdate }) {
    
  /* turn JSON into an array with 1-based id */
    const pools = raw.data.map((p, idx) => ({
        id:   idx + 1,
        slug: p.pool_slug,
        name: p.name,
    }));

    const [selectedId, setSelectedId] = useState(pools[0]?.id ?? null);
    // const handlePoolchange = (slug,id) => {
    //     onUpdate(slug);
    //     setSelectedId(pool.id)
    // };


  return (
    <Box sx={{ px: 1, height: "100%", overflowY: "auto" }}>
      <Typography sx={{ px: 1.5, py: 1, color: "grey.500" }}>
        Pools
      </Typography>

      <List dense disablePadding>
        {pools.map((pool) => (
          <PoolTabRich
            key={pool.id}
            pool={pool}
            selected={pool.id === selectedId}
            onClick={() => setSelectedId(pool.id)}
          />
        ))}
      </List>
    </Box>
  );
}
