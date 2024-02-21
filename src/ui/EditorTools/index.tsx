import React from "react";

import Tooltip from "@mui/material/Tooltip";
import useEditorTools from "./useEditorTools";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
import { IconButton } from "@/components/buttons";

export default function EditorTools() {
  const { tools } = useEditorTools();
  const { toolAction, setToolAction } = useVideoEditorCtx();

  return (
    <div className="w-full p-4 flex justify-center gap-[2px] mt-7">
      {tools.map(({ icon: Icon, ...rest }, i) => (
        <Tooltip title={rest.label} placement="bottom" key={i}>
          <IconButton
            icon={Icon}
            first={i === 0}
            last={i === tools.length - 1}
            selected={toolAction === rest.action}
            onClick={() => {
              if (rest.action !== toolAction) setToolAction(rest.action);
            }}
          />
        </Tooltip>
      ))}
    </div>
  );
}
