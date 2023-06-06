import { useState } from 'react';

import { Editor } from './editor/components/editor';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <Editor />
    </>
  );
}

export default App;
