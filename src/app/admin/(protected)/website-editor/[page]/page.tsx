"use client";

import { useState, useEffect, useRef, use } from "react";
import { Monitor, Smartphone, Tablet, Save, Eye, Edit2, Undo, Redo, UploadCloud, X, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";

type Viewport = "desktop" | "tablet" | "mobile";
type PageRoute = "" | "solutions" | "projects" | "about" | "contact";

interface EditedElement {
  key: string;
  page: string;
  contentType: string;
  value: string;
  mediaUrl?: string;
}

export default function WebsiteEditorPage({ params }: { params: Promise<{ page: string }> }) {
  const resolvedParams = use(params);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const activePage = resolvedParams.page === 'home' ? '' : resolvedParams.page as PageRoute;
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Active editing session
  const [selectedElement, setSelectedElement] = useState<EditedElement | null>(null);
  
  // Changes tracking
  const [changes, setChanges] = useState<Record<string, EditedElement>>({});
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen to messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "EDIT_ELEMENT") {
        if (mode !== "edit") return;
        
        // If we already have local changes for this key, load them, otherwise load what the iframe sent
        const existingChange = changes[event.data.key];
        
        setSelectedElement({
          key: event.data.key,
          page: event.data.page || activePage || "home",
          contentType: event.data.contentType,
          value: existingChange ? existingChange.value : event.data.currentValue,
          mediaUrl: existingChange ? existingChange.mediaUrl : event.data.currentMediaUrl
        });
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [mode, changes, activePage]);

  // Sync changes to iframe instantly for live preview
  useEffect(() => {
    if (selectedElement && iframeRef.current?.contentWindow) {
      // Send real-time update to iframe
      iframeRef.current.contentWindow.postMessage({
        type: "UPDATE_PREVIEW",
        key: selectedElement.key,
        value: selectedElement.value,
        mediaUrl: selectedElement.mediaUrl
      }, "*");
    }
  }, [selectedElement?.value, selectedElement?.mediaUrl]);

  const handleApplyEdit = () => {
    if (!selectedElement) return;
    
    // Save to changes record
    setChanges(prev => ({
      ...prev,
      [selectedElement.key]: selectedElement
    }));
    
    setSelectedElement(null);
  };

  const handleDiscardEdit = () => {
    if (!selectedElement) return;
    
    // Send original value back to iframe to revert live preview
    const originalValue = changes[selectedElement.key]?.value || ""; 
    const originalMedia = changes[selectedElement.key]?.mediaUrl || "";
    
    if (iframeRef.current?.contentWindow) {
      // We don't have the *true* original here unless we fetched it, 
      // but reloading the iframe or navigating handles it. 
      // For now, if there's a stored change, revert to that, else we'd need to force reload.
      // We'll just close the panel. The safest way to revert unsaved visual is just reload.
    }
    
    setSelectedElement(null);
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (Object.keys(changes).length === 0) return;
    
    const isPub = status === 'published';
    isPub ? setIsPublishing(true) : setIsSaving(true);
    
    try {
      const payload = Object.values(changes).map(change => ({
        page: change.page,
        content_key: change.key,
        content_type: change.contentType,
        content_value: change.value,
        media_url: change.mediaUrl,
        status: status
      }));

      const res = await fetch("/api/admin/website-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save changes");
      
      alert(`Changes successfully ${status}!`);
      
      if (status === 'published') {
        // Clear local changes after publish
        setChanges({});
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      isPub ? setIsPublishing(false) : setIsSaving(false);
    }
  };

  const getViewportWidth = () => {
    if (viewport === "mobile") return "375px";
    if (viewport === "tablet") return "768px";
    return "100%";
  };

  const iframeUrl = `/${activePage}?mode=${mode}`;

  return (
    <div className="flex flex-col flex-1 h-full font-sans bg-[#0A0A0A]">
      {/* TOP TOOLBAR */}
      <div className="h-14 border-b border-[#2A2A2A] bg-[#1A1A1A] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex bg-[#1E1E1E] rounded-md border border-[#2A2A2A] p-0.5">
            <button 
              onClick={() => setMode("edit")}
              className={`px-3 py-1 text-sm rounded ${mode === "edit" ? "bg-[#2A2A2A] text-white" : "text-[#8A8A8A] hover:text-white"}`}
            >
              <div className="flex items-center gap-1.5"><Edit2 className="w-3.5 h-3.5"/> Edit</div>
            </button>
            <button 
              onClick={() => {
                setMode("preview");
                setSelectedElement(null);
              }}
              className={`px-3 py-1 text-sm rounded ${mode === "preview" ? "bg-[#2A2A2A] text-white" : "text-[#8A8A8A] hover:text-white"}`}
            >
               <div className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5"/> Preview</div>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#1E1E1E] rounded-md border border-[#2A2A2A] p-0.5 mr-4">
            <button onClick={() => setViewport("desktop")} className={`p-1.5 rounded ${viewport === "desktop" ? "bg-[#2A2A2A] text-white" : "text-[#8A8A8A] hover:text-white"}`} title="Desktop">
              <Monitor className="w-4 h-4"/>
            </button>
            <button onClick={() => setViewport("tablet")} className={`p-1.5 rounded ${viewport === "tablet" ? "bg-[#2A2A2A] text-white" : "text-[#8A8A8A] hover:text-white"}`} title="Tablet">
              <Tablet className="w-4 h-4"/>
            </button>
            <button onClick={() => setViewport("mobile")} className={`p-1.5 rounded ${viewport === "mobile" ? "bg-[#2A2A2A] text-white" : "text-[#8A8A8A] hover:text-white"}`} title="Mobile">
              <Smartphone className="w-4 h-4"/>
            </button>
          </div>

          <button className="text-[#8A8A8A] hover:text-white p-1" title="Undo (Coming Soon)"><Undo className="w-4 h-4"/></button>
          <button className="text-[#8A8A8A] hover:text-white p-1" title="Redo (Coming Soon)"><Redo className="w-4 h-4"/></button>

          <div className="h-6 w-px bg-[#2A2A2A] mx-2"></div>

          <div className="text-xs text-[#8A8A8A]">
            {Object.keys(changes).length} unsaved changes
          </div>

          <Button 
            variant="outline" 
            className="border-[#2A2A2A] bg-transparent text-white hover:bg-[#1E1E1E]"
            onClick={() => handleSave('draft')}
            disabled={isSaving || Object.keys(changes).length === 0}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          
          <Button 
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white flex items-center gap-2"
            onClick={() => handleSave('published')}
            disabled={isPublishing || Object.keys(changes).length === 0}
          >
            <UploadCloud className="w-4 h-4" />
            {isPublishing ? "Publishing..." : "Publish Changes"}
          </Button>
          
        </div>
      </div>

      {/* EDITOR WORKSPACE */}
      <div className="flex-1 flex overflow-hidden bg-[#0A0A0A]">
        
        {/* IFRAME CONTAINER */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-4 md:p-8">
          <div 
            className="bg-white shadow-2xl transition-all duration-300 ease-in-out border border-[#2A2A2A] rounded overflow-hidden relative"
            style={{ 
              width: getViewportWidth(), 
              height: '100%',
              maxWidth: '100%'
            }}
          >
            {/* The overlay prevents interaction when in "edit" mode to allow us to catch clicks, 
                BUT actually we want the elements inside the iframe to catch the clicks. 
                So we don't put a blanket overlay. We let the iframe handle it. */}
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              className="w-full h-full border-0"
              title="Website Preview"
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR PANEL */}
        {selectedElement && (
          <div className="w-80 bg-[#141414] border-l border-[#2A2A2A] flex flex-col shrink-0 shadow-xl z-10 animate-in slide-in-from-right-8">
            <div className="h-14 border-b border-[#2A2A2A] flex items-center justify-between px-4">
              <h3 className="font-semibold text-white text-sm">Edit {selectedElement.contentType === 'image' ? 'Image' : 'Content'}</h3>
              <button onClick={handleDiscardEdit} className="text-[#8A8A8A] hover:text-white"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="mb-4">
                <div className="text-xs text-[#8A8A8A] mb-1 font-mono">{selectedElement.key}</div>
              </div>

              {selectedElement.contentType === 'text' || selectedElement.contentType === 'button' ? (
                <div className="space-y-2">
                  <label className="text-sm text-white font-medium">Text Value</label>
                  <textarea 
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] text-white rounded p-3 text-sm focus:border-[#FF6B00] outline-none min-h-[100px]"
                    value={selectedElement.value}
                    onChange={(e) => setSelectedElement({...selectedElement, value: e.target.value})}
                  />
                  <p className="text-xs text-[#8A8A8A] mt-2">
                    Editing this will change the content instantly in the preview, but not on the live site until published.
                  </p>
                </div>
              ) : selectedElement.contentType === 'image' ? (
                <div className="space-y-4">
                  <label className="text-sm text-white font-medium">Image URL</label>
                  
                  {selectedElement.mediaUrl || selectedElement.value ? (
                    <div className="relative aspect-video rounded overflow-hidden bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center">
                      <img 
                        src={selectedElement.mediaUrl || selectedElement.value} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : null}
                  
                  <input 
                    type="url"
                    placeholder="https://..."
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] text-white rounded p-2 text-sm focus:border-[#FF6B00] outline-none"
                    value={selectedElement.mediaUrl || selectedElement.value}
                    onChange={(e) => setSelectedElement({...selectedElement, mediaUrl: e.target.value, value: e.target.value})}
                  />
                  <p className="text-xs text-[#8A8A8A]">
                    Enter the URL of the new image. Make sure it has similar dimensions to the original.
                  </p>
                </div>
              ) : (
                <div className="text-sm text-[#8A8A8A]">
                  This content type ({selectedElement.contentType}) is not fully supported in the visual editor yet.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#2A2A2A] flex gap-2">
              <Button onClick={handleDiscardEdit} variant="outline" className="flex-1 border-[#2A2A2A] text-white hover:bg-[#1E1E1E]">
                Cancel
              </Button>
              <Button onClick={handleApplyEdit} className="flex-1 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                Apply Edit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
