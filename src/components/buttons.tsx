import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import useVideoMetadataCtx from "@/hooks/useVideoMetadataCtx";

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

export const defaultBg = "#00000060";
export const hoverBg = "#176B87";
export const selectedBg = "#176B87";

const BaseBtn: React.FC<ButtonProps> = (props) => (
  <button
    style={{
      backgroundColor: props.selected ? selectedBg : defaultBg,
    }}
    className={`duration-150 p-3 text-gray-200 ${
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
    {props.children}
  </button>
);

export const Button: React.FC<ButtonProps> = (props) => <BaseBtn {...props} />;

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  ...rest
}) => (
  <BaseBtn {...rest}>
    <div>
      <Icon className={rest.iconClassName} />
      {label && <span className="ml-2">{label}</span>}
    </div>
  </BaseBtn>
);

// eslint-disable-next-line react/display-name
export const ClearBtn = React.memo(() => {
  const { setVideoUrl } = useVideoMetadataCtx();

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") console.log("ClearBtn");
  });

  return (
    <button
      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-200"
      onClick={() => setVideoUrl(null)}
    >
      <ClearIcon sx={{ fontSize: 35 }} />
    </button>
  );
});
