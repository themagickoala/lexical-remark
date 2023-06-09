import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';

export default function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return (
    <div className="p-4 mt-4 rounded bg-slate-600">
      <TreeView
        editor={editor}
        timeTravelButtonClassName="debug-timetravel-button"
        timeTravelPanelButtonClassName="debug-timetravel-panel-button"
        timeTravelPanelClassName="debug-timetravel-panel"
        timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
        treeTypeButtonClassName="debug-treetype-button"
        viewClassName="tree-view-output"
      />
    </div>
  );
}
