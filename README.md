# TOLL

### I can't enter my apartment until I finish my workout

Toll is a workout-gated home entry system that keeps my house keys locked away until I've completed my daily exercise quota.

It uses **computer vision to count squats and push-ups**, and adjusts the required workout based on my daily step count, gym attendance and food delivery orders. Once I've completed the quota, Toll remotely unlocks the lockbox holding the keys to my apartment.

## How it works

```text
              ┌──────────────────┐
              │   "Hey Siri, I   │
              │   want to enter  │
              │     my house"    │
              └────────┬─────────┘
                       │
                       ▼
                 Apple Shortcut
                       │
                       ▼
                 React web app
                       │
                       ▼
              Fetch activity data
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        Steps    Gym Attendance  Takeout Orders
     (Healthkit) (Google Sheets) (Google Sheets)
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
            Calculate workout quota
                       │
                       ▼
           Squat / Push-up detection
               (ML5.js + MoveNet)
                       │
                       ▼
               Check completion
                       │
                       ▼
            Node.js/Express backend
                       │
                       ▼
                  TTLock API
                       │
                       ▼
                 Wi-Fi Gateway
                       │
                       ▼
                 Smart Lockbox
                       │
                       ▼
                   House keys
```

### Activation

I launch the web app using an **Apple Shortcut triggered through Siri**. The app fetches my activity data and calculates how many squats and push-ups I need to complete before I can access my keys.

### Quota Calculation

The daily workout quota starts with a fixed baseline. It is then adjusted using three inputs:

- **Daily steps:** Steps recorded by Apple HealthKit reduce the number of exercises (if they are above the needed threshold).
- **Gym attendance:** Going to the gym reduces the required workout for that day. Gym visits are recorded in a separate activity log in a Google sheet.
- **Food delivery:** Every food delivery order placed within the previous seven days adds one squat and one push-up to the quota. This is fetched from a separate expense tracking record developed as part of [this project](https://github.com/soumya-talwar/odit).

Every time I open the app, the quota is recalculated using the latest available data.

### Workout detection

Toll uses **ML5.js and MoveNet pose estimation** to detect my movements through the phone's camera.

The app tracks my body position and counts completed squats and push-ups in real time. Once the required repetitions are completed, the app sends a request to the backend to unlock the key box.

### Physical access

I use a **TTLock-compatible smart lockbox** to store my house keys. A Wi-Fi gateway connects the lockbox to the internet, allowing Toll's backend to communicate with it through the TTLock API.

Once the workout quota is complete, the backend sends an unlock command to the lockbox, and I can retrieve my keys.

## Built with

- **Siri + Apple Shortcuts**
- **Apple Healthkit**
- **Javascript / React**
- **Node.js**
- **Express**
- **ML5.js + MoveNet**
- **Google Sheets API**
- **Smart Lockbox**
- **Wifi Gateway**
- **TTLock API**
- **Vercel**
