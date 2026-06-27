export type NavigationItem = {
  to: string;
  name: string;
};

export const navigationItems: NavigationItem[] = [
  { to: "/projects", name: "Projecten" },
  { to: "/contact", name: "Contact" },
];

export function resolveCurrentPath(path?: string): string {
  return path ?? "/";
}

export function getActiveNavigationItem(
  path: string,
): NavigationItem | null {
  const currentPath = resolveCurrentPath(path);

  if (currentPath === "/") {
    return null;
  }

  const exactMatch = navigationItems.find((item) => item.to === currentPath);
  if (exactMatch) {
    return exactMatch;
  }

  return (
    navigationItems.find((item) => currentPath.startsWith(item.to)) ?? null
  );
}

export function isNavigationItemActive(
  path: string,
  linkPath: string,
): boolean {
  const currentPath = resolveCurrentPath(path);

  if (linkPath === "/") {
    return currentPath === "/";
  }

  return currentPath.startsWith(linkPath);
}
