"use strict";
import { jsonToConvex } from "../../values/index.js";
import { performAsyncSyscall } from "./syscall.js";
async function getTransactionMetrics() {
  let syscallJSON;
  try {
    syscallJSON = await performAsyncSyscall("1.0/getTransactionMetrics", {});
  } catch (e) {
    if (e.message?.includes("Unknown async operation")) {
      throw new Error(
        "getTransactionMetrics() can only be called from a query or mutation. It is not available in actions or outside of a Convex function."
      );
    }
    throw e;
  }
  return jsonToConvex(syscallJSON);
}
async function getFunctionMetadata() {
  const { name, componentPath } = await performAsyncSyscall(
    "1.0/getFunctionMetadata",
    {}
  );
  return {
    name,
    componentPath
  };
}
async function getDeploymentMetadata() {
  const syscallJSON = await performAsyncSyscall(
    "1.0/getDeploymentMetadata",
    {}
  );
  const result = jsonToConvex(syscallJSON);
  return {
    name: result.name,
    region: result.region ?? null,
    class: result.class
  };
}
async function getRequestMetadata() {
  const { ip, userAgent, requestId, scheduledFunctionId, authToken } = await performAsyncSyscall("1.0/getRequestMetadata", {});
  return { ip, userAgent, requestId, scheduledFunctionId, authToken };
}
export function setupQueryMeta(visibility) {
  return {
    getFunctionMetadata: async () => ({
      ...await getFunctionMetadata(),
      type: "query",
      visibility
    }),
    getTransactionMetrics,
    getDeploymentMetadata
  };
}
export function setupMutationMeta(visibility) {
  return {
    getFunctionMetadata: async () => ({
      ...await getFunctionMetadata(),
      type: "mutation",
      visibility
    }),
    getTransactionMetrics,
    getDeploymentMetadata,
    getRequestMetadata
  };
}
export function setupActionMeta(visibility) {
  return {
    getFunctionMetadata: async () => ({
      ...await getFunctionMetadata(),
      type: "action",
      visibility
    }),
    getDeploymentMetadata,
    getRequestMetadata
  };
}
//# sourceMappingURL=meta_impl.js.map
