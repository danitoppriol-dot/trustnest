import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES, type Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  try {
    const { language, setLanguage } = useLanguage();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{LANGUAGES[language]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.entries(LANGUAGES) as [Language, string][]).map(([lang, name]) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLanguage(lang)}
              className={language === lang ? 'bg-slate-100' : ''}
            >
              <span className="flex items-center gap-2">
                {language === lang && <span className="text-green-600">✓</span>}
                {name}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } catch (error) {
    // If LanguageProvider is not available, render a simple button
    return (
      <Button variant="ghost" size="sm" className="gap-2">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">EN</span>
      </Button>
    );
  }
}
