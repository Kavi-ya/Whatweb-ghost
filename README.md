# 👻 WhatsApp Ghost Mode — Chrome Extension

A powerful, fully reversible Chrome extension that lets you read WhatsApp Web messages completely invisibly. It blocks read receipts ("blue ticks") with a convenient on-screen toggle—no page refreshes required!

---

## ✨ Features

- **Toggle On-the-Fly** — A floating button in the bottom-left corner lets you turn Ghost Mode ON or OFF instantly.
- **Bulletproof Blocking** — Intercepts WhatsApp's internal scroll detection (`IntersectionObserver`) and window visibility APIs so it never knows you are looking at the chat.
- **Instant "Seen" Trigger** — When you turn Ghost Mode OFF, the extension automatically wakes up WhatsApp to instantly send the "seen" notification for the chat you are currently looking at.
- **No Page Refreshes** — Seamlessly transition between invisible and normal modes without reloading your browser tab.

---

## 🛠️ How it Works

WhatsApp relies on two main things to know if you've read a message:
1. Knowing if your browser tab is currently active/focused.
2. Knowing if the specific message has scrolled into your screen view.

When **Ghost Mode is ON**, this extension tricks WhatsApp into thinking your browser window is permanently minimized, and visually blocks WhatsApp's code from "seeing" that the messages are on your screen. 
When **Ghost Mode is OFF**, it restores normal browser behavior and forces a micro-scroll to wake WhatsApp up.

---

## 📦 Installation (Chrome / Edge / Brave)

1. Open your browser and navigate to the extensions page: `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer Mode** (usually a toggle switch in the top-right corner).
3. Click the **"Load unpacked"** button.
4. Select the folder containing this extension's files.
5. Open or completely refresh [web.whatsapp.com](https://web.whatsapp.com) (Press `F5` or `Ctrl+R`).

---

## 🎮 Usage

1. Open WhatsApp Web.
2. Look at the bottom-left corner of your screen for the Toggle Button.
3. **🟢 Ghost Mode: ON** — You can click on chats, read new messages, scroll through history, and the sender will *never* get a blue tick.
4. **🔴 Ghost Mode: OFF** — WhatsApp behaves exactly like normal. If you want to intentionally leave someone on "Read", simply open their chat and click the toggle to OFF.

---

## ⚠️ Important Notes

- **Always Refresh After Updating:** If you make changes to the extension's code, you *must* reload the extension in `chrome://extensions` AND completely refresh your WhatsApp Web tab. Ghost Mode modifies core browser APIs that only load when the page first starts.
- **Typing Indicators:** This extension focuses on blocking *read receipts*. If you start typing a reply in the text box, WhatsApp may still show "typing..." to the other person.

---

## 📝 Disclaimer

This extension is built for educational and personal use only. It modifies the local DOM environment in your browser and does not intercept encrypted network traffic. Use responsibly and in accordance with WhatsApp's Terms of Service.