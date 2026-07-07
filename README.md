# 🛰️ CatfishRadar

A mobile-first behavioral heuristics scanner and dynamic relationship fraud analysis engine built entirely on the **Expo (React Native)** ecosystem. 

CatfishRadar acts as a lightweight, privacy-focused shield designed to detect conversational social engineering, timeline anomalies, and compromised image assets in real time—completely client-side.

---

## 🚀 The Core Problem & Use Case
Online relationship fraud and social engineering schemes are growing increasingly sophisticated. Conventional security tools focus on static network layers (like IP flags), which completely fail to capture the behavioral warning signs of an active identity scammer.

**CatfishRadar** delivers a mobile-first scanning solution targeting three distinct fraud vectors simultaneously:
1. **Contextual Identity Discrepancies:** Flags chronological mismatches (e.g., claiming to be a teenager while concurrently attending an Ivy League institution).
2. **Social Engineering Urgency Triggers:** Uses dynamic regex pattern matches to identify toxic urgency scripts and immediate pushes to switch off-platform (e.g., WhatsApp, Telegram).
3. **Asset Metadata Degradation:** Probes local image files to identify web-scraped compression footprints and missing native camera EXIF headers, indicating unoriginal or stolen visual profiles.

---

## 🛠️ Technical Architecture & Expo Implementation

This application is engineered specifically for **native mobile execution** and deliberately avoids basic web-wrapping. It utilizes key primitives within the Expo ecosystem to operate securely, quickly, and locally.

### 🌟 Deep Dive Vector Engine

* **`expo-image-picker` & System Asset Access:** Provides seamless interface interaction to safely query local camera roll components and access photo streams.
* **`expo-file-system` & Cryptographic Header Inspection:** Rather than passing massive images to heavy cloud APIs, the app streams local file info asynchronously. It scans for native camera `EXIF` or `JFIF` hardware stamps, raising threats when indicators show web-scraping footprints (e.g., Pinterest cache signatures, social network compression markers, or screenshot structures).
* **Multi-Heuristic Priority Parser:** Runs custom string pattern matching arrays alongside synchronous state vector tracking (`textRisk`, `urgencyRisk`, `imageRisk`) to compute a combined **Deception Risk Threat Percentage** dynamically on the device.

---

## 📊 Risk Diagnostic Breakdown

The app transforms raw underlying execution diagnostics into a clean, intuitive, mobile-first scorecard visual layout.

* **Identity Context Index:** Monitors high-risk financial, professional, or authority status claims.
* **Social Urgency Vectors:** Catches immediate conversational velocity escalations or authentication bypass attempts.
* **Metadata/EXIF Stamps:** Reveals when a profile photo is a web download, screenshot, or social cache instead of an authentic camera snap.

---

## 🏃‍♂️ Dev Operations & Quickstart

### Prerequisites
Make sure you have Node.js installed on your development machine.

### Installation & Launch
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone [https://github.com/notanonymouse/catfish-radar.git](https://github.com/notanonymouse/catfish-radar.git)
   cd catfish-radar