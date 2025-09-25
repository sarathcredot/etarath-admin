declare module "react-tabs" {
  import * as React from "react";

  export interface TabsProps {
    selectedIndex?: number;
    defaultIndex?: number;
    onSelect?: (index: number, lastIndex: number, event: Event) => boolean | void;
    forceRenderTabPanel?: boolean;
    className?: string;
    selectedTabClassName?: string;
    selectedTabPanelClassName?: string;
    disabledTabClassName?: string;
    children?: React.ReactNode;
  }

  export const Tabs: React.FC<TabsProps>;

  export interface TabProps {
    className?: string;
    selectedClassName?: string;
    disabled?: boolean;
    disabledClassName?: string;
    children?: React.ReactNode;
  }
  export const Tab: React.FC<TabProps>;

  export interface TabListProps {
    className?: string;
    children?: React.ReactNode;
  }
  export const TabList: React.FC<TabListProps>;

  export interface TabPanelProps {
    className?: string;
    selectedClassName?: string;
    forceRender?: boolean;
    children?: React.ReactNode;
  }
  export const TabPanel: React.FC<TabPanelProps>;
}
