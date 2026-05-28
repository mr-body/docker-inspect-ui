"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { X, Power, Pause, Play, RotateCcw } from "lucide-react";
import { DockerNetworkContainer } from "@/types/network";
import StackIcon from "./stackI-con";
import { select } from "framer-motion/client";

interface ServerManagementTableProps {
  title?: string;
  containers?: Record<string, DockerNetworkContainer>;
  className?: string;
}


export function ServerManagementTable({
  title = "Active Services",
  containers,
  className = ""
}: ServerManagementTableProps = {}) {
  const [container, setContainer] = useState<DockerNetworkContainer | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<DockerNetworkContainer | null>(null);
  const [hoveredServer, setHoveredServer] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";


  const openServerModal = (container: DockerNetworkContainer) => {
    setSelectedContainer(container);
  };

  const closeServerModal = () => {
    setSelectedContainer(null);
  };


  const getCPUBars = (percentage: number, status: string) => {
    const filledBars = Math.round((percentage / 100) * 10);

    const getBarColor = (index: number) => {
      if (index >= filledBars) {
        return "bg-muted/40 border border-border/30";
      }

      switch (status) {
        case "active":
          return "bg-foreground/60";
        case "paused":
          return "bg-muted-foreground/50";
        case "inactive":
          return "bg-muted-foreground/30";
        default:
          return "bg-foreground/60";
      }
    };

    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-5 rounded-full transition-all duration-500 ${getBarColor(index)}`}
            />
          ))}
        </div>
        <span className="text-sm font-mono text-foreground font-medium min-w-[3rem]">
          {percentage}%
        </span>
      </div>
    );
  };

  const cpuUsage = useMemo(() => Math.floor(Math.random() * 61) + 40, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <span className="text-green-400 text-sm font-medium">Active</span>
          </div>
        );
      case "paused":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <span className="text-yellow-400 text-sm font-medium">Paused</span>
          </div>
        );
      case "inactive":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <span className="text-red-400 text-sm font-medium">Inactive</span>
          </div>
        );
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "active":
        return "from-green-500/10 to-transparent";
      case "paused":
        return "from-yellow-500/10 to-transparent";
      case "inactive":
        return "from-red-500/10 to-transparent";
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <div className="relative border border-border/30 rounded-2xl p-6 bg-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h1 className="text-xl font-medium text-foreground">{title}</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {containers && Object.keys(containers).length} Servers
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.div
          className="space-y-2"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {/* Headers */}
          <div className="grid grid-cols-10 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">No</div>
            <div className="col-span-1">Image</div>
            <div className="col-span-3">Container name</div>
            <div className="col-span-2">IP</div>
            <div className="col-span-2">Mac</div>
            <div className="col-span-1">Status</div>
          </div>

          {/* Server Rows */}
          {containers &&
            Object.keys(containers).length > 0 &&
            Object.entries(containers).map(([id, container], index) => (
              <div
                key={id}
              >
                <motion.div
                  key={container.EndpointID}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: -25,
                      scale: 0.95,
                      filter: "blur(4px)"
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      filter: "blur(0px)",
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                        mass: 0.6,
                      },
                    },
                  }}
                  className="relative cursor-pointer"
                  onMouseEnter={() => setHoveredServer(container.EndpointID)}
                  onMouseLeave={() => setHoveredServer(null)}
                  onClick={() => openServerModal(container)}
                >
                  <motion.div
                    className="relative bg-muted/50 border border-border/50 rounded-xl p-4 overflow-hidden"
                    whileHover={{
                      y: -1,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                  >
                    {/* Status gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-l ${getStatusGradient("active")} pointer-events-none`}
                      style={{
                        backgroundSize: "30% 100%",
                        backgroundPosition: "right",
                        backgroundRepeat: "no-repeat"
                      }}
                    />

                    {/* Grid Content */}
                    <div className="relative grid grid-cols-10 gap-4 items-center">
                      {/* Number */}
                      <div className="col-span-1">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Service Name */}
                      <div className="col-span-1 flex items-center gap-3">
                        <StackIcon name={container.Name} className="w-8 h-8" />
                      </div>

                      {/* Service Location */}
                      <div className="col-span-3 flex items-center gap-3">
                        <span className="text-foreground font-medium">
                          {container.Name}
                        </span>
                      </div>

                      {/* IP */}
                      <div className="col-span-2">
                        <span className="text-foreground font-mono text-sm">
                          {container.IPv4Address}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div className="col-span-2">
                        <span className="text-foreground">
                          {container.MacAddress}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        {getStatusBadge("active")}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
        </motion.div>

        {/* Server Management Overlay - Inside Card */}
        <AnimatePresence>
          {selectedContainer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col rounded-2xl z-10 overflow-hidden"
            >
              {/* Header with Actions */}
              <div className="relative bg-gradient-to-r from-muted/50 to-transparent p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    
                  </div>
                  <StackIcon name={selectedContainer?.Name!} className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {selectedContainer?.Name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-border/30 flex items-center justify-center">
                        <div className="w-full h-full scale-75">
                          {}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {selectedContainer?.MacAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Header */}
                <div className="flex items-center gap-2">
                  {/* Start/Stop */}
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Power className="w-3 h-3" />
                    Stop
                  </motion.button>

                  {/* Pause/Resume */}
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Pause className="w-3 h-3" />
                    Pause
                  </motion.button>

                  {/* Restart */}
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restart
                  </motion.button>

                  {/* Close Button */}
                  <motion.button
                    className="w-8 h-8 bg-background/80 hover:bg-background rounded-full flex items-center justify-center border border-border/50 ml-2"
                    onClick={closeServerModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Server Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* IP Address */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      IPv4 Address
                    </label>
                    <div className="text-sm font-mono font-medium mt-1">
                      {selectedContainer?.IPv4Address}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      IPv6 Address
                    </label>
                    <div className="text-sm font-medium mt-1">
                      {selectedContainer?.IPv6Address}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge("active")}
                    </div>
                  </div>
                </div>

                {/* CPU Usage */}
                <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    CPU Usage
                  </label>
                  {getCPUBars(1000, "active")}
                </div>

                {/* Server Logs Preview */}
                <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Recent Activity
                  </label>
                  <div className="font-mono text-xs space-y-1 max-h-24 overflow-y-auto">
                    <div className="text-green-400">[15:42:31] Server started successfully</div>
                    <div className="text-blue-400">[15:42:25] System health check passed</div>
                    <div className="text-yellow-400">[15:41:18] CPU usage: {100}%</div>
                    <div className="text-muted-foreground">[15:40:05] Connection from {selectedContainer?.EndpointID}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
