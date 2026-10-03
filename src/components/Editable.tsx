"use client";

import React, { useState } from "react";
import { useWebsiteContent } from "./WebsiteContentProvider";

interface EditableProps {
  contentKey: string;
  defaultContent: React.ReactNode;
  type?: "text" | "rich_text" | "button" | "image" | "video" | "url" | "email" | "phone";
  page?: string;
  className?: string;
  altText?: string;
}

export function Editable({ 
  contentKey, 
  defaultContent, 
  type = "text", 
  page = "home",
  className = "",
  altText = ""
}: EditableProps) {
  const { contentMap, isEditing } = useWebsiteContent();
  const [isHovered, setIsHovered] = useState(false);

  const savedData = contentMap[contentKey];
  const displayValue = savedData?.content_value || defaultContent;
  const displayMediaUrl = savedData?.media_url;

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Send message to the parent Admin Editor window
    window.parent.postMessage({
      type: "EDIT_ELEMENT",
      key: contentKey,
      page,
      contentType: type,
      currentValue: savedData?.content_value || (typeof defaultContent === 'string' ? defaultContent : ''),
      currentMediaUrl: savedData?.media_url || (type === 'image' ? (defaultContent as any)?.props?.src : undefined)
    }, "*");
  };

  // If not editing, just render the content normally
  if (!isEditing) {
    if (type === 'image' && displayMediaUrl) {
      // Create a cloned image element with the new src if a media URL exists
      if (React.isValidElement(defaultContent)) {
        return React.cloneElement(defaultContent as React.ReactElement, { src: displayMediaUrl } as any);
      }
      return <img src={displayMediaUrl} alt={altText} className={className} />;
    }
    
    return <>{displayValue}</>;
  }

  // Edit mode rendering
  const editModeStyles = {
    outline: isHovered ? "2px dashed #FF6B00" : "2px dashed transparent",
    outlineOffset: "4px",
    cursor: "pointer",
    position: "relative" as const,
    transition: "outline 0.2s ease"
  };

  const renderContent = () => {
    if (type === 'image') {
      if (displayMediaUrl) {
        if (React.isValidElement(defaultContent)) {
          return React.cloneElement(defaultContent as React.ReactElement, { src: displayMediaUrl } as any);
        }
        return <img src={displayMediaUrl} alt={altText} className={className} />;
      }
      return defaultContent;
    }
    
    // For text types
    return (
      <span 
        className={className} 
        style={editModeStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        data-editable="true"
        title="Click to edit"
      >
        {displayValue}
        {isHovered && (
          <span className="absolute -top-6 left-0 bg-[#FF6B00] text-white text-[10px] px-2 py-0.5 rounded shadow z-50 whitespace-nowrap">
            Edit {type}
          </span>
        )}
      </span>
    );
  };

  if (type === 'image') {
    return (
      <span
        style={{ ...editModeStyles, display: 'inline-block' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        className="relative group"
      >
        {renderContent()}
        {isHovered && (
          <span className="absolute -top-6 left-0 bg-[#FF6B00] text-white text-[10px] px-2 py-0.5 rounded shadow z-50 whitespace-nowrap">
            Edit Image
          </span>
        )}
      </span>
    );
  }

  return renderContent();
}
