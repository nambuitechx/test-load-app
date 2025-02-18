import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Header from './components/Header';

// headers format
/*
[{ id: "string", key: "string", "value": "string" }]

*/

interface IHeader {
  id: string;
  key: string;
  value: string;
}

interface IUpdateKeyHeader {
  id: string;
  newKey: string;
}

interface IUpdateValueHeader {
  id: string;
  newValue: string;
}

function App() {
  const [headers, setHeaders] = useState<IHeader[]>([])

  const addHeader = () => {
    setHeaders([
      ...headers,
      { id: uuidv4(), key: "", value: "" }
    ])
  }

  const updateKey = ({ id, newKey } : IUpdateKeyHeader) => {
    const newHeaders = headers.map((header: IHeader) => {
      if (header.id !== id) {
        return header
      } else {
        return { id: header.id, key: newKey, value: header.value }
      }
    });
    setHeaders(newHeaders)
  }

  const updateValue = ({ id, newValue } : IUpdateValueHeader) => {
    const newHeaders = headers.map((header: IHeader) => {
      if (header.id !== id) {
        return header
      } else {
        return { id: header.id, key: header.key, value: newValue }
      }
    });
    setHeaders(newHeaders)
  }

  return (
    <div>
      <div>
        <p>
          URL: <input />
        </p>
      </div>
      <br />

      <div>
        <p>
          Method: <input />
        </p>
      </div>
      <br />

      <div>
        <button onClick={() => addHeader()}>Add header</button>
      </div>
      <div>
        {headers.length > 0 && headers.map((header: any, index: number) => (
          <div id={String(index)}>
            <Header
              id={header.id}
              key={header.key}
              value={header.value}
              handleUpdateKey={updateKey}
              handleUpdateValue={updateValue}
            />
          </div>
        ))
        }
      </div>
    </div>
  )
}

export default App;
