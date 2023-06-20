/* eslint-disable import/no-extraneous-dependencies */
import { mdiDotsHorizontal } from '@mdi/js';
import { cloneElement, useEffect, useState } from 'react';

import { joinClasses } from '../../../utils/join-classes';
import { useEditorToolbar } from '../../hooks/use-editor-toolbar';
import { EditorToolbarItem } from '../../hooks/use-editor-toolbar-items';
import { getEditorToolbarSlicePosition } from '../../utils/get-editor-toolbar-slice-position';
import { EditorToolbarButton } from './editor-toolbar-button';

export const EditorToolbar = ({ className = '', stickyOffset }: { className?: string; stickyOffset?: number }) => {
  const {
    hideDropdownLabels,
    Toolbar,
    toolbarItems,
    toolbarItemsWidth,
    toolbarWidth: newToolbarWidth,
  } = useEditorToolbar();

  const toolbarItemsCount = toolbarItems.length;
  const [toolbarWidth, setToolbarWidth] = useState(newToolbarWidth);
  const [slicePosition, setSlicePosition] = useState(toolbarItemsCount);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);

  useEffect(() => {
    const newSlicePosition = getEditorToolbarSlicePosition({
      currentSlicePosition: slicePosition,
      newToolbarWidth,
      toolbarItemsWidth,
      toolbarItemTypes: toolbarItems.map(({ type }) => type),
      toolbarWidth,
    });

    if (newSlicePosition && newSlicePosition !== slicePosition) {
      setSlicePosition(newSlicePosition);
    }

    // istanbul ignore if: we can't test element widths in jest
    if (newToolbarWidth && newToolbarWidth !== toolbarWidth) {
      setToolbarWidth(newToolbarWidth);
    }
  }, [newToolbarWidth, slicePosition, toolbarItems, toolbarItemsWidth, toolbarWidth]);

  const renderToolbarItem = ({ component, type }: EditorToolbarItem) =>
    type === 'dropdown' ? cloneElement(component, { hideLabel: hideDropdownLabels }) : component;

  return (
    <div
      {...(!!stickyOffset ? { style: { top: `${stickyOffset}px` } } : {})}
      className={joinClasses(['bg-slate-900 rounded-t border-t border-x border-white', className], {
        'sticky z-10': !!stickyOffset,
      })}
    >
      <div className="border-border-container bg-content-secondary rounded-t-lg border-b px-2 py-1">
        <div className="flex justify-between gap-x-1">
          <Toolbar
            aria-label="Main toolbar menu"
            className="flex min-w-0 flex-grow gap-x-1"
          >
            {toolbarItems
              .slice(0, slicePosition)
              .map((toolbarItem, index) =>
                index === slicePosition - 1 && toolbarItem.type === 'divider' ? null : renderToolbarItem(toolbarItem),
              )}
          </Toolbar>

          <EditorToolbarButton
            {...(slicePosition >= toolbarItems.length
              ? {
                  'aria-disabled': true,
                  'className': 'opacity-0 pointer-events-none',
                  'disabled': true,
                }
              : {})}
            aria-label={`${showSecondaryMenu ? 'Hide' : 'Show'} secondary toolbar menu`}
            iconPath={mdiDotsHorizontal}
            isActive={showSecondaryMenu}
            onClick={() => setShowSecondaryMenu(!showSecondaryMenu)}
          />
        </div>

        <nav
          aria-hidden={showSecondaryMenu ? 'false' : 'true'}
          aria-label="Secondary toolbar menu"
          className={showSecondaryMenu ? 'flex flex-wrap gap-x-1' : 'hidden'}
        >
          {toolbarItems
            .slice(slicePosition)
            .map((toolbarItem, index) =>
              index === 0 && toolbarItem.type === 'divider' ? null : renderToolbarItem(toolbarItem),
            )}
        </nav>
      </div>
    </div>
  );
};
