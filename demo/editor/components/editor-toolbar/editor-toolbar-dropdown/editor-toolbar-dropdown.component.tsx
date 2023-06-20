/* eslint-disable import/no-extraneous-dependencies */
import { Menu } from '@headlessui/react';
import { mdiChevronDown } from '@mdi/js';
import Icon from '@mdi/react';
import { ReactNode } from 'react';

import { joinClasses } from '../../../../utils/join-classes';

export const EditorToolbarDropdown = ({
  buttonAriaLabel,
  buttonIconPath,
  buttonLabel,
  children,
  hideLabel = false,
  isActive = false,
  isDisabled = false,
}: {
  buttonAriaLabel?: string;
  buttonIconPath?: string;
  buttonLabel?: string;
  children?: ReactNode;
  hideLabel?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
}) => (
  <Menu
    as="div"
    className="relative"
  >
    {({ open: isOpen }) => (
      <>
        <Menu.Button
          {...(isDisabled ? { 'aria-disabled': true, 'disabled': true } : {})}
          aria-label={buttonAriaLabel || buttonLabel}
          className={joinClasses(
            [
              'hover:bg-content-primary flex h-10 max-w-[10rem] items-center justify-between gap-x-2 rounded px-2',
              isOpen ? 'bg-content-primary' : 'bg-content-secondary',
            ],
            {
              'border border-font-secondary-dark': isActive,
              'opacity-40 cursor-not-allowed': isDisabled,
            },
          )}
        >
          {buttonIconPath && (
            <Icon
              className="flex-shrink-0"
              path={buttonIconPath}
              size={1}
            />
          )}

          {!hideLabel && buttonLabel && (
            <span
              className={joinClasses([
                'font-roboto text-base leading-normal tracking-normal',
                'flex-grow truncate whitespace-nowrap text-white',
              ])}
            >
              {buttonLabel}
            </span>
          )}

          <Icon
            className="flex-shrink-0"
            path={mdiChevronDown}
            size={1}
          />
        </Menu.Button>

        <Menu.Items className="bg-slate-700 border-border-container absolute left-0 z-10 mt-2 w-56 origin-top-left rounded border p-2 shadow-lg">
          {children}
        </Menu.Items>
      </>
    )}
  </Menu>
);
