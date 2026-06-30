"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

export default function TrackOrder() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [status, setStatus] = useState<string>("Pending");
  const [connectionStatus, setConnectionStatus] = useState<string>(
    "Connecting to kitchen...",
  );

  useEffect(() => {
    // 1. Establish connection to our backend WebSocket server
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setConnectionStatus("Connected to Live Tracking System 🟢");

      // 2. Join the dedicated room for this specific order ID
      socket.emit("joinOrderRoom", orderId);
    });

    // 3. Listen for real-time status broadcasts from our backend controller
    socket.on("orderStatusUpdated", (data: { status: string }) => {
      console.log("Status update received via Socket:", data.status);
      setStatus(data.status);
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected from kitchen 🔴");
    });

    // Clean up connection when the user leaves the page
    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  // Helper styling function to highlight the active milestone stage
  const getStepClass = (currentStage: string, targetStage: string) => {
    if (currentStage === targetStage)
      return "bg-orange-600 text-white font-bold scale-105 shadow-md";
    return "bg-gray-200 text-gray-500";
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8 text-center">
        <span className="text-xs text-gray-400 block mb-1 uppercase font-semibold tracking-wider">
          Live Tracker
        </span>
        <h1 className="text-3xl font-black text-gray-900 mb-2">{orderId}</h1>
        <p className="text-sm text-gray-500 mb-6">{connectionStatus}</p>

        {/* Current Live Status Box */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8">
          <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">
            Current Status
          </p>
          <p className="text-2xl font-extrabold text-orange-900 mt-1 animate-bounce">
            {status}
          </p>
        </div>

        {/* Visual Progress Steps Layout */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${getStepClass(status, "Pending")}`}
            >
              1
            </div>
            <p
              className={`text-sm ${status === "Pending" ? "font-bold text-gray-900" : "text-gray-400"}`}
            >
              Order Received by Kitchen
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${getStepClass(status, "Preparing")}`}
            >
              2
            </div>
            <p
              className={`text-sm ${status === "Preparing" ? "font-bold text-gray-900" : "text-gray-400"}`}
            >
              Chef is Cooking Your Meal
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${getStepClass(status, "Ready")}`}
            >
              3
            </div>
            <p
              className={`text-sm ${status === "Ready" ? "font-bold text-gray-900" : "text-gray-400"}`}
            >
              Food is Packaged & Ready for Dispatch
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
