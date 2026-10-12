"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Check, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadZoneProps {
  value?: string;
  onChange: (urlOrData: string) => void;
  label?: string;
}

export function ImageUploadZone({
  value,
  onChange,
  label = "Upload Gambar"
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState(value && value.startsWith("http") ? value : "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text-secondary">{label}</label>
        <div className="flex items-center gap-1 bg-surface-raised p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${
              mode === "file" ? "bg-accent text-accent-foreground" : "text-text-muted hover:text-text-primary"
            }`}
          >
            File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${
              mode === "url" ? "bg-accent text-accent-foreground" : "text-text-muted hover:text-text-primary"
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {value ? (
        <div className="relative rounded-xl border border-border bg-surface-raised p-2 flex items-center gap-3">
          <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-border shrink-0 bg-background flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-primary truncate">Gambar Terpasang</p>
            <p className="text-[10px] text-text-muted font-mono truncate">
              {value.startsWith("data:") ? "Format: File Lokal (Base64)" : value}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-status-danger hover:bg-status-danger/10 h-7 w-7 p-0 shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : mode === "file" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent/50 bg-surface-raised/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-text-primary">Tarik atau Pilih File</p>
            <p className="text-[10px] text-text-muted">PNG, JPG, WebP, SVG (Maks 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-border bg-surface-raised text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleUrlSubmit}
            className="text-xs h-9 px-3"
          >
            Terapkan
          </Button>
        </div>
      )}
    </div>
  );
}
