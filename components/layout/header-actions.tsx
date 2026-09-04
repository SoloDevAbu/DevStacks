"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import { useSession, signOut } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, PlusCircle, Sparkles, User as UserIcon } from "lucide-react"

export const HeaderActions = () => {
  const { data: session, isPending } = useSession()
  const { openAuthModal, requireAuth } = useAuthModal()
  const router = useRouter()

  const handleListProductClick = () => {
    requireAuth(() => router.push(ROUTES.SUBMIT), {
      redirectTo: ROUTES.SUBMIT,
      title: "Sign in with Google to list a product",
      description: "Sign in with your Google account to list your developer tool or API.",
    })
  }


  const handleSignOut = async () => {
    await signOut()
    router.refresh()
  }

  const user = session?.user

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name?.trim()) {
      const parts = name.trim().split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return parts[0].slice(0, 2).toUpperCase()
    }
    if (email?.trim()) {
      return email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-none" />
        <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Button
          className="rounded-none text-xs font-semibold"
          nativeButton={false}
          render={<Link href={ROUTES.SUBMIT} />}
        >
          <PlusCircle className="size-3.5 mr-1.5" />
          List a Product
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
            aria-label="User account menu"
          >
            <Avatar className="size-8 cursor-pointer border border-border">
              {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
              <AvatarFallback className="bg-slate-900 text-white text-xs font-medium">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-semibold leading-none text-foreground truncate">
                    {user.name || "Developer"}
                  </p>
                  <p className="text-[11px] leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                render={<Link href={ROUTES.SUBMIT} />}
              >
                <PlusCircle className="size-3.5 mr-2" />
                List a Product
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                render={<Link href={ROUTES.SHOWCASE} />}
              >
                <Sparkles className="size-3.5 mr-2" />
                Showcase a Build
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer text-xs"
              onClick={handleSignOut}
            >
              <LogOut className="size-3.5 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        className="rounded-none text-xs font-semibold"
        onClick={handleListProductClick}
      >
        List a Product
      </Button>
      <Button
        variant="outline"
        className="rounded-md border-dashed border-slate-300 text-xs font-medium cursor-pointer hover:bg-slate-50"
        onClick={() => openAuthModal({ defaultTab: "signin" })}
      >
        <UserIcon className="size-3.5 mr-1" />
        Sign In
      </Button>
    </div>
  )
}
