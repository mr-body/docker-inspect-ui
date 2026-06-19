import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn, containerId, containerLabel } from "@/lib/utils";
import StackIcon from "./ui/stackI-con";
import { useProcesses } from "@/hooks/useProcessApi";
import { DockerProcess } from "@/types/process";

export function ContainerSelect({
  value,
  onChange,
  placeholder = "Selecionar container…",
  className,
}: {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useProcesses();
  const items = (data ?? []) as DockerProcess[];
  const selected = items.find((c) => containerId(c) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("min-w-[240px] justify-between font-normal", className)}
        >
          <span className="truncate">
            {selected ? containerLabel(selected) : value || placeholder}
          </span>
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar container…" />
          <CommandList>
            <CommandEmpty>Nenhum container ativo.</CommandEmpty>
            <CommandGroup>
              {items.map((c) => {
                const id = containerId(c);
                const label = containerLabel(c);
                return (
                  <CommandItem
                    key={id}
                    value={`${label} ${id}`}
                    onSelect={() => {
                      onChange(id);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === id ? "opacity-100" : "opacity-0")} />
                    <div className="flex items-center gap-3">
                      <StackIcon name={c.image} className="w-10 h-10" />
                      <div className="flex flex-col">
                        <span className="text-sm">{label}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {(c.name || c.image) ?? id?.slice(0, 12)}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
