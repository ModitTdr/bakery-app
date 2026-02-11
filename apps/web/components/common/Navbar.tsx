"use client"
import { menus } from "@/data/menus"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const currentPath = usePathname()
  return (
    <header className="hidden md:flex justify-between items-center h-14 container mx-auto">
      <h2>Bakery Name</h2>
      <nav>
        <ul className="flex gap-4">
          {
            menus.map(({ link, label }, i) => {
              if (i == 2) return;
              return (
                <Link href={link} key={i}>
                  <li className={`flex flex-col items-center gap-0.5 ${currentPath === link ? "text-orange-500" : ""}`} >
                    <span>{label}</span>
                  </li>
                </Link>
              )
            })
          }
        </ul>
      </nav>
      <div className="flex gap-4">
        <button>Login</button>
        <button>Register</button>
      </div>
    </header>
  )
}

export default Navbar
