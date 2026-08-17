"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Context, sdk } from "@farcaster/miniapp-sdk";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { preloadAssets } from "~/utils/optimizations";

const Demo = dynamic(() => import("../components/Demo"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-white rounded-full animate-spin mb-4" />
      <p className="text-white text-xl">Loading POD Play...</p>
    </div>
  ),
});

// Ensure Demo is only rendered once
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [frameContext, setFrameContext] = useState<Context.MiniAppContext | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);
  
  useEffect(() => {
    setIsMounted(true);
    preloadAssets();
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;

    const loadContext = async () => {
      try {
        // Initialize SDK
        await sdk.actions.ready();
        
        try {
          // Attempt to get the real context
          const context = await sdk.context;
          
          if (isMounted) {
            console.log('MiniApp context loaded successfully:', context);
            setFrameContext(context);
          }
        } catch (contextError) {
          console.warn('Error loading miniapp context, using fallback:', contextError);
          
          if (isMounted) {
            console.log('Using null miniapp context');
          }
        }
      } catch (error) {
        console.error('Fatal error loading miniapp context:', error);
      }
    };

    loadContext();
  }, [isMounted]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading POD Play...</div>}>
        <Demo frameContext={frameContext} />
      </Suspense>
    </ErrorBoundary>
  );
}