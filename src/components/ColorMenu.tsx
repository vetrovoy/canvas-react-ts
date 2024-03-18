import { palette } from "../constants/palette";

type TColorMenu = {
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
  isColorMenuVisible?: boolean;
};

export default function ColorMenu({
  selectedColor = "",
  onColorSelect,
  isColorMenuVisible = false,
}: TColorMenu) {
  const handleColorClick = (color: string) => {
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <>
      {isColorMenuVisible && (
        <div className="color-menu-container">
          <div className="color-menu">
            {Object.values(palette).map((color) => {
              return (
                <div
                  key={color}
                  onClick={() => handleColorClick(color)}
                  className="color-menu-item"
                  style={{
                    backgroundColor: color,
                    border: `2px solid ${color.toLocaleLowerCase() === selectedColor.toLocaleLowerCase() ? "black" : "transparent"}`,
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
