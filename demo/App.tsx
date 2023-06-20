import { useState } from 'react';

import { Editor } from './editor/components/editor';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-xl pb-4 font-bold">Lexical-remark demo</h1>
      <Editor />
    </>
  );
}

export default App;
