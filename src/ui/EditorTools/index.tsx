import React from "react";

import Tooltip from "@mui/material/Tooltip";
import useEditorTools from "./useEditorTools";
// import { IconButton } from "@/components/buttons";

const defaultBg = "#00000080";
const hoverBg = "#0000009b";
const selectedBg = "#000000a7";

export default React.memo(function EditorTools() {
  const { tools, setToolAction, toolAction } = useEditorTools();

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") console.log("EditorTools");
  });

  return (
    <div className="flex gap-[2px]">
      {tools.map(({ icon: Icon, ...rest }, i) => (
        <div className="relative" key={i}>
          <div
            style={{ opacity: rest.modified ? 1 : 0 }}
            className="duration-150 contents-[''] size-2 absolute right-1 top-1 bg-green-300 rounded-full"
          />
          <Tooltip title={rest.label} placement="top">
            {/* 
          <IconButton
            icon={Icon}
            first={i === 0}
            last={i === tools.length - 1}
            selected={toolAction === rest.action}
            onClick={() => {
              if (rest.action !== toolAction) setToolAction(rest.action);
            }}
          /> */}
            <button
              style={{
                backgroundColor:
                  toolAction === rest.action ? selectedBg : defaultBg,
              }}
              onClick={() => {
                if (rest.action !== toolAction) setToolAction(rest.action);
              }}
              className={`duration-150 p-3 text-white ${
                i === 0
                  ? "rounded-s-lg"
                  : i === tools.length - 1
                  ? "rounded-e-lg"
                  : ""
              } `}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverBg)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  toolAction === rest.action ? selectedBg : defaultBg)
              }
            >
              <Icon />
            </button>
          </Tooltip>
        </div>
      ))}
    </div>
  );
});
