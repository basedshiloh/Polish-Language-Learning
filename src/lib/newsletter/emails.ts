// Transactional emails for the newsletter sign-up. Plain, table-based HTML with inline
// styles so it renders in Gmail/Outlook; every email also has a text part.
// Brand: crimson #D91F3B, ink #1E2132, muted #6B7084, line #E5E7EE.

const CRIMSON = '#D91F3B';
const INK = '#1E2132';
const MUTED = '#6B7084';

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function layout(origin: string, preheader: string, inner: string, footer: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PolishPal</title></head>
<body style="margin:0;padding:0;background:#F6F7FA;">
<span style="display:none!important;opacity:0;color:transparent;max-height:0;overflow:hidden;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7FA;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:2px solid #E5E7EE;border-bottom-width:4px;border-radius:20px;">
<tr><td style="padding:28px 32px 0 32px;">
<a href="${origin}/" style="text-decoration:none;"><img src="${origin}/icon-192.png" width="44" height="44" alt="PolishPal" style="display:inline-block;border:0;border-radius:10px;vertical-align:middle;">
<span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:${INK};vertical-align:middle;padding-left:8px;">Polish<span style="color:${CRIMSON};">Pal</span></span></a>
</td></tr>
<tr><td style="padding:20px 32px 28px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${INK};">
${inner}
</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;"><tr><td style="padding:16px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};text-align:center;">
${footer}
</td></tr></table>
</td></tr></table>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-radius:14px;background:${CRIMSON};border-bottom:4px solid #A3142B;">
<a href="${href}" style="display:inline-block;padding:14px 26px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;letter-spacing:0.5px;color:#FFFFFF;text-decoration:none;text-transform:uppercase;">${esc(label)}</a>
</td></tr></table>`;
}

export function confirmationEmail(origin: string, email: string, confirmUrl: string) {
  const subject = 'Confirm your PolishPal newsletter subscription';
  const html = layout(
    origin,
    'One click to confirm, then we will send you new Polish lessons and tips.',
    `<h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.25;color:${INK};">Cześć! Please confirm your email</h1>
<p style="margin:0 0 8px 0;">Someone (hopefully you) asked to get the PolishPal newsletter at <strong>${esc(email)}</strong>.</p>
<p style="margin:0;">Click the button to confirm. Until you do, we won't send you anything else.</p>
${button(confirmUrl, 'Confirm subscription')}
<p style="margin:0 0 8px 0;font-size:14px;color:${MUTED};">Or paste this link into your browser:<br><a href="${confirmUrl}" style="color:${CRIMSON};word-break:break-all;">${esc(confirmUrl)}</a></p>
<p style="margin:16px 0 0 0;font-size:14px;color:${MUTED};">The link works for 7 days. If you didn't ask for this, just ignore this email and you won't hear from us.</p>`,
    `PolishPal · free Polish lessons · <a href="${origin}/privacy" style="color:${MUTED};">Privacy</a> · Questions? Reply to this email.`,
  );
  const text = `Cześć! Please confirm your email

Someone (hopefully you) asked to get the PolishPal newsletter at ${email}.
Confirm here (link works for 7 days):
${confirmUrl}

If you didn't ask for this, ignore this email and you won't hear from us.

PolishPal: free Polish lessons. Privacy: ${origin}/privacy`;
  return { subject, html, text };
}

export function welcomeEmail(origin: string, unsubscribeUrl: string) {
  const subject = 'Witaj! You are subscribed to PolishPal';
  const html = layout(
    origin,
    'You are in. Here is where to start while you wait for the next email.',
    `<h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.25;color:${INK};">Witaj! You're subscribed</h1>
<p style="margin:0 0 12px 0;">Thanks for joining. <em>Witaj</em> (VEE-tie) means "welcome". We'll email you when there are new lessons, articles and Polish learning tips.</p>
<p style="margin:0;">While you wait, the free course starts here:</p>
${button(`${origin}/lessons`, 'Start lesson 1')}
<p style="margin:0;">Or look something up in the <a href="${origin}/grammar" style="color:${CRIMSON};font-weight:bold;">grammar reference</a> and the <a href="${origin}/blog" style="color:${CRIMSON};font-weight:bold;">blog</a>.</p>
<p style="margin:16px 0 0 0;font-size:14px;color:${MUTED};">Got a question about Polish or the site? Just reply to this email.</p>`,
    `You're getting this because you subscribed on polishpal.pl. <a href="${unsubscribeUrl}" style="color:${MUTED};">Unsubscribe</a> · <a href="${origin}/privacy" style="color:${MUTED};">Privacy</a>`,
  );
  const text = `Witaj! You're subscribed

Thanks for joining. "Witaj" (VEE-tie) means "welcome". We'll email you when there are new lessons, articles and Polish learning tips.

Start lesson 1: ${origin}/lessons
Grammar reference: ${origin}/grammar
Blog: ${origin}/blog

Got a question? Just reply to this email.

Unsubscribe: ${unsubscribeUrl}
Privacy: ${origin}/privacy`;
  return { subject, html, text };
}
