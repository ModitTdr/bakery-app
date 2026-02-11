"use client"
import { menus } from "@/data/menus"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MobileNavbar = () => {
  const currentPath = usePathname()
  return (
    <nav className="flex md:hidden fixed bottom-0 border border-t-black/10 rounded-t-xl max-h-[4.4rem] w-full">
      <ul className="flex items-center justify-between w-full px-8 py-2.5">
        {
          menus.map(({ link, label, icon: Icon }, i) => (
            <Link href={link} key={i}>
              <li className={`flex flex-col items-center gap-0.5 ${currentPath === link ? "text-orange-500" : ""}`} >
                <Icon size="22" />
                <span className="text-xs">{label}</span>
              </li>
            </Link>
          ))
        }
      </ul>
    </nav >
  )
}

export default MobileNavbar
