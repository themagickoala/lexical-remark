import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type ContextState = {
  isMarkdownMode: boolean;
  markdownValue: string;
  setIsMarkdownMode: Dispatch<SetStateAction<boolean>>;
  setMarkdownValue: Dispatch<SetStateAction<string>>;
  setShowImageModal: Dispatch<SetStateAction<boolean>>;
  setShowVideoModal: Dispatch<SetStateAction<boolean>>;
  showImageModal: boolean;
  showVideoModal: boolean;
};

const EditorContext = createContext<ContextState | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownValue, setMarkdownValue] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <EditorContext.Provider
      value={{
        isMarkdownMode,
        markdownValue,
        setIsMarkdownMode,
        setMarkdownValue,
        setShowImageModal,
        setShowVideoModal,
        showImageModal,
        showVideoModal,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);

  if (context === undefined) {
    throw new Error('useEditorContext must be wrapped in an EditorProvider');
  }

  return context;
};
