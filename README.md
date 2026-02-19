## One-Tap Help
[Caregiver & Guardian View]
![IMG_2022](https://github.com/user-attachments/assets/9211fa32-5ae2-410e-b8e1-d400a3620497)
[Patient View]
![IMG_4162](https://github.com/user-attachments/assets/79a69a49-fd71-4a81-82e7-09a1b3ef487b)

## Inspiration
- We noticed a critical gap in care communication: **friction**. Whether in a home care setting or a hospital, the process of asking for help is often too manual, and the status of that request is opaque. Guardians are anxious, patients feel unheard, and caregivers are overwhelmed. We wanted to strip away the complexity and create a system where help is literally one tap away, and everyone—from the family member at work to the nurse in the hall—is perfectly synced.

## What it does
- One-Tap Help is a unified care coordination platform designed for three distinct roles: Patients, Guardians, and Caregivers.
- **Seamless Onboarding via QR Handshake:** Instead of complex invite codes, Guardians or Patients enter their profile and medical details (including critical health conditions) to generate a secure QR code. Caregivers simply scan this code to instantly "link" and access that patient's dashboard.
- **The Request System:** Patients can trigger requests ranging from low-priority (e.g., "Need Water") to EMERGENCY.
- **Real-Time Status Tracking:** Requests aren't just sent into a void. They move through a clear lifecycle: Pending → Accepted → Completed.
- Caregivers can "Acknowledge" a task so others know it's being handled.
- Guardians can see exactly when a request was resolved.
- **Critical Safety Net (911 Integration):** If an "Emergency" card is triggered, the interface changes drastically. It pins to the top in red and provides a direct, one-tap button to call 911, bridging the gap between local caregiver support and professional emergency services.

## How to Use the App (User Guide)

### Overview
**One-Tap Help** is a simple request system for home care / assisted living.  
The app supports **three roles**:

- **Patient**: sends requests (Water, Bathroom, Food, Help, Emergency)
- **Caretaker**: goes **ON SHIFT**, accepts requests, and marks them complete
- **Guardian**: always sees requests and can accept/complete them as a backup

All requests update in **realtime**.

---

### Patient (Send a Request)

1. Open the app and go to the **Patient** screen.
2. Tap one of the large buttons:
   - **WATER**: patient needs water
   - **BATHROOM**: patient needs help using the washroom
   - **FOOD**: patient needs food
   - **HELP**: general assistance
   - **EMERGENCY**: urgent emergency request
3. After tapping, the request is created and immediately appears for the **Caretaker** and **Guardian**.

---

### Caretaker (On-Shift Workflow)

1. Open the app and go to the **Caretaker** screen.
2. Toggle **ON SHIFT** to start receiving and handling requests.
3. View the realtime list of incoming requests.
4. Tap a request to:
   - **Accept** → mark yourself as the person handling it
   - **Complete** → close the request once finished
5. Toggle **OFF SHIFT** when you are no longer available.

> If the caretaker is **OFF SHIFT**, the **Guardian** can still handle requests.

---

### Guardian (Always-On Backup)

1. Open the app and go to the **Guardian** screen.
2. Requests are always visible in realtime (no shift required).
3. Tap a request to:
   - **Accept** → take over if the caretaker is unavailable
   - **Complete** → mark it resolved

---

### Request Status

- **New / Pending**: request has been created and is waiting
- **Accepted**: someone (Caretaker or Guardian) is handling it
- **Completed**: request has been resolved and closed


## How we built it
- We built One-Tap Help using React Native (Expo) and TypeScript for the frontend, with Firebase powering our backend infrastructure.
- **Real-Time Sync:** We utilized Firebase Realtime Database to handle the request lifecycle. This ensures that the millisecond a Patient taps "Help," the Caregiver's screen updates instantly without needing to refresh.
- **AI-Assisted Development:** We used GitHub Copilot throughout the process. It accelerated the writing of complex TypeScript interfaces and generating the repetitive boilerplate needed for our RequestCard styling and conditional rendering logic.
- **Role Management:** We implemented a state-machine logic for the sign-in flow (Role Selection → Details Form → QR Generation), ensuring that each user type sees only the data relevant to them.
- **QR Integration:** We utilized `react-native-qrcode-svg` to encode patient health forms into JSON strings for instant offline data transfer.

## Challenges we ran into
- **State Complexity:** Managing three different user perspectives in a single codebase was tricky. We had to ensure that a "Guardian" view didn't accidentally leak into a "Caregiver" view.
- **Native Linking:** Implementing the 911 call functionality required handling native device linking (`Linking.openURL('tel:911')`) securely across different devices and ensuring it wouldn't be triggered accidentally.
- **The "Handshake":** Passing complex form data (like 150-word health conditions) via a QR code required careful data structure planning to ensure the scanner could parse it instantly.

## Accomplishments that we're proud of
- **The "QR Handshake":** We successfully turned a tedious sign-up form into a 2-second scan experience.
- **Safety First:** We are proud of the 911 integration. It transforms the app from a simple messenger into a potential life-saving tool.
- **Intelligent UI States:** We refined the RequestCard logic to handle edge cases gracefully—for example, if one caregiver accepts a task, the button updates for everyone else.

## What we learned
- **Copilot is a force multiplier:** Learning to prompt GitHub Copilot effectively (by describing state machines rather than just UI) allowed us to build complex features like the multi-role sign-in flow in half the time.
- **Professional Git Workflow:** We moved beyond pushing directly to main. Adopting a proper feature-branch workflow (using checkout -b, staging, and merging) allowed us to develop new features like the QR scanner in isolation without breaking the stable build.
- **Firebase Integration Realities:** We learned that connecting a frontend to Firebase isn't just about reading data; it's about structuring the database correctly. We gained hands-on experience setting up real-time listeners so that the UI reacts instantly to database changes—a critical requirement for an emergency response app.

## What's next for One-Tap Help
- **Advanced Health Intelligence with Presage:** We plan to integrate Presage (HealthAI) to transform the app from a communication tool into a diagnostic one.
- **Vitals Monitoring:** Using the smartphone camera to detect heart rate and stress levels.
- **Pain & Emergency Detection:** Implementing visual analysis to detect signs of pain or physical distress during an emergency call.
- **Smart Checkups:** Running automated daily health checkups that track patient baselines over time.
- **Automated Triage:** Using Presage to assign an emergency rating to requests, prioritizing them based on physiological data rather than just user input.
- **Wearable Integration:** Extending the "One-Tap" interface to Apple Watch and Galaxy Watch so patients don't need to reach for their phones.
- **Push Notifications:** Integrating Cloud Functions to send critical alerts to Caregivers even when the app is closed.


