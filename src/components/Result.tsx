function Result({ result } : { result: any }) {
    return (
      <div className="result">
        <p>Status {result.status}</p>
      </div>
    )
  }
  
  export default Result;
  