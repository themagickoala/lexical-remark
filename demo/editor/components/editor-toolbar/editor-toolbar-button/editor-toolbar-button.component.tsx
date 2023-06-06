/* eslint-disable import/no-extraneous-dependencies */
import Icon from '@mdi/react';
import { ComponentPropsWithoutRef } from 'react';

import { joinClasses } from '../../../../utils/join-classes';

export const EditorToolbarButton = ({
  className = '',
  iconPath,
  isActive = false,
  isDisabled = false,
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  className?: string;
  iconPath: string;
  isActive?: boolean;
  isDisabled?: boolean;
}) => (
  <button
    {...props}
    {...(isDisabled ? { 'aria-disabled': true, 'disabled': true } : {})}
    aria-pressed={isActive}
    className={joinClasses(
      [
        'bg-content-secondary hover:bg-content-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded',
        className,
      ],
      {
        'border border-font-secondary-dark': isActive,
        'opacity-40 cursor-not-allowed': isDisabled,
      },
    )}
    type="button"
  >
    <Icon
      path={iconPath}
      size={1}
    />
  </button>
);
