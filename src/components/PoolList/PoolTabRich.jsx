// PoolTabRich.jsx
import { ListItemButton, ListItemText, Typography, Box } from "@mui/material";

export default function PoolTabRich({ pool, selected, onClick }) {
  const [chain, dex, pair] = pool.name.split(" - ");

  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        mb: 0.5,
        borderRadius: 1,
        alignItems: "flex-start",
        minHeight: 48,                 // ← fixed row height
        overflow: "hidden",            // ← clip text, don’t grow
      }}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography
            sx={{
              fontSize: 13,
              opacity: 0.8,
              whiteSpace: "nowrap",    // ← never wraps
              overflow: "hidden",      // ← just clip
              textOverflow: "ellipsis",
            }}
          >
            {chain} · {dex}
          </Typography>
        }
        secondary={
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: 14,
                whiteSpace: "nowrap",  // ← no wrap here either
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {pair}
            </Typography>
          </Box>
        }
      />
    </ListItemButton>
  );
}
