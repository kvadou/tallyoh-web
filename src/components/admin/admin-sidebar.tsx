"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Target,
  Coins,
  ShoppingBag,
  PawPrint,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { logout } from "@/app/admin/login/actions"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users & Families", icon: Users },
  { href: "/admin/characters", label: "Characters", icon: PawPrint },
  { href: "/admin/stories", label: "Stories", icon: BookOpen },
  { href: "/admin/missions", label: "Missions", icon: Target },
  { href: "/admin/economy", label: "Coin Economy", icon: Coins },
  { href: "/admin/store", label: "Store & Rewards", icon: ShoppingBag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-navy min-h-screen flex flex-col shrink-0">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <img
            src="/app-icon-1024.jpg"
            alt="TallyOh"
            className="w-10 h-10 rounded-xl"
          />
          <div>
            <span className="font-heading font-bold text-white text-lg">
              TallyOh
            </span>
            <span className="block text-xs text-white/50">Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 mt-auto">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors w-full"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
