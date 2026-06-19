import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Stacks } from "@/data/stacks";
import { SiDocker } from "react-icons/si";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const normalize = (value: string) =>
  value.toLowerCase();

export function getStackIcon(name: string) {
  const key = normalize(name);

  const stack = Stacks.find((s) =>
    key.includes(s.name.toLowerCase())
  );

  return stack?.icon ?? SiDocker;
}

export function containerLabel(c: any): string {
  return c?.Names || c?.name || c?.Id?.slice(0, 12) || c?.id?.slice(0, 12) || "?";
}

export function containerId(c: any): string {
  return c?.Id || c?.id || c?.Names || c?.name;
}
