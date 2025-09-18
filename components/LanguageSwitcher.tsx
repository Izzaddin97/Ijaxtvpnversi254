"use client"

import { useLanguage } from "../contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ms", name: "Bahasa Malaysia", flag: "🇲🇾" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-slate-50 hover:bg-white/10">
          <span className="text-lg mr-1">{currentLanguage?.flag}</span>
          <span className="text-xs font-medium">{currentLanguage?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-900/95 backdrop-blur-lg border-white/10">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as "en" | "ms")}
            className="text-slate-300 hover:text-slate-50 hover:bg-white/10 cursor-pointer"
          >
            <span className="text-lg mr-2">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
