/**
 * Outbound notifications (Slack + email).
 * Falls back to no-op + console log when keys are not configured, so dev
 * environments don't fail. Wire real keys in .env.local.
 */
type Notification = {
  title: string;
  fields: Array<{ name: string; value: string }>;
};

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? "";
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "dowonlaw@dowonlaw.com";
const NOTIFY_FROM = process.env.NOTIFY_FROM ?? "도원 웹사이트 <noreply@dowonlaw.com>";

export async function notifyConsultation(n: Notification) {
  const slackPromise = postSlack(n).catch((e) => console.error("[slack]", e));
  const emailPromise = sendEmail(n).catch((e) => console.error("[email]", e));
  await Promise.all([slackPromise, emailPromise]);
}

async function postSlack(n: Notification) {
  if (!SLACK_WEBHOOK_URL) {
    console.log("[slack:noop]", n.title);
    return;
  }
  const blocks = [
    { type: "header", text: { type: "plain_text", text: n.title } },
    {
      type: "section",
      fields: n.fields.map((f) => ({
        type: "mrkdwn",
        text: `*${f.name}*\n${f.value || "—"}`,
      })),
    },
  ];
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: n.title, blocks }),
  });
  if (!res.ok) throw new Error(`Slack webhook ${res.status}`);
}

async function sendEmail(n: Notification) {
  if (!RESEND_API_KEY) {
    console.log("[email:noop]", n.title);
    return;
  }
  const html =
    `<h2>${n.title}</h2><dl>` +
    n.fields
      .map(
        (f) =>
          `<dt style="font-weight:600">${f.name}</dt><dd style="margin:0 0 12px">${
            f.value || "—"
          }</dd>`
      )
      .join("") +
    "</dl>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: NOTIFY_EMAIL,
      subject: n.title,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}
