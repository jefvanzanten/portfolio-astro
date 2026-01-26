import { createMemo, createSignal } from "solid-js";

const useNav = (path: string) => {
  // state used for the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  // Fallback to "/" if the currentpath is emptu
  const currentPath = () => path ?? "/";

  const navItems = [
    { to: "/projects", name: "Projecten" },
    { to: "/contact", name: "Contact" },
  ];

  // Save the active navigation item in a variable
  const activeItem = createMemo(() => {
    const path = currentPath();

    // If on homepage, return null (no active item to display)
    if (path === "/") return null;

    // Check for exact match first
    const exactMatch = navItems.find((item) => item.to === path);
    if (exactMatch) return exactMatch;

    // Then check for path prefix (for nested routes)
    const prefixMatch = navItems.find((item) => path.startsWith(item.to));

    return prefixMatch ?? null;
  });

  // Toggle function for the hamburger menu
  const toggleMenu = () => setIsMenuOpen((isOpen) => !isOpen);

  // If the menu is toggled and the user clicked a link it needs to close the menu
  const closeMenu = () => setIsMenuOpen(false);

  // Check if the link is active (for styling)
  const isActive = (linkPath: string) => {
    const path = currentPath();
    if (linkPath === "/") {
      return path === "/";
    }
    return path.startsWith(linkPath);
  };

  return { toggleMenu, closeMenu, isMenuOpen, activeItem, isActive, navItems };
};

export default useNav;
