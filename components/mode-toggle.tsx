import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Button
      variant={"outline"}
      type="button"
      size={"icon"}
      onClick={handleToggle}
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </Button>
  )
}