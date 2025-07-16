import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import Plot from 'react-plotly.js';
import { useQuery } from '@tanstack/react-query';

// ------------------------------------------------------------------
// Hook – fetch wallet‑metrics JSON
// ------------------------------------------------------------------
function useWalletMetrics(poolSlug) {
  return useQuery({
    queryKey: ['walletMetrics', poolSlug],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:4000/api/wallet-metrics/${poolSlug}`
      );
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
    staleTime: 60_000,
  });
}

// ------------------------------------------------------------------
// BubbleChart component
// ------------------------------------------------------------------
export default function BubbleChart({ poolSlug = 'arbitrum_uniswap_v3_wethusdc' }) {
  const { data = [], isLoading, error } = useWalletMetrics(poolSlug);

  if (isLoading)
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={32} />
      </Box>
    );
  if (error)
    return <Box sx={{ color: 'error.main', p: 2 }}>Failed to load</Box>;

  // ----------------------------------------------------------------
  // Build Plotly traces
  // ----------------------------------------------------------------
  const turnover = data.map((r) => r.turnover);
  const netBias = data.map((r) => r.net_bias);
  const trades = data.map((r) => r.trades);
  const bubbleSize = data.map((r) => r.bubble_size);
  const colorVal = data.map((r) => r.color_val);
  const avgTrade = data.map((r) => r.avg_trade_usd);

  // Colour‑bar ticks: powers of 10 up to max(color_val)
  const maxColor = Math.max(...colorVal);
  const tickVals = Array.from({ length: maxColor + 1 }, (_, i) => i);
  const tickText = tickVals.map((v) => (10 ** v).toLocaleString());
  const blueTealGreen = [
  [0.0,  '#0a1a3d'],  // navy
  [0.1,  '#102b63'],
  [0.2,  '#173e8c'],
  [0.3,  '#1e52b5'],
  [0.4,  '#2364cc'],
  [0.5,  '#2a7ede'],  // vivid blue
  [0.6,  '#2f92e6'],
  [0.7,  '#38a6dc'],
  [0.8,  '#3fbacb'],
  [0.9,  '#46cfa9'],
  [1.0,  '#4ae18a'],  // sea-green
];
  const plotData = [
    {
      x: turnover,
      y: netBias,
      mode: 'markers',
      type: 'scatter',
      text: data.map((r) => r.wallet.slice(0, 6) + '…'),
      customdata: trades.map((t, idx) => [t, avgTrade[idx]]),
      marker: {
        size: bubbleSize,
        sizemode: 'area',
        sizeref:
          2.0 * Math.max(...bubbleSize) / 50 ** 2 || 1, // prevent 0 div
        color: colorVal,
        colorscale: blueTealGreen,
        showscale: true,
        opacity: 0.5,
        colorbar: {
          title: { 
            text: 'Trades',
            side: 'top', 
            pad: { b: 20 } 
          },
          tickmode: 'array',
          tickvals: tickVals,
          ticktext: tickText,
        },
      },
      hovertemplate:
        '<b>%{text}</b><br>' +
        'Wallet Turnover (USD): %{x:$,.0f}<br>' +
        'Net Buy/Sell: %{y:.2f}<br>' +
        'Trades: %{customdata[0]:,d}<br>' +
        'Avg Trade Size: %{customdata[1]:$,.0f}<extra></extra>',
    },
  ];
  const softWhite = '#e0e0e0';
  const layout = {
    font: { color: softWhite },
      template: 'plotly_dark',
     title: {
      text: 'Wallet Profiler (Prev 180 Days) — Size = Avg Trade Size, Colour = Number of Trades',
      y: 0.96,          // nudge title down a hair
      pad: { t: 10 },   // 10-px gap above it
    },
    margin: { l: 60, r: 40, t: 80, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    xaxis: {
      type: 'log',
      title: { text: 'Wallet Turnover (USD)', standoff: 8 },
      automargin: true,

      // one major tick per power-of-ten and $-prefixed SI labels (10k, 100k, 1M…)
      dtick: 1,                 // 10^1, 10^2, 10^3 … along the log axis
      tickformat: '$~s',        // $10k, $100k, $1M … (uses SI prefixes)
      ticklabelposition: 'outside',
  },
    yaxis: {
      title: { text: 'Net Buy (1) / Sell (-1)', standoff: 8 },
      automargin: true,
    }
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, width: '100%', height: '100%', display: 'flex' }}>
      <Plot
        data={plotData}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
        config={{ displayModeBar: false }}
      />
    </Box>
  );
}
