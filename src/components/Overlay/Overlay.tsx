import "./Overlay.css";
import { useCallback, useEffect } from "react";

interface Props {
  isOpened: boolean;
  children: React.ReactNode;
}

function Overlay({ isOpened, children }: Props) {
  function closeOverlay() {
    // close Overlay function
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeOverlay();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown]);

  return (
    <div
      className={`overlay ${isOpened ? "" : "overlay_hidden"}`}
      onClick={closeOverlay}
    >
      <div
        className="overlay__content-wrapper"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
        }}
      >
        {children}
        <input
          className="close-button"
          type="image"
          onClick={closeOverlay}
          src="CloseButton.svg"
          value={"X"}
        />
      </div>
    </div>
  );
}

export default Overlay;
