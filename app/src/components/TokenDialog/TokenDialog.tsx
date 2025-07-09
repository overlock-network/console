"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TokenDialogProps {
  open: boolean;
  onClose: () => void;
  token: string;
  setToken: (token: string) => void;
}

export function TokenDialog({
  open,
  onClose,
  token,
  setToken,
}: TokenDialogProps) {
  const [tempToken, setTempToken] = useState(token ?? "");

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
          <Button
            onClick={() => {
              setToken(tempToken);
              sessionStorage.setItem("k8s_token", tempToken);
              onClose();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
