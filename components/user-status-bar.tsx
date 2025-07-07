"use client"
import { useAuth } from "@/components/auth/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, LogIn } from "lucide-react"
import React from "react"

interface UserStatusBarProps {
  editorActions?: React.ReactNode
}

export function UserStatusBar({ editorActions }: UserStatusBarProps) {
  const { user, signOut } = useAuth()
  const userLabel = user?.email || 'Demo User'
  const avatarUrl = user?.user_metadata?.avatar_url
  const initials = userLabel
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <nav className="top-0 right-0 left-0 z-50 fixed flex justify-between items-center bg-white/90 shadow px-4 py-2 border-b h-14 text-sm">
      {/* Links: App Name */}
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-gray-900 text-lg">Job Application Manager</h1>
      </div>
      
      {/* Rechts: Vereinte User Info mit Login/Logout */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Avatar className="w-8 h-8">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={userLabel} /> : <AvatarFallback>{initials}</AvatarFallback>}
              </Avatar>
              <span className="max-w-[120px] font-medium text-gray-700 truncate">{userLabel}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user ? (
              <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Login
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
} 
