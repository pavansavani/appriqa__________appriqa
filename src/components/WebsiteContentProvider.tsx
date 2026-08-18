"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WebsiteContentContextType {
  contentMap: Record<string, any>;
  isEditing: boolean;
  updateLocalContent: (key: string, value: string, mediaUrl?: string) => void;
}

const WebsiteContentContext = createContext<WebsiteContentContextType>({
  contentMap: {},
  isEditing: false,
  updateLocalContent: () => {}
});

export const useWebsiteContent = () => useContext(WebsiteContentContext);

export function WebsiteContentProvider({ 
  children, 
  initialContent = {} 
}: { 
  children: React.ReactNode;
  initialContent?: Record<string, any>;
}) {
  const [contentMap, setContentMap] = useState<Record<string, any>>(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if we are loaded in the admin iframe editor
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("mode") === "edit") {
      setIsEditing(true);
    }

    // Listen for messages from the parent Admin Editor
    const handleMessage = (event: MessageEvent) => {
      // In a real app, verify event.origin
      if (event.data?.type === "UPDATE_PREVIEW") {
        setContentMap(prev => ({
          ...prev,
          [event.data.key]: {
            ...prev[event.data.key],
            content_value: event.data.value,
            media_url: event.data.mediaUrl
          }
        }));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const updateLocalContent = (key: string, value: string, mediaUrl?: string) => {
    setContentMap(prev => ({
      ...prev,
      [key]: { ...prev[key], content_value: value, media_url: mediaUrl }
    }));
  };

  return (
    <WebsiteContentContext.Provider value={{ contentMap, isEditing, updateLocalContent }}>
      {children}
    </WebsiteContentContext.Provider>
  );
}
