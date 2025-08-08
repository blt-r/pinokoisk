import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoonIcon, SunIcon } from 'lucide-react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react-lite';

type Theme = 'light' | 'dark' | 'system';
const NO_TRANSITION_CLASS = 'remove-transitions-for-theme-change';

const theme = observable.box('system' as Theme);

const setTheme = action((newTheme: Theme) => {
  theme.set(newTheme);

  if (newTheme === 'system') {
    localStorage.removeItem('theme');
  } else {
    localStorage.setItem('theme', newTheme);
  }

  document.documentElement.classList.add(NO_TRANSITION_CLASS);
  document.documentElement.setAttribute('data-theme', newTheme);
  setTimeout(() => {
    document.documentElement.classList.remove(NO_TRANSITION_CLASS);
  }, 0);
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  setTheme(savedTheme);
}

const ThemeToggle = observer(() => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          <SunIcon className="size-[1.2rem] dark:opacity-0" />
          <MoonIcon className="size-[1.2rem] opacity-0 dark:opacity-100 absolute" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme.get()}
          onValueChange={value => setTheme(value as Theme)}
        >
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ThemeToggle;
