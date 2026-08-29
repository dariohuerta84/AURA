import { Command } from "@commander-js/extra-typings";
import { Server } from "@modelcontextprotocol/server";
import { McpOptions } from "./lib/mcp/requestContext.js";
export declare const mcp: Command<[], {}, {}>;
export declare function makeServer(options: McpOptions): Server;
//# sourceMappingURL=mcp.d.ts.map