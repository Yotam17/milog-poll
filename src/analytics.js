import mixpanel from "mixpanel-browser";

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  persistence: "localStorage",
});

export function track(event, props = {}) {
  mixpanel.track(event, props);
}
