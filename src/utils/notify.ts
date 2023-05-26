// show browser / native notification
export function notify(title: string, body: string) {
  new Notification(title, { body: body || "" });
}
