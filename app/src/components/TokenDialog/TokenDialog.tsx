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
import { useEffect, useState } from "react";
import { useSessionToken } from "@/hooks/use-session-token";
import { ENV_TOKEN } from "@/lib/utils";

export function TokenDialog() {
  const { token, setToken } = useSessionToken(ENV_TOKEN);
  const [tempToken, setTempToken] = useState(token);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    setTempToken(token);
  }, [token]);

  const handleSave = () => {
    if (tempToken.trim() === "") {
      return;
    }
    setToken(tempToken);
    setOpen(false);
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
