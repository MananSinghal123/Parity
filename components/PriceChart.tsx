"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import {
  fetchInitialCandles,
  subscribeToCandles,
  Candle,
  Interval,
} from "@/lib/hyperliquid";
import { cn } from "@/lib/utils";

// Dynamically import ReactApexChart to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-[#0b1220] rounded-lg">
      <div className="animate-pulse text-text-secondary">Loading chart...</div>
    </div>
  ),
});

interface PriceChartProps {
  symbol: string;
}

// Available timeframes
const TIMEFRAMES: { label: string; value: Interval }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "1D", value: "1d" },
];

export function PriceChart({ symbol }: PriceChartProps) {
  const [mounted, setMounted] = useState(false);
  const [interval, setInterval] = useState<Interval>("1m");
  const [candleData, setCandleData] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live price tracking
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange24h, setPriceChange24h] = useState<number>(0);
  const [high24h, setHigh24h] = useState<number>(0);
  const [low24h, setLow24h] = useState<number>(0);
  const [volume24h, setVolume24h] = useState<number>(0);
  const [isLiveCandleUpdating, setIsLiveCandleUpdating] =
    useState<boolean>(false);
  const [lastPrice, setLastPrice] = useState<number>(0);
  const [priceDirection, setPriceDirection] = useState<
    "up" | "down" | "neutral"
  >("neutral");

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Load initial candle data
   */
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const candles = await fetchInitialCandles(symbol, interval, 100);
      if (candles.length > 0) {
        setCandleData(candles);

        // Calculate 24h stats from candle data
        const latestCandle = candles[candles.length - 1];
        const firstCandle = candles[0];

        setCurrentPrice(latestCandle.y[3]); // Close price

        // Calculate 24h high/low
        const high = Math.max(...candles.map((c) => c.y[1]));
        const low = Math.min(...candles.map((c) => c.y[2]));
        setHigh24h(high);
        setLow24h(low);

        // Calculate 24h change
        const priceChange =
          ((latestCandle.y[3] - firstCandle.y[0]) / firstCandle.y[0]) * 100;
        setPriceChange24h(priceChange);

        // Mock volume for now
        setVolume24h(Math.random() * 1000000 + 500000);
      } else {
        setError("No data available for this symbol");
      }
    } catch (err) {
      console.error("Error loading initial data:", err);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  /**
   * Subscribe to real-time candle updates
   */
  useEffect(() => {
    // Load initial data
    loadInitialData();

    // Subscribe to real-time updates with live candle formation
    const unsubscribe = subscribeToCandles(
      symbol,
      interval,
      (newCandle, isUpdate) => {
        setCandleData((prevData) => {
          // Flash indicator for live updates
          setIsLiveCandleUpdating(true);
          setTimeout(() => setIsLiveCandleUpdating(false), 300);

          // Check if this is an update to the last candle or a new candle
          const lastCandle = prevData[prevData.length - 1];

          if (lastCandle && lastCandle.x.getTime() === newCandle.x.getTime()) {
            // Update existing candle (live candle formation)
            const updatedData = [...prevData];
            updatedData[updatedData.length - 1] = newCandle;

            // Update live price and direction instantly
            setLastPrice(currentPrice);
            setCurrentPrice(newCandle.y[3]);

            // Determine price direction for visual feedback
            if (newCandle.y[3] > currentPrice) {
              setPriceDirection("up");
            } else if (newCandle.y[3] < currentPrice) {
              setPriceDirection("down");
            } else {
              setPriceDirection("neutral");
            }

            // Check if we hit new high/low
            if (newCandle.y[1] > high24h) setHigh24h(newCandle.y[1]);
            if (newCandle.y[2] < low24h) setLow24h(newCandle.y[2]);

            return updatedData;
          } else {
            // New candle (different timestamp)
            // Keep last 200 candles to avoid memory issues
            const updatedData = [...prevData, newCandle];

            // Update live price
            setCurrentPrice(newCandle.y[3]);

            // Recalculate 24h high/low
            const high = Math.max(...updatedData.map((c) => c.y[1]));
            const low = Math.min(...updatedData.map((c) => c.y[2]));
            setHigh24h(high);
            setLow24h(low);

            // Recalculate 24h change
            const firstCandle = updatedData[0];
            const priceChange =
              ((newCandle.y[3] - firstCandle.y[0]) / firstCandle.y[0]) * 100;
            setPriceChange24h(priceChange);

            return updatedData.slice(-200);
          }
        });
      },
    );

    // Cleanup subscription on unmount or interval change
    return () => {
      unsubscribe();
    };
  }, [symbol, interval, loadInitialData]);

  /**
   * Handle timeframe change
   */
  const handleIntervalChange = (newInterval: Interval) => {
    if (newInterval === interval) return;

    setInterval(newInterval);
    setCandleData([]); // Clear existing data
  };

  /**
   * ApexCharts configuration
   */
  const chartOptions: ApexOptions = {
    chart: {
      type: "candlestick",
      height: 450,
      background: "transparent",
      foreColor: "#848e9c",
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "zoom",
      },
      animations: {
        enabled: true,
        speed: 200,
        animateGradually: {
          enabled: true,
          delay: 50,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 150,
        },
      },
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
    },
    theme: {
      mode: "dark",
    },
    grid: {
      show: true,
      borderColor: "#1e2329",
      strokeDashArray: 3,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 20,
        bottom: 0,
        left: 10,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#848e9c",
          fontSize: "10px",
          fontWeight: 500,
        },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
          minute: "HH:mm",
        },
        datetimeUTC: false,
      },
      axisBorder: {
        show: true,
        color: "#2b3139",
        height: 1,
      },
      axisTicks: {
        show: true,
        color: "#2b3139",
        height: 4,
      },
      crosshairs: {
        show: true,
        stroke: {
          color: "#848e9c",
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      opposite: true,
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: "#848e9c",
          fontSize: "10px",
          fontWeight: 500,
        },
        formatter: (value) => {
          return `$${value.toFixed(2)}`;
        },
        offsetX: -10,
      },
      axisBorder: {
        show: true,
        color: "#2b3139",
      },
      crosshairs: {
        show: true,
        stroke: {
          color: "#848e9c",
          width: 1,
          dashArray: 3,
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#0ecb81", // Green for bullish candles
          downward: "#f6465d", // Red for bearish candles
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      shared: false,
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        if (!data) return "";

        const o = data.y[0];
        const h = data.y[1];
        const l = data.y[2];
        const c = data.y[3];
        const isGreen = c >= o;

        return `
          <div class="px-3 py-2 bg-[#1e2329] border border-[#2b3139] rounded-lg text-xs">
            <div class="font-semibold text-text-primary mb-2">
              ${new Date(data.x).toLocaleString()}
            </div>
            <div class="space-y-1">
              <div class="flex justify-between gap-4">
                <span class="text-text-tertiary">Open:</span>
                <span class="text-text-primary font-medium">$${o.toFixed(2)}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-text-tertiary">High:</span>
                <span class="text-success font-medium">$${h.toFixed(2)}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-text-tertiary">Low:</span>
                <span class="text-danger font-medium">$${l.toFixed(2)}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-text-tertiary">Close:</span>
                <span class="${isGreen ? "text-success" : "text-danger"} font-medium">$${c.toFixed(2)}</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: false,
    },
  };

  /**
   * Chart series data
   */
  const series = [
    {
      name: symbol,
      data: candleData,
    },
  ];

  // Prevent hydration mismatch - don't render until mounted
  if (!mounted) {
    return (
      <div className="bg-[#0b1220] rounded-lg border border-border overflow-hidden">
        <div className="bg-surface border-b border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-semibold text-text-tertiary">
                  {symbol}/USD
                </span>
                <span className="text-3xl font-bold text-text-primary">
                  Loading...
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-96 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2" />
            <div className="text-sm text-text-secondary">
              Initializing chart...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1220] rounded-lg border border-border overflow-hidden">
      {/* Live Price Header */}
      {mounted && !loading && candleData.length > 0 && (
        <div className="bg-surface border-b border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-semibold text-text-tertiary">
                  {symbol}/USD
                </span>
                <div className="relative flex items-center gap-2">
                  <span
                    className={cn(
                      "text-3xl font-bold transition-all duration-200",
                      isLiveCandleUpdating
                        ? priceDirection === "up"
                          ? "text-success"
                          : priceDirection === "down"
                            ? "text-danger"
                            : "text-text-primary"
                        : "text-text-primary",
                    )}
                    suppressHydrationWarning
                  >
                    $
                    {currentPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  {isLiveCandleUpdating && (
                    <div className="flex flex-col gap-0.5">
                      {priceDirection === "up" && (
                        <span className="text-success text-sm animate-bounce">
                          ▲
                        </span>
                      )}
                      {priceDirection === "down" && (
                        <span className="text-danger text-sm animate-bounce">
                          ▼
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-lg font-semibold flex items-center gap-1",
                    priceChange24h >= 0 ? "text-success" : "text-danger",
                  )}
                  suppressHydrationWarning
                >
                  {priceChange24h >= 0 ? "↗" : "↘"}
                  {priceChange24h >= 0 ? "+" : ""}
                  {priceChange24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
                <div>
                  <span className="mr-1">24h High:</span>
                  <span
                    className="text-text-secondary font-medium"
                    suppressHydrationWarning
                  >
                    ${high24h.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="mr-1">24h Low:</span>
                  <span
                    className="text-text-secondary font-medium"
                    suppressHydrationWarning
                  >
                    ${low24h.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="mr-1">24h Volume:</span>
                  <span
                    className="text-text-secondary font-medium"
                    suppressHydrationWarning
                  >
                    ${(volume24h / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => handleIntervalChange(tf.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded transition-colors",
                    interval === tf.value
                      ? "bg-primary text-background"
                      : "bg-surface-light text-text-secondary hover:text-text-primary hover:bg-surface",
                  )}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart Display */}
      {loading && (
        <div className="h-96 flex items-center justify-center rounded-lg bg-surface">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2" />
            <div className="text-sm text-text-secondary">
              Loading {symbol} chart...
            </div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="h-96 flex items-center justify-center rounded-lg bg-surface">
          <div className="text-center">
            <div className="text-danger mb-2">⚠️</div>
            <div className="text-sm text-text-secondary">{error}</div>
            <button
              onClick={loadInitialData}
              className="mt-4 px-4 py-2 bg-primary text-background text-xs rounded hover:bg-primary-dark transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && candleData.length > 0 && (
        <div className="p-4">
          <Chart
            options={chartOptions}
            series={series}
            type="candlestick"
            height={450}
          />
        </div>
      )}

      {!loading && !error && candleData.length === 0 && (
        <div className="h-96 flex items-center justify-center rounded-lg bg-surface">
          <div className="text-center">
            <div className="text-text-tertiary mb-2">📊</div>
            <div className="text-sm text-text-secondary">
              No chart data available
            </div>
          </div>
        </div>
      )}

      {/* Chart Info Footer */}
      {!loading && candleData.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-text-tertiary">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  isLiveCandleUpdating
                    ? "bg-primary animate-ping"
                    : "bg-success animate-pulse",
                )}
              />
              <span className="font-medium">
                {isLiveCandleUpdating ? "Updating..." : "Live Streaming"}
              </span>
            </div>
            <span>•</span>
            <span>Powered by Hyperliquid</span>
            <span>•</span>
            <span className="text-text-secondary">{interval} candles</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-success rounded-sm" />
              <span className="text-text-tertiary">Bullish</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-danger rounded-sm" />
              <span className="text-text-tertiary">Bearish</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
