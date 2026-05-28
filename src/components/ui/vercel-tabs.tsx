"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Image,
  Network,
  Cpu,
  HardDrive,
  Settings2,
} from "lucide-react";
import Link from "next/link";


interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab?: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, activeTab, ...props }, ref) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [hoverStyle, setHoverStyle] = useState({})
    const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
    const tabRefs = useRef<(HTMLDivElement | null)[]>([])

    const tabs = [
      {
        id: "overview",
        label: "Overview",
        href: "/manager",
        icon: LayoutDashboard,
      },
      {
        id: "integrations",
        label: "Images",
        href: "/manager/image",
        icon: Image,
      },
      {
        id: "activity",
        label: "Networks",
        href: "/manager/network",
        icon: Network,
      },
      {
        id: "domains",
        label: "Processes",
        href: "/manager/process",
        icon: Cpu,
      },
      {
        id: "usage",
        label: "Volumes",
        icon: HardDrive,
      },
      {
        id: "monitoring",
        label: "Environment",
        icon: Settings2,
      },
    ];

    useEffect(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex]
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement
          setHoverStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          })
        }
      }
    }, [hoveredIndex])

    useEffect(() => {
      const activeElement = tabRefs.current[activeIndex]
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }, [activeIndex])

    useEffect(() => {
      requestAnimationFrame(() => {
        const firstElement = tabRefs.current[0]
        if (firstElement) {
          const { offsetLeft, offsetWidth } = firstElement
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          })
        }
      })
    }, [])

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <div className="relative">
          {/* Hover Highlight */}
          <div
            className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator */}
          <div
            className="absolute bottom-[-9px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
            style={activeStyle}
          />

          {/* Tabs */}
          <div className="relative flex space-x-[6px] items-center">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.id}
                  href={tab.href || "/manager"}
                  ref={(el) => (tabRefs.current[index] = el)}
                  className={cn(
                    "px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px]",
                    index === activeIndex
                      ? "text-[#0e0e10] dark:text-white"
                      : "text-[#0e0f1199] dark:text-[#ffffff99]"
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                >
                  <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center gap-2 h-full">
                    {Icon && <Icon className="w-4 h-4" />}
                    {tab.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    )
  }
)
Tabs.displayName = "Tabs"

export { Tabs }