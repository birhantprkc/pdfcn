"use client";

import { ListBlocksTool, GetBlockTool, PreviewBlockTool } from "./block-tools";
import {
  OpenDocsTool,
  ListDocsTool,
  GetInstallCommandTool,
} from "./docs-tools";
import { GeneratePdfTool } from "./pdf-tool";
import { FetchRegistryTool } from "./registry-tool";
import { SearchComponentsTool } from "./search-tool";
import { ListThemesTool, GetThemeTool, ApplyThemeTool } from "./theme-tools";

export const WebMcpTools = () => (
  <>
    <ListThemesTool />
    <GetThemeTool />
    <ApplyThemeTool />
    <ListBlocksTool />
    <GetBlockTool />
    <PreviewBlockTool />
    <GeneratePdfTool />
    <SearchComponentsTool />
    <OpenDocsTool />
    <ListDocsTool />
    <GetInstallCommandTool />
    <FetchRegistryTool />
  </>
);
