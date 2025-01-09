import { useState } from "react";

export default function ToggleButton({ onToggle }) {
  const [toggled, setToggled] = useState(false);

  const handleClick = () => {
    setToggled(!toggled);
    onToggle(!toggled); // Call the parent function to notify the state changes 
  };

  return (
    <button
      className={`${
        toggled ? "bg-[#15b58e]" : "bg-[#b7b9ba]"
      } border border-[#aaa] rounded-full w-[45px] h-[17px] transition-all ease-in-out duration-150 cursor-pointer shadow-md relative`}
      onClick={handleClick}
    >
      <div
        className={`w-[10px] h-[10px] bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 transition-all duration-150 ${
          toggled ? "left-[18px]" : "left-[3px]"
        }`}
      ></div>
    </button>
  );
}
