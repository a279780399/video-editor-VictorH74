import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

interface ButtonProps {
  first?: boolean;
  last?: boolean;
  rounded?: boolean;
  selected?: boolean;
  onClick: () => void;
  children: React.ReactElement | string;
  className?: string;
  iconClassName?: string;
}

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  label?: string;
}

const defaultBg = "#00000080";
const hoverBg = "#0000009b";
const selectedBg = "#000000a7";

const createButton =
  (props: Omit<ButtonProps, "children">) =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: React.ReactElement }) =>
    (
      <button
        style={{
          backgroundColor: props.selected ? selectedBg : defaultBg,
        }}
        className={`duration-150 p-3 text-white ${
          props.rounded
            ? "rounded-lg"
            : props.first
            ? "rounded-s-lg"
            : props.last
            ? "rounded-e-lg"
            : ""
        } ${props.className}`}
        onClick={props.onClick}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = props.selected
            ? selectedBg
            : defaultBg)
        }
      >
        {children}
      </button>
    );

export const Button: React.FC<ButtonProps> = (props) => {
  return createButton(props)({children: props.children as any});
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  ...rest
}) => {
  return createButton(rest)({
    children: (
      <>
        <Icon className={rest.iconClassName} />
        {rest.label && <span className="ml-2">{rest.label}</span>}
      </>
    ),
  });
};
