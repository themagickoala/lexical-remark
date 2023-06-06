import { EditorToolbarItem } from '../../hooks/use-editor-toolbar-items';

export const editorToolbarItemWidthMap = {
  button: 40,
  divider: 1,
  dropdown: 72,
  dropdownExpanded: 160,
};

export const editorToolbarItemBufferWidth = 4;

export const getEditorToolbarSlicePosition = ({
  currentSlicePosition,
  newToolbarWidth,
  toolbarItemsWidth = 0,
  toolbarItemTypes,
  toolbarWidth = 0,
}: {
  currentSlicePosition: number;
  newToolbarWidth?: number;
  toolbarItemTypes: EditorToolbarItem['type'][];
  toolbarItemsWidth?: number;
  toolbarWidth?: number;
}): number => {
  if (!newToolbarWidth || newToolbarWidth === toolbarWidth) {
    return currentSlicePosition;
  }

  if (newToolbarWidth > toolbarItemsWidth) {
    return toolbarItemTypes.length;
  }

  let itemsLength = 0;
  let newSlicePosition = undefined;

  for (let index = 0; index < toolbarItemTypes.length; index++) {
    const itemType = toolbarItemTypes[index];
    itemsLength += editorToolbarItemWidthMap[itemType];

    if (itemsLength + editorToolbarItemBufferWidth * index > newToolbarWidth) {
      newSlicePosition = index;
      break;
    }
  }

  return newSlicePosition ?? currentSlicePosition;
};
