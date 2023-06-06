const VERTICAL_OFFSET = 6;
const HORIZONTAL_OFFSET = 6;

export const setEditorPopoverPosition = (
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalOffset: number = VERTICAL_OFFSET,
  horizontalOffset: number = HORIZONTAL_OFFSET,
): void => {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  const spaceAboveTarget = targetRect.top - anchorElementRect.top + anchorElem.scrollTop;
  const floatingElementHeight = floatingElemRect.height + verticalOffset;

  // position floating element on target element
  let top = targetRect.top + anchorElem.scrollTop;
  let left = targetRect.left - horizontalOffset;

  // position floating element above target element
  if (spaceAboveTarget > floatingElementHeight) {
    top -= floatingElementHeight;
  } else {
    top += targetRect.height + verticalOffset;
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }

  top -= anchorElementRect.top;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = '1';
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
};
