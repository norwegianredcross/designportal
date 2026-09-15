// Use the real browser-facing adapter exports without pulling in validateData's
// Next server navigation helpers. Regions and mappings share this same registry.

export { ComponentRegistry } from "@enonic/nextjs-adapter/common/ComponentRegistry";
export { RENDER_MODE, XP_COMPONENT_TYPE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter/common/constants";
export { APP_NAME } from "@enonic/nextjs-adapter/common/env";
export { getUrl } from "@enonic/nextjs-adapter/common/UrlProcessor";
