import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faGoogle,
  faExpeditedssl
} from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";

export const Button = ({
  block,
  btnText,
  className,
  color,
  fn,
  height,
  icon,
  isDisabled,
  isSpinning,
  link,
  outline,
  size,
  spinnerColor = "dark",
  spinnerSize = "sm",
  spinnerType = "border",
  type = "button",
  width
}) => {
  const getIcon = () => {
    switch (icon) {
      case "apple":
        return faApple;
      case "google":
        return faGoogle;
      case "password":
        return faExpeditedssl;
      default:
        break;
    }
  };

  const makeItClassy = () => {
    let btnClass = `flex-d align-items-center btn ${className}`;
    if (size) {
      btnClass += ` btn-${size}`;
    }
    if (block && !link) {
      btnClass += ` btn-block`;
    }
    if (outline && !link) {
      btnClass += ` btn-outline-${color}`;
    }
    if (link && !block && !outline) {
      btnClass += ` btn-link text-${color}`;
    }
    if (!link) {
      btnClass += ` btn-${color}`;
    }
    return btnClass;
  };
  return (
    <button
      className={makeItClassy()}
      disabled={isDisabled}
      onClick={fn ? () => fn() : null}
      style={{
        height: height ? `${height}px` : "",
        width: width ? `${width}px` : ""
      }}
      type={type}
    >
      {isSpinning ? (
        <div
          className={` spinner-${spinnerType} spinner-${spinnerType}-${spinnerSize} text-${spinnerColor} mr-2`}
          role="status"
          style={{ marginBotom: "4px" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      ) : icon ? (
        <span className="mr-2">
          <Icon icon={getIcon()} />
        </span>
      ) : null}
      {btnText}
    </button>
  );
};

Button.propTypes = {
  btnText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  color: PropTypes.oneOf([
    "danger",
    "dark",
    "info",
    "light",
    "primary",
    "secondary",
    "success",
    "warning"
  ]),
  block: PropTypes.bool,
  height: PropTypes.number,
  icon: PropTypes.oneOf(["apple", "google", "password"]),
  spinerColor: PropTypes.oneOf(["light", "dark"]),
  spinerType: PropTypes.oneOf(["border", "grow"]),
  spinerSize: PropTypes.oneOf(["sm"]),
  isSpinning: PropTypes.bool,
  fn: PropTypes.func,
  outline: PropTypes.bool,
  size: PropTypes.oneOf(["lg", "sm"]),
  width: PropTypes.number
};
