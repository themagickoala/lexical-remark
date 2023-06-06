/* eslint-disable import/no-extraneous-dependencies */
import { Menu } from '@headlessui/react';
import Icon from '@mdi/react';
import { ComponentPropsWithoutRef } from 'react';

import { joinClasses } from '../../../../../utils/join-classes';

export const EditorToolbarDropdownItem = ({
  ariaLabel,
  iconPath,
  isActive = false,
  isDisabled = false,
  label,
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  ariaLabel?: string;
  iconPath?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  label?: string;
}) => (
  <Menu.Item>
    <button
      {...props}
      {...(isDisabled ? { 'aria-disabled': true, 'disabled': true } : {})}
      aria-label={ariaLabel || label}
      className={joinClasses(
        'bg-content-secondary hover:bg-content-primary flex h-10 w-full items-center gap-x-2 rounded p-2',
        {
          'border border-font-secondary-dark': isActive,
          'opacity-40 cursor-not-allowed': isDisabled,
        },
      )}
    >
      {iconPath && (
        <Icon
          path={iconPath}
          size={1}
        />
      )}

      {label && <span className="font-roboto text-font-primary text-base leading-normal tracking-normal">{label}</span>}
    </button>
  </Menu.Item>
);
