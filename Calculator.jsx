import React, { useState } from "react";
import "./Calculator.css";

function Calculator() {
  const [value, setValue] = useState("");
  const [isOn, setIsOn] = useState(false); // calculator ON/OFF

  // Safe eval function
  const safeEval = (expr) => {
    try {
      // allow only numbers and math operators
      if (/^[0-9+\-*/().% ]+$/.test(expr)) {
        return Function(`return ${expr}`)();
      } else {
        return "Error";
      }
    } catch {
      return "Error";
    }
  };

  const handleEqual = () => {
    if (isOn) {
      const result = safeEval(value);
      setValue(result.toString());
    }
  };

  const handleButtonClick = (val) => {
    if (isOn) setValue(value + val); // append number/operator
  };

  const handleSquareRoot = () => {
    if (isOn) {
      const result = safeEval(value);
      if (result !== "Error") setValue(Math.sqrt(result).toString());
      else setValue("Error");
    }
  };

  const handlePercent = () => {
    if (isOn) {
      const result = safeEval(value);
      if (result !== "Error") setValue((result / 100).toString());
      else setValue("Error");
    }
  };

  return (
    <div className="container">
      {/* Heading */}
      <h1 className="heading">CALCULATOR APP</h1>

      <div className="calculator">
        {/* Display */}
        <div className="display">
          {isOn ? value || "0" : ""} {/* show value if ON, otherwise empty */}
        </div>

        {/* ON/OFF buttons */}
        <div className="on-off-buttons">
          <button onClick={() => setIsOn(true)}>ON</button>
          <button onClick={() => { setIsOn(false); setValue(""); }}>OFF</button>
        </div>

        {/* Calculator buttons */}
        <form>
          <div>
            <input type="button" value="AC" onClick={() => isOn && setValue("")} disabled={!isOn} />
            <input type="button" value="DE" onClick={() => isOn && setValue(value.slice(0, -1))} disabled={!isOn} />
            <input type="button" value="%" onClick={handlePercent} disabled={!isOn} />
            <input type="button" value="÷" onClick={() => handleButtonClick("/")} disabled={!isOn} />
          </div>

          <div>
            <input type="button" value="7" onClick={() => handleButtonClick("7")} disabled={!isOn} />
            <input type="button" value="8" onClick={() => handleButtonClick("8")} disabled={!isOn} />
            <input type="button" value="9" onClick={() => handleButtonClick("9")} disabled={!isOn} />
            <input type="button" value="*" onClick={() => handleButtonClick("*")} disabled={!isOn} />
          </div>

          <div>
            <input type="button" value="4" onClick={() => handleButtonClick("4")} disabled={!isOn} />
            <input type="button" value="5" onClick={() => handleButtonClick("5")} disabled={!isOn} />
            <input type="button" value="6" onClick={() => handleButtonClick("6")} disabled={!isOn} />
            <input type="button" value="-" onClick={() => handleButtonClick("-")} disabled={!isOn} />
          </div>

          <div>
            <input type="button" value="1" onClick={() => handleButtonClick("1")} disabled={!isOn} />
            <input type="button" value="2" onClick={() => handleButtonClick("2")} disabled={!isOn} />
            <input type="button" value="3" onClick={() => handleButtonClick("3")} disabled={!isOn} />
            <input type="button" value="+" onClick={() => handleButtonClick("+")} disabled={!isOn} />
          </div>

          <div>
            <input type="button" value="0" onClick={() => handleButtonClick("0")} disabled={!isOn} />
            <input type="button" value="." onClick={() => handleButtonClick(".")} disabled={!isOn} />
            <input type="button" value="√" onClick={handleSquareRoot} disabled={!isOn} />
            <input type="button" value="=" className="equal" onClick={handleEqual} disabled={!isOn} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Calculator;
