# Privacy Policy — TL;DR.ai (Browser Extension)

**Last updated:** [DATE]  
**Contact:** [YOUR_EMAIL_OR_CONTACT_PAGE]

## Summary

TL;DR.ai is a browser extension that helps you summarize and analyze the **currently open web page** using artificial intelligence. **This extension does not operate a backend server controlled by the developer to collect your personal data.** Processing is done either on your device (local storage) or by **third-party AI providers** that **you** choose and authenticate with your own API keys.

## What data is processed

When you click the summarize action, the extension may:

1. **Read visible text** from the active page (main content and, where detected, comment-like blocks) to build a prompt.
2. **Send that text, the page URL, and your instructions** to an external AI API **you configured** (Google Gemini, OpenAI, and/or Anthropic Claude), over HTTPS.
3. **Store locally** in your browser (via `chrome.storage.local`):
   - Your **API keys** for the selected providers (encrypted at rest by the browser’s storage; not transmitted to the developer).
   - **Preferences**: interface language, selected model.
   - **Cached analysis results** per normalized page URL and per model, so reopening the popup can show the last result without calling the API again.

The extension **does not** sell your data. The developer **does not** receive copies of your page content or API keys on a private server as part of normal use of this extension.

## Third-party services

If you enter API keys and use the corresponding model, your prompts are processed under the **privacy policy and terms** of:

- **Google** (Gemini API / Generative Language API) — `https://ai.google.dev/` / Google Cloud terms as applicable.
- **OpenAI** — `https://openai.com/policies`.
- **Anthropic** — `https://www.anthropic.com/legal/privacy`.

You are responsible for compliance with those providers’ rules and for keeping your keys secure.

## Permissions (why they exist)

- **activeTab**: Access the tab when you use the extension so it can read page content for analysis.
- **storage**: Save your settings, API keys, and optional local cache of results.
- **Host permission `<all_urls>`**: Inject the content script (floating button / modal) on pages where you browse; the script only runs in pages you visit and does not imply that all sites are contacted remotely by the developer.

## Optional links

If the UI includes a **donation** or support link, it opens the URL configured in the extension (e.g. Ko-fi, PayPal) in a new tab; that site has its own privacy policy.

## Fonts

The popup may load fonts from **Google Fonts** (see Content Security Policy in the extension). Google may receive technical data typical of font requests as described in Google’s policies.

## Children’s privacy

The extension is not directed at children under 13 (or the minimum age in your jurisdiction). Do not use it if you are not old enough to consent to processing of data in your region.

## Changes

We may update this policy when the extension’s behavior changes. The “Last updated” date will change accordingly. Continued use after changes means you accept the updated policy.

## Your choices

- Remove stored data: use Chrome’s settings to clear **extension data** for TL;DR.ai, or uninstall the extension.
- Stop sending data to AI providers: remove your API keys from the extension or stop using the summarize feature.

---

*This text is provided as a template for the TL;DR.ai project. Have it reviewed by a qualified professional if you need legal certainty.*
