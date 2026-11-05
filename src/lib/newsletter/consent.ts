// Shared by the sign-up form (client) and the API (server). Plain constants only.
//
// The exact consent wording shown next to the checkbox. Bump CONSENT_VERSION whenever
// this text changes; each contact stores the version they agreed to (`consent_version`).
export const CONSENT_VERSION = 'v1';
export const CONSENT_TEXT =
  'Yes, send me the PolishPal newsletter: new lessons, articles and Polish learning tips. I can unsubscribe at any time.';
