"use client";

import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const ScrollingTicker = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BSE:SENSEX", title: "SENSEX" },
        { proName: "BSE:RELIANCE", title: "RELIANCE" },
        { proName: "BSE:TCS", title: "TCS" },
        { proName: "BSE:HDFCBANK", title: "HDFC BANK" },
        { proName: "BSE:INFY", title: "INFOSYS" },
        { proName: "BSE:ITC", title: "ITC" },
        { proName: "BSE:BHARTIARTL", title: "BHARTI AIRTEL" },
        { proName: "BSE:LT", title: "L&T" },
        { proName: "BSE:MARUTI", title: "MARUTI" },
        { proName: "BSE:ULTRACEMCO", title: "ULTRATECH" },
        // { proName: "FOREXCOM:USDINR", title: "USD/INR" },
        { proName: "FOREXCOM:DJI", title: "DOW JONES" },
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
      ],
      colorTheme: isDark ? "dark" : "light",
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      displayMode: "regular",
    });

    const container = document.getElementById("tradingview-ticker");
    if (container) {
      // Clear existing scripts
      const existingScript = container.querySelector("script");
      if (existingScript) {
        existingScript.remove();
      }
      container.appendChild(script);
    }

    return () => {
      const existingScript = document
        .getElementById("tradingview-ticker")
        ?.querySelector("script");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [isDark]);

  return (
    <div className="w-full  min-h-max border-b border-border">
      <div id="tradingview-ticker" className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

export default ScrollingTicker;
