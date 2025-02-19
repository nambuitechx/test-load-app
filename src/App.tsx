import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import Header from './components/Header';
import Body from './components/Body';
// import Result from './components/Result';

// headers format
/*
[{ id: "string", key: "string", "value": "string" }]

*/

interface IObj {
  id: string;
  key: string;
  value: string;
}

interface IUpdateKey {
  id: string;
  newKey: string;
}

interface IUpdateValue {
  id: string;
  newValue: string;
}

function App() {
  const [loading, setLoading] = useState<boolean>(false)
  const [times, setTimes] = useState<number>(1)
  const [url, setUrl] = useState<string>("http://localhost:8000/api/v1/users")
  const [method, setMethod] = useState<string>("get")
  const [headers, setHeaders] = useState<IObj[]>([])
  const [bodies, setBodies] = useState<IObj[]>([])
  // const [results, setResults] = useState<any[]>([])
  const [resultString, setResultString] = useState<string>("Not vailable")

  // Headers
  const addHeader = () => {
    setHeaders([
      ...headers,
      { id: uuidv4(), key: "", value: "" }
    ])
  }

  const updateHeaderKey = ({ id, newKey } : IUpdateKey) => {
    const newHeaders = headers.map((header: IObj) => {
      if (header.id !== id) {
        return header
      } else {
        return { id: header.id, key: newKey, value: header.value }
      }
    });
    setHeaders(newHeaders)
  }

  const updateHeaderValue = ({ id, newValue } : IUpdateValue) => {
    const newHeaders = headers.map((header: IObj) => {
      if (header.id !== id) {
        return header
      } else {
        return { id: header.id, key: header.key, value: newValue }
      }
    });
    setHeaders(newHeaders)
  }

  // Bodies
  const addBody = () => {
    setBodies([
      ...bodies,
      { id: uuidv4(), key: "", value: "" }
    ])
  }

  const updateBodyKey = ({ id, newKey } : IUpdateKey) => {
    const newBodies = bodies.map((body: IObj) => {
      if (body.id !== id) {
        return body
      } else {
        return { id: body.id, key: newKey, value: body.value }
      }
    });
    setHeaders(newBodies)
  }

  const updateBodyValue = ({ id, newValue } : IUpdateValue) => {
    const newBodies = bodies.map((body: IObj) => {
      if (body.id !== id) {
        return body
      } else {
        return { id: body.id, key: body.key, value: newValue }
      }
    });
    setHeaders(newBodies)
  }

  const populateRequest = async (url: any, method: any, headers: any, body: any) => {
    const start = performance.now()
    let response

    if (method === 'get') {
      response = await axios.get(url, { headers })
    } else if (method === 'post') {
      response = await axios.post(url, body, { headers })
    } else if (method === 'put') {
      response = await axios.put(url, body, { headers })
    } else if (method === 'delete') {
      response = await axios.delete(url, { headers })
    }

    const end = performance.now()
    const elapsed = end - start

    return [response, elapsed]
  }

  // Submit
  const sendRequests = async () => {
    setLoading(true)

    // Populate headers
    const sendHeaders: Record<string, any> = {}
    sendHeaders['Content-Type'] = 'application/json'

    for (let i = 0; i < headers.length; i++) {
      const temp = headers[i]
      sendHeaders[temp.key] = temp.value
    }

    // Populate bodies
    const sendBodies: Record<string, any> = {}

    for (let i = 0; i < bodies.length; i++) {
      const temp = bodies[i]
      sendBodies[temp.key] = temp.value
    }

    const requests = []
    let i = times || 1

    // Populate request
    while (i > 0) {
      if (method === 'get' || method === 'post' || method === 'put' || method === 'delete') {
        requests.push(populateRequest(url, method, sendHeaders, sendBodies))
      } else {
        console.error("Unsuport method")
        break
      }
      i--
    }

    // Send requests
    if (requests.length > 0) {
      const responses: any[] = await Promise.all(requests)
      // console.log(responses)
      const status = []
      const elapsed = []

      for (let i = 0; i < responses.length; i++) {
        status.push(responses[i][0].status)
        elapsed.push(responses[i][1])
      }

      const min = Math.min(...elapsed).toFixed(2)
      const max = Math.max(...elapsed).toFixed(2)
      const sum = elapsed.reduce((a, b) => a + b, 0)
      const ave = (sum / elapsed.length).toFixed(2)

      setResultString(`Min: ${min}ms - Max: ${max}ms - Average: ${ave}ms`)
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <div className='left'>
        <div>
          <button onClick={() => sendRequests()}>Send</button>
        </div>
        <br />

        <div className='times'>
          <p>
            Times: <input type='number' value={times} onChange={(e) => setTimes(Number(e.target.value))} />
          </p>
        </div>

        <div className='url'>
          <p>
            URL: <input value={url} onChange={(e) => setUrl(e.target.value)} />
          </p>
        </div>

        <div className='method'>
          <p>
            Method: <input value={method} onChange={(e) => setMethod(e.target.value.toLowerCase())} />
          </p>
        </div>

        <div className='headers'>
          <p><button onClick={() => addHeader()}>Add header</button></p>
          {headers.length > 0 && headers.map((header: IObj, index: number) => (
            <div key={String(index)}>
              <Header
                id={header.id}
                key={header.key}
                value={header.value}
                handleUpdateKey={updateHeaderKey}
                handleUpdateValue={updateHeaderValue}
              />
            </div>
          ))
          }
        </div>

        <div className='bodies'>
          <p><button onClick={() => addBody()}>Add body</button></p>
          {bodies.length > 0 && bodies.map((body: IObj, index: number) => (
            <div key={String(index)}>
              <Body
                id={body.id}
                key={body.key}
                value={body.value}
                handleUpdateKey={updateBodyKey}
                handleUpdateValue={updateBodyValue}
              />
            </div>
          ))
          }
        </div>
      </div>
      <div className='right'>
          <p>Results</p>
          <p>{loading || resultString}</p>
          {/* {results.length > 0 && results.map((result: any, index: number) => (
            <div key={String(index)}>
              <Result
                result={result}
              />
            </div>
          ))
          } */}
      </div>
    </div>
  )
}

export default App;
