import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

console.log("[Analytics] Token exists:", !!MIXPANEL_TOKEN);

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    persistence: "localStorage",
    debug: true,
  });
  console.log("[Analytics] Mixpanel initialized");
}

export function track(event, props = {}, callback) {
  console.log("[Analytics] track called:", event, props);
  if (!MIXPANEL_TOKEN) {
    console.log("[Analytics] No token, skipping");
    if (callback) callback();
    return;
  }
  mixpanel.track(event, props, { send_immediately: true }, callback);
}
