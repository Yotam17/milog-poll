import mixpanel from "mixpanel-browser";

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  persistence: "localStorage",
});

export function track(event, props = {}, callback) {
  mixpanel.track(event, props, { send_immediately: true }, callback);
}
