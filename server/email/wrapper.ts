/** Strip leading "The " from archetype titles so interpolations don't read "the The Structured Achiever" */
export function stripThe(title: string): string {
  return title.replace(/^The\s+/i, "");
}

/** Return "a" or "an" based on whether the next word starts with a vowel sound */
export function aOrAn(nextWord: string): string {
  return /^[aeiou]/i.test(nextWord) ? "an" : "a";
}

export function getPublicBaseUrl(): string {
  const raw = process.env.SITE_URL || process.env.APP_URL;
  if (!raw) {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:5000";
    }
    throw new Error("Missing SITE_URL/APP_URL env var. Set SITE_URL in Railway.");
  }
  return raw.replace(/\/$/, "");
}

export function wrapEmail(content: string, options: { preheader?: string; footerNote?: string } = {}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Prolific Personalities</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:system-ui,-apple-system,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f5f5f5;">${options.preheader || ''}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:4px;">
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 40px 24px 40px;border-bottom:1px solid #f0f0f0;">
                    <p style="margin:0;font-family:Georgia,serif;font-size:16px;font-weight:bold;color:#396969;letter-spacing:0.02em;">Prolific Personalities</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px 40px 32px 40px;">
                    ${content}
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px 32px 40px;">
                    <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.6;">— A.<br><span style="color:#666666;font-size:14px;">Founder, Prolific Personalities</span></p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:24px 40px;border-top:1px solid #f0f0f0;background-color:#fafafa;">
                    <p style="margin:0 0 8px 0;font-size:13px;color:#999999;text-align:center;">${options.footerNote || ''}</p>
                    <p style="margin:0;font-size:13px;color:#999999;text-align:center;">
                      <a href="https://prolificpersonalities.com" style="color:#396969;text-decoration:none;">prolificpersonalities.com</a>
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                      <a href="{{unsubscribe_url}}" style="color:#999999;text-decoration:underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function ctaButton(text: string, url: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
      <tr>
        <td>
          <a href="${url}" style="display:inline-block;padding:14px 28px;background-color:#396969;color:#ffffff;text-decoration:none;border-radius:4px;font-family:system-ui,-apple-system,Arial,sans-serif;font-size:15px;font-weight:600;">${text}</a>
        </td>
      </tr>
    </table>`;
}
