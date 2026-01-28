import { UserButton } from "@clerk/clerk-react";
import { useLocation } from "react-router";

import {
  ClipboardListIcon,
  HomeIcon,
  PanelLeftIcon,
  ShoppingBagIcon,
  UsersIcon,
  Scale,
  FolderIcon,
  ImageIcon,
  GiftIcon
} from "lucide-react";

// eslint-disable-next-line
export const NAVIGATION = [
  { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="size-5" /> },
  { name: "Products", path: "/products", icon: <ShoppingBagIcon className="size-5" /> },
  { name: "Categories", path: "/categories", icon: <FolderIcon className="size-5" /> },
  { name: "Carousels", path: "/carousels", icon: <ImageIcon className="size-5" /> },
  { name: "Promo Banners", path: "/promo-banners", icon: <GiftIcon className="size-5" /> },
  { name: "Orders", path: "/orders", icon: <ClipboardListIcon className="size-5" /> },
  { name: "Customers", path: "/customers", icon: <UsersIcon className="size-5" /> },
  { name: "Sales Page", path: "/salespage", icon: <Scale className="size-5" /> },
];

function Navbar() {
  // why are we using useLocation here? to get the current path
  const location = useLocation();

  return (
    <div className="navbar w-full bg-base-300">
      <label htmlFor="my-drawer" className="btn btn-square btn-ghost" aria-label="open sidebar">
        <PanelLeftIcon className="size-5" />
      </label>

      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">
          {/* THE EFFECT OF THIS IN THE UI IS WHICH EVER PAGE YOU ARE IN YOU WILL SEE THE NAME OF THE PAGE AT THE TOP */}
          {NAVIGATION.find((item) => item.path === location.pathname)?.name || "Dashboard"}
        </h1>
      </div>

      <div className="mr-5">
        <UserButton />
      </div>
    </div>
  );
}

export default Navbar;
