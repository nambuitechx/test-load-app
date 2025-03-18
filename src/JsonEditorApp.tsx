import { useState } from 'react';
import JsonEditor from './components/JsonEditor'

function App() {
  const [json, setJson] = useState({
    name: "John",
    age: 30,
    address: { city: "New York", zip: "10001" },
    hobbies: ["reading", { type: "gaming", platform: "PC" }],
  });

  return (
    <div>
      <h2>JSON Editor</h2>
      <JsonEditor jsonData={json} onChange={setJson} />
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </div>
  );
}

export default App;
