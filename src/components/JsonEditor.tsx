import React, { useState, useRef } from "react";

// Define JSON value types
type JsonValue = string | number | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

interface JsonEditorProps {
  jsonData: JsonObject | JsonArray;
  onChange: any;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ jsonData, onChange }) => {
  const isArray = Array.isArray(jsonData);
  const [data, setData] = useState<JsonObject | JsonArray>(jsonData);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Function to handle value changes
  const handleChange = (key: string | number, value: JsonValue) => {
    let updatedData;
    if (isArray) {
      updatedData = [...(data as JsonArray)];
      updatedData[key as number] = value;
    } else {
      updatedData = { ...(data as JsonObject), [key as string]: value };
    }
    setData(updatedData);
    onChange(updatedData);
  };

  // Function to handle type changes
  const handleTypeChange = (key: string | number, newType: string) => {
    let updatedValue: JsonValue;

    // Clear children before changing type
    if (newType === "object") {
      updatedValue = {}; // Empty object
    } else if (newType === "array") {
      updatedValue = []; // Empty array
    } else if (newType === "number") {
      updatedValue = 0; // Default number
    } else {
      updatedValue = "value"; // Default text
    }

    handleChange(key, updatedValue);
  };

  // Function to add new fields
  const handleAddField = () => {
    if (isArray) {
      handleChange((data as JsonArray).length, "value");
    } else {
      let newKey = "key";
      let counter = 1;
      while ((data as JsonObject).hasOwnProperty(newKey)) {
        newKey = `key${counter}`;
        counter++;
      }
      handleChange(newKey, "value");
    }
  };

  // Function to remove fields
  const handleRemoveField = (key: string | number) => {
    let updatedData;
    if (isArray) {
      updatedData = [...(data as JsonArray)];
      (updatedData as JsonArray).splice(key as number, 1);
    } else {
      updatedData = { ...(data as JsonObject) };
      delete (updatedData as JsonObject)[key as string];
    }
    setData(updatedData);
    onChange(updatedData);
  };

  return (
    <div style={{ paddingLeft: "20px", borderLeft: "2px solid #ccc", marginBottom: "10px" }}>
      {(isArray ? (data as JsonArray).map((value, index) => [index, value]) : Object.entries(data)).map(
        ([key, value]) => {
          const type = Array.isArray(value)
            ? "array"
            : typeof value === "object"
            ? "object"
            : typeof value;

          return (
            <div key={String(key)} style={{ marginBottom: "5px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {/* Type Dropdown with Disabled Options */}
                <select value={type} onChange={(e) => handleTypeChange(key as any, e.target.value)}>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="object" disabled={type === "array"}>Object</option>
                  <option value="array" disabled={type === "object"}>Array</option>
                </select>

                {/* Key Input (Only for Objects) */}
                {!isArray && (
                  <input
                    type="text"
                    value={key as any}
                    ref={(el) => (inputRefs.current[key as string] = el)}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      if (newKey && !Object.prototype.hasOwnProperty.call(data, newKey)) {
                        const updatedData: JsonObject = { ...(data as JsonObject), [newKey]: value };
                        delete updatedData[key as string];
                        setData(updatedData);
                        onChange(updatedData);
                        setTimeout(() => inputRefs.current[newKey]?.focus(), 0);
                      }
                    }}
                    style={{ width: "100px" }}
                  />
                )}

                {/* Value Input / Nested Editor */}
                {type === "object" ? (
                  <button onClick={() => handleRemoveField(key as any)}>❌</button>
                ) : type === "array" ? (
                  <button onClick={() => handleRemoveField(key as any)}>❌</button>
                ) : (
                  <>
                    <input
                      type={type === "number" ? "number" : "text"}
                      value={String(value)}
                      onChange={(e) =>
                        handleChange(key as any, type === "number" ? Number(e.target.value) : e.target.value)
                      }
                    />
                    <button onClick={() => handleRemoveField(key as any)}>❌</button>
                  </>
                )}
              </div>

              {/* Indented Child Components */}
              {(type === "object" || type === "array") && (
                <div style={{ marginLeft: "30px", borderLeft: "2px solid #ddd", paddingLeft: "10px", marginTop: "5px" }}>
                  <JsonEditor jsonData={value as JsonObject | JsonArray} onChange={(newVal: any) => handleChange(key as any, newVal)} />
                </div>
              )}
            </div>
          );
        }
      )}
      <button onClick={handleAddField}>➕ Add {isArray ? "Item" : "Field"}</button>
    </div>
  );
};

export default JsonEditor;
