import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
      <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-accent font-mono text-sm font-semibold">
        404
      </div>
      <h1 className="text-xl font-bold tracking-tight text-text-primary">
        Not Found
      </h1>
      <p className="text-xs text-text-muted max-w-xs">
        The requested resource does not exist.
      </p>
      <Link href="/">
        <Button variant="outline" size="sm">
          Home
        </Button>
      </Link>
    </div>
  );
}
