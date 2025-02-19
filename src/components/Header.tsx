function Header({ id, key, value, handleUpdateKey, handleUpdateValue } : { id: any, key: any, value: any, handleUpdateKey: any, handleUpdateValue: any }) {
  return (
    <div className="header">
      <p>
        <span>Key: </span>
        <input value={key} onChange={(e) => handleUpdateKey({ id, newKey: e.target.value })} />
      </p>
      <p>
        <span>Value: </span>
        <input value={value} onChange={(e) => handleUpdateValue({ id, newValue: e.target.value })} />
      </p>
    </div>
  )
}

export default Header;
