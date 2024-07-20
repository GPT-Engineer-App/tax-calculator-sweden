import { Package2 } from "lucide-react";
import { NavItem } from "./NavItem";
import { Button } from "@/components/ui/button";

export const DesktopNavbar = ({ navItems }) => (
  <nav className="hidden md:flex md:items-center md:gap-5 lg:gap-6 text-lg font-medium md:text-sm">
    <NavItem
      to="/"
      className="flex items-center gap-2 text-lg font-semibold md:text-base"
    >
      <Package2 className="h-6 w-6" />
      <span className="hidden sm:inline">Acme Inc</span>
    </NavItem>
    {navItems.map((item) => (
      <Button key={item.to} variant="ghost" asChild>
        <NavItem to={item.to}>
          {item.title}
        </NavItem>
      </Button>
    ))}
  </nav>
);