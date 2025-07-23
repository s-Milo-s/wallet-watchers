// PoolsList.jsx
import React, { useState } from "react";
import { Box, List, Typography } from "@mui/material";
import PoolTabRich from "./PoolTabRich";           // ← import the rich tab

export default function PoolsList({ poolList, onUpdate }) {
    
    const [selectedId, setSelectedId] = useState(1);
    const handlePoolchange = (id) => {
        setSelectedId(id)
        onUpdate(poolList[id-1]);
    };


  return (
    <Box sx={{ px: 1, height: "100%", overflowY: "auto" }}>
      <Typography sx={{ px: 1.5, py: 1, color: "grey.500" }}>
        Pools
      </Typography>

      <List dense disablePadding>
        {poolList.map((pool) => (
          <PoolTabRich
            key={pool.id}
            pool={pool}
            selected={pool.id === selectedId}
            onClick={() => handlePoolchange(pool.id)}
          />
        ))}
      </List>
    </Box>
  );
}
