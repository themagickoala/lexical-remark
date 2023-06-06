/* eslint-disable import/no-extraneous-dependencies */
import { mdiCheck, mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { Dispatch, forwardRef, HTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface FloatingLinkEditorInputs {
  newLinkUrl: string;
}

export const EditorLinkPopoverComponent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLElement> & {
    isEditing: boolean;
    linkUrl: string;
    onClose: () => void;
    onFormSubmit: (newLinkUrl: string) => void;
    setIsEditing: Dispatch<boolean>;
  }
>(({ isEditing, linkUrl, onClose, onFormSubmit, setIsEditing }, ref) => {
  const { handleSubmit, register, setFocus, setValue } = useForm<FloatingLinkEditorInputs>({
    mode: 'onChange',
  });

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        window.removeEventListener('keydown', onEscape);
      }
    };

    if (isEditing) {
      setValue('newLinkUrl', linkUrl);
      setFocus('newLinkUrl');
      window.addEventListener('keydown', onEscape);
    }

    return () => window.removeEventListener('keydown', onEscape);
  }, [isEditing, linkUrl, setIsEditing, setFocus, setValue, onClose]);

  return (
    <div
      ref={ref}
      className="bg-border-container absolute left-0 top-0 z-20 w-full max-w-sm rounded-lg p-4 opacity-0 will-change-transform"
    >
      {isEditing ? (
        <form
          className="border-font-secondary-dark bg-content-primary flex items-center justify-between rounded border"
          onSubmit={handleSubmit(({ newLinkUrl }) => onFormSubmit(newLinkUrl))}
        >
          <input
            className="link-input border-none"
            id="editor-link-popover-label"
            {...register('newLinkUrl')}
          />

          <button
            aria-label="Save"
            className="text-font-secondary-dark flex-shrink-0 p-4 hover:text-white"
          >
            <Icon
              path={mdiCheck}
              size={1}
            />
          </button>
        </form>
      ) : (
        <div className="link-input border-font-secondary-dark bg-content-primary flex items-center justify-between rounded border">
          <a
            className="text-font-secondary-dark hover:text-primary truncate py-4 pl-4"
            href={linkUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkUrl}
          </a>

          <button
            aria-label="Edit"
            className="text-font-secondary-dark flex-shrink-0 p-4 hover:text-white"
            tabIndex={0}
            onClick={() => setIsEditing(true)}
          >
            <Icon
              path={mdiPencil}
              size={1}
            />
          </button>
        </div>
      )}
    </div>
  );
});

EditorLinkPopoverComponent.displayName = 'FloatingLinkEditorComponent';
