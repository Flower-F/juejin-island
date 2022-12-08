import { UserConfig as ViteUserConfig } from 'vite';

export interface NavItemWithLink {
  text: string;
  link: string;
}

export interface SidebarItem {
  text: string;
  link: string;
}

interface SidebarGroup {
  text: string;
  items: SidebarItem[];
}

export interface Sidebar {
  [path: string]: SidebarGroup[];
}

export interface Footer {
  message: string;
}

export interface ThemeConfig {
  nav?: NavItemWithLink[];
  sidebar?: Sidebar;
  footer?: Footer;
}

export interface UserConfig {
  title?: string;
  description?: string;
  themeConfig?: ThemeConfig;
  vite?: ViteUserConfig;
}

export interface SiteConfig {
  root: string;
  configPath: string;
  siteData: UserConfig;
}
