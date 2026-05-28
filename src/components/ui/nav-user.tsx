"use client"

import { BadgeCheck, Bell, LogOut, Settings, Sparkles } from "lucide-react"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import Link from "next/link"

export function NavUser() {

    return (
        <div className="flex">
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="select-none cursor-pointer">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                    </Avatar>

                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="min-w-56 rounded-lg"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-sm">
                            <Avatar className="h-9 w-9 rounded-lg">
                                <AvatarImage src={"https://github.com/shadcn.png"} />
                                <AvatarFallback >
                                    shadcn
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate font-medium">shadcn</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    m@example.com
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Sparkles className="mr-2 h-4 w-4" />
                            <Link href={``}>Upgrade to Pro</Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link className="flex gap-2" href={`/account`}>
                                <BadgeCheck className="mr-2 h-4 w-4" />
                                Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
