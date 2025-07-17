"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TokenDialogProps {
  open: boolean;
  onSave: (token: string) => void;
}

export function TokenDialog({ open, onSave }: TokenDialogProps) {
  const [tempToken, setTempToken] = useState("");

  const handleSave = () => {
    if (!tempToken.trim()) return;
    onSave(tempToken.trim());
  };

  return (
    <Dialog open={open}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Set Kubernetes Token</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-2">
          Paste your Kubernetes Bearer token to access cluster resources.
        </p>
        <Input
          type="text"
          placeholder="Enter Bearer token..."
          value={tempToken}
          onChange={(e) => setTempToken(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
