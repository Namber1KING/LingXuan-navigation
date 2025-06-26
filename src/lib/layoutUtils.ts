import { NavItems, Categories } from "../types";

export class LayoutUtils {
  static exportLayout(data: {
    navItems: NavItems;
    categories: Categories;
    panelColor: string;
    panelOpacity: number;
    itemBlockColor: string;
    itemBlockOpacity: number;
    backgroundImage: string;
    isSnowfallEnabled: boolean;
    snowfallSpeed: number;
    snowfallQuantity: number;
  }) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `凌轩导航布局_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static validateLayoutData(data: any): boolean {
    return data.navItems && data.categories;
  }
}