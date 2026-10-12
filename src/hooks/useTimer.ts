"use client";

import React, { useState, useEffect } from "react";

export function useTimer(
  initialSeconds: number,
  isRunning: boolean,
  onExpire?: () => void
) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onExpire]);

  const formatTime = () => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return { secondsLeft, formatTime, setSecondsLeft };
}
