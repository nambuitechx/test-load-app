function Body({ id, k, v, handleUpdateKey, handleUpdateValue } : { id: any, k: any, v: any, handleUpdateKey: any, handleUpdateValue: any }) {
  return (
    <div className="body">
      <p>
        <span>Key: </span>
        <input value={k} onChange={(e) => handleUpdateKey({ id, newKey: e.target.value })} />
      </p>
      <p>
        <span>Value: </span>
        <input value={v} onChange={(e) => handleUpdateValue({ id, newValue: e.target.value })} />
      </p>
    </div>
  )
}
  
  export default Body;
  