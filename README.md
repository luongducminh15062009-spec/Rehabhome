# RehabHome

An AI-powered health support application designed to help cancer patients maintain physical and mental well-being during treatment and recovery at home.

**Field:** HealthTech  
**Author:** Luong Duc Minh

---

## Introduction

RehabHome is designed to help cancer patients:

1. Engage in gentle physical exercises and maintain physical function throughout treatment and recovery.
2. Access easy-to-understand educational resources on nutrition and health management.
3. Ask basic health-related questions through an AI-powered chatbot whenever they need assistance.

RehabHome provides general health information and basic support. **It does not replace professional medical advice, diagnosis, or treatment.**

## Motivation

- Cancer patients often experience persistent fatigue, reduced physical capacity, stress, and anxiety.
- Spending most of their time at home can make it difficult to participate regularly in rehabilitation programs.
- Patients need accessible guidance on gentle physical activities that account for their individual health conditions.
- Reliable and easy-to-understand resources on nutrition, mental well-being, and basic health questions are essential for informed self-care.

## Target Users

- Cancer patients undergoing chemotherapy, radiation therapy, or recovering from surgery.
- Family members, caregivers, and others who support cancer patients throughout their recovery.

**Core challenges:** Persistent fatigue, reduced physical capacity, anxiety, and limited access to ongoing rehabilitation support.

## Features

| # | Feature | Description |
|---|---|---|
| 1 | **Exercise Library** | Search for and explore gentle exercises, including diaphragmatic breathing, shoulder rotations, lateral neck stretches, and seated knee extensions. Each exercise includes video demonstrations, detailed instructions, and safety precautions. |
| 2 | **Personalized Exercise Plans** | Collect user health profiles, including health status, fatigue levels, and mobility capabilities, to recommend weekly exercise schedules. Display goals, progress, and exercise frequency. |
| 3 | **Health Progress Tracking** | Record exercise sessions, daily energy levels, and moods. Review historical data through activity logs, charts, and weekly reports. |
| 4 | **Cancer Care Knowledge Hub** | Provide articles and videos covering nutrition, healthy lifestyles, cooking, fatigue management, and mental well-being. |
| 5 | **AI Health Q&A Chatbot** | Answer basic health-related questions using the application's knowledge base and recommend relevant exercises and educational resources. |

## Technology Stack

### Frontend (Mobile)

- **React Native** — Cross-platform mobile application development
- **Expo SDK ~53** — Development and deployment tooling
- **TypeScript** — Type-safe application development
- **Expo Router** — File-based navigation
- **NativeWind / Tailwind CSS** — User interface styling
- **Zustand** — Global state management
- **React Query** — Server-state management and data fetching
- **React Hook Form + Zod** — Form handling and data validation

### Backend and AI

- **Supabase**
  - PostgreSQL for database management
  - Supabase Auth with JWT-based authentication
  - Row Level Security (RLS) for database access control
  - Realtime for WebSocket-based updates
  - Storage for profile images and other image assets
- **OpenRouter + GPT-4o-mini** — AI-powered chatbot responses

## Getting Started

> The following instructions are a reference setup for an Expo and Supabase application. Adjust the commands, environment variables, and configuration to match the actual source code.

### Prerequisites

- Node.js and npm
- Expo Go or an Android/iOS simulator
- A Supabase project
- An OpenRouter API key for the AI chatbot

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/luongducminh15062009-spec/Rehabhome.git
cd Rehabhome
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Add the required configuration values:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
```

The variable names above are examples. Verify that they match the application's actual configuration.

**4. Start the application**

```bash
npx expo start
```

Scan the QR code using Expo Go, or launch the application in an Android or iOS simulator.

### Security Notes

- Never expose secret API keys, especially the OpenRouter API key, in client-side application code.
- Route AI requests through a secure server-side endpoint, such as a Supabase Edge Function.
- Configure appropriate Row Level Security policies to protect users' personal and health-related data.
- Do not commit `.env` files or other files containing credentials to the repository.

## Development Process

1. **Identify the Need:** Explore the challenges cancer patients face when accessing rehabilitation support at home.
2. **Define the Product:** Establish the core features, target users, and rehabilitation support objectives.
3. **Build the Prototype:** Develop initial versions of the core application features.
4. **Design the User Experience:** Create an accessible and user-friendly interface for patients and caregivers.
5. **Evaluate Usability:** Assess the application's usability and collect feedback for improvement.
6. **Conduct a Small-Group Pilot:** Introduce the application to a small group of peers, friends, and family members to gather feedback and refine the user experience.

## Project Outcomes

RehabHome currently aims to provide the following capabilities:

- A platform for accessing gentle exercise guidance at home.
- A system for tracking health-related activities and progress.
- A library of educational resources on cancer care and general well-being.
- An AI-powered chatbot for basic health-related questions.

## User Feedback

> "RehabHome is easy to use and helps me follow rehabilitation exercises at home. The clear instructions make the recovery process more convenient."
>
> — Nhat Minh

> "I really like the idea behind RehabHome. Adding more exercise videos and personalized rehabilitation plans would make it even more useful."
>
> — Ha Thi Oanh

*Note: Include testimonials only when they reflect genuine feedback from actual users and you have permission to publish them.*

## Future Roadmap

| Phase | Planned Development |
|---|---|
| 1 | Refine existing features and expand the exercise library based on patients' needs. |
| 2 | Incorporate feedback from patients, caregivers, and healthcare professionals. |
| 3 | Explore AI-driven personalization based on rehabilitation progress and individual health needs. |
| 4 | Collaborate with healthcare professionals to improve the quality and reliability of the application's guidance. |
| 5 | Expand pilot testing to a broader range of users and communities. |
| 6 | Scale the platform to make at-home rehabilitation support accessible to more cancer patients. |

## Contact

- **Author:** Luong Duc Minh
- **Email:** luongducminh15062009@gmail.com
- **Phone / WhatsApp:** +84 936 150 609
