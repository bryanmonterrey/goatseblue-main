import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';

export default function JupiterTerminal() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const terminalId = 'jupiter-terminal';

  const initJupiter = useCallback(() => {
    if (typeof window === 'undefined') return false;

    console.log("Attempt", initAttempts + 1, "to initialize Jupiter");
    console.log("Window.Jupiter status:", !!window.Jupiter);
    
    const terminalElement = document.getElementById(terminalId);
    console.log("Terminal element status:", !!terminalElement);

    if (!window.Jupiter || !terminalElement) {
      console.log("Jupiter or terminal element not ready");
      return false;
    }

    try {
      console.log("Attempting Jupiter initialization...");
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: terminalId,
        endpoint: "https://mainnet.helius-rpc.com/?api-key=f09cbd78-a0f7-4b52-983c-71880b01240b",
        strictTokenList: false,
        formProps: {
          fixedOutputMint: true,
          initialAmount: "",
          initialInputMint: "So11111111111111111111111111111111111111112",
          initialOutputMint: "9kG8CWxdNeZzg8PLHTaFYmH6ihD1JMegRE1y6G8Dpump",
        },
        platformFeeAndAccounts: {
          feeBps: 100,
          feeAccounts: ["5N2GNUGbNVMD4u297wwTpRWctzWfecjaS5XE7ALnsxwj"],
        },
      });
      console.log("Jupiter initialized successfully");
      return true;
    } catch (error) {
      console.error("Error during Jupiter initialization:", error);
      return false;
    }
  }, [initAttempts]);

  useEffect(() => {
    if (!scriptLoaded) return;

    // Try to initialize immediately
    if (!initJupiter()) {
      console.log("Initial initialization failed, starting retry interval...");
      
      const intervalId = setInterval(() => {
        setInitAttempts(prev => prev + 1);
        if (initJupiter()) {
          console.log("Initialization succeeded on retry");
          clearInterval(intervalId);
        }
      }, 1000);

      // Clean up after 20 seconds
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        console.error("Failed to initialize Jupiter after 20 seconds");
      }, 20000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [scriptLoaded, initJupiter]);

  // Render verification
  useEffect(() => {
    console.log("Component rendered. Terminal ID:", terminalId);
  }, []);

  return (
    <div className="relative w-full">
      <Script 
        src="https://terminal.jup.ag/main-v3.js" 
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Jupiter script loaded, waiting 1 second before initialization...');
          // Add a small delay after script load
          setTimeout(() => {
            setScriptLoaded(true);
          }, 1000);
        }}
        onError={(e) => {
          console.error("Failed to load Jupiter script:", e);
        }}
      />
      <div 
        id={terminalId} 
        className="jupiter-terminal mx-auto"
        style={{
          minHeight: '400px',
          width: '350px',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}