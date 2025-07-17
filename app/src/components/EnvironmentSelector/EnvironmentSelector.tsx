"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnvironment } from "@/components/EnvironmentProvider";

export const EnvironmentSelector = () => {
  const { selectedEnv, setSelectedEnv, environments } = useEnvironment();

  return (
    <Select value={selectedEnv ?? ""} onValueChange={setSelectedEnv}>
      <SelectTrigger>
        <SelectValue placeholder="Select environment" />
      </SelectTrigger>
      <SelectContent>
        {environments.length > 0 ? (
          environments.map((env) => (
            <SelectItem key={env.id} value={env.id}>
              {env.name ?? env.id}
            </SelectItem>
          ))
        ) : (
          <span className="text-xs pl-2">environments not found</span>
        )}
      </SelectContent>
    </Select>
  );
};
