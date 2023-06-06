import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

import { useEditorToolbarItems } from '../../hooks/use-editor-toolbar-items';
import { editorToolbarItemBufferWidth, editorToolbarItemWidthMap } from '../../utils/get-editor-toolbar-slice-position';

export const useEditorToolbar = () => {
  const [toolbarItems] = useEditorToolbarItems();

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarWidth, setToolbarWidth] = useState(0);
  const [toolbarItemsWidth, setToolbarItemsWidth] = useState<number | undefined>(undefined);
  const [dropdownCount, setDropdownCount] = useState<number | undefined>(undefined);
  const [hideDropdownLabels, setHideDropdownLabels] = useState(false);

  const Toolbar = ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLDivElement>) => (
    <nav
      ref={toolbarRef}
      {...props}
    >
      {children}
    </nav>
  );

  useEffect(() => {
    const newToolbarItemsWidth =
      toolbarItemsWidth ??
      toolbarItems.reduce(
        (totalLength, { type }) => totalLength + editorToolbarItemWidthMap[type],
        toolbarItems.length ? (toolbarItems.length - 1) * editorToolbarItemBufferWidth : 0,
      );
    const newDropdownCount = dropdownCount ?? toolbarItems.filter(({ type }) => type === 'dropdown').length;

    if (!toolbarItemsWidth) {
      setToolbarItemsWidth(newToolbarItemsWidth);
    }

    if (!dropdownCount) {
      setDropdownCount(newDropdownCount);
    }

    // istanbul ignore next: we can't test element widths in jest
    const observer = new ResizeObserver(([entry]) => {
      const newToolbarWidth = entry.target.clientWidth;

      if (newToolbarWidth && newToolbarWidth !== toolbarWidth) {
        setToolbarWidth(newToolbarWidth);
        setHideDropdownLabels(
          newToolbarWidth < newToolbarItemsWidth + newDropdownCount * editorToolbarItemWidthMap.dropdownExpanded,
        );
      }
    });

    if (toolbarRef.current) {
      observer.observe(toolbarRef.current);
    }

    return () => observer.disconnect();
  }, [dropdownCount, toolbarItems, toolbarItemsWidth, toolbarRef, toolbarWidth]);

  return {
    hideDropdownLabels,
    Toolbar,
    toolbarItems,
    toolbarItemsWidth,
    toolbarWidth,
  };
};
