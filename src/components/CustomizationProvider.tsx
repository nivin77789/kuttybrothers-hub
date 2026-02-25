import React, { createContext, useContext, useEffect, useState } from "react";

type ColorTheme = "default" | "theme-emerald" | "theme-rose" | "theme-amber" | "theme-violet" | "theme-midnight";
type DesignStyle = "default" | "design-minimal" | "design-industrial" | "design-glass" | "design-luxury" | "design-cyberpunk";

interface CustomizationContextType {
    colorTheme: ColorTheme;
    setColorTheme: (theme: ColorTheme) => void;
    designStyle: DesignStyle;
    setDesignStyle: (style: DesignStyle) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [colorTheme, setColorTheme] = useState<ColorTheme>(
        (localStorage.getItem("color-theme") as ColorTheme) || "default"
    );
    const [designStyle, setDesignStyle] = useState<DesignStyle>(
        (localStorage.getItem("design-style") as DesignStyle) || "default"
    );

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old classes
        const colorThemes: ColorTheme[] = ["theme-emerald", "theme-rose", "theme-amber", "theme-violet", "theme-midnight"];
        const designStyles: DesignStyle[] = ["design-minimal", "design-industrial", "design-glass", "design-luxury", "design-cyberpunk"];

        colorThemes.forEach(t => root.classList.remove(t));
        designStyles.forEach(s => root.classList.remove(s));

        // Add new classes
        if (colorTheme !== "default") root.classList.add(colorTheme);
        if (designStyle !== "default") root.classList.add(designStyle);

        localStorage.setItem("color-theme", colorTheme);
        localStorage.setItem("design-style", designStyle);
    }, [colorTheme, designStyle]);

    return (
        <CustomizationContext.Provider value={{ colorTheme, setColorTheme, designStyle, setDesignStyle }}>
            {children}
        </CustomizationContext.Provider>
    );
};

export const useCustomization = () => {
    const context = useContext(CustomizationContext);
    if (context === undefined) {
        throw new Error("useCustomization must be used within a CustomizationProvider");
    }
    return context;
};
