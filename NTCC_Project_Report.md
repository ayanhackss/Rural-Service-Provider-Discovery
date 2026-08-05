# GraamSeva — Rural Service Provider Discovery Platform

---

## Project Group Name

**Group GraamSeva** — BCA 3rd Semester, Amity University Patna

---

## Participant Names

| S. No. | Name                  | Role                   | Enrolment No. |
|--------|-----------------------|------------------------|---------------|
| 1      | Ayan Hussain          | Lead Developer         | *(to be filled)* |
| 2      | Gautam Kumar          | Backend Architecture   | *(to be filled)* |
| 3      | Ishaan Dinesh Singh   | Frontend Specialist    | *(to be filled)* |
| 4      | Abhishek Kumar        | QA & Integration       | *(to be filled)* |

> **Note:** Please fill in your respective Enrolment Numbers before final submission.

---

## Abstract of the Project

In rural and semi-urban India, locating trustworthy service providers — such as electricians, plumbers, carpenters, and tutors — remains an overwhelmingly offline, word-of-mouth process. This informal approach limits the visibility of skilled professionals, deprives residents of reliable choices, and leaves no room for accountability through reviews or ratings.

**GraamSeva** is a full-stack web application designed to digitise and organise this unstructured service economy. The platform enables rural residents to discover, compare, and book verified service providers in their locality, whilst simultaneously giving skilled professionals a digital storefront to list their services, manage bookings, and build a reputation through community reviews.

Built on the MERN (MongoDB, Express.js, React, Node.js) technology stack, GraamSeva implements role-based access control for three distinct user types — Residents, Service Providers, and Administrators — each with a dedicated dashboard experience. The application features real-time search with category filtering, a transparent booking and review system, provider availability management, and a comprehensive administrative panel for platform governance. A mobile-first, responsive design philosophy ensures the platform remains accessible even on low-end devices commonly used in rural areas.

This project was developed as a Non-Teaching Credit Course (NTCC) submission for the BCA 3rd Semester programme at Amity University, Patna.

---

## Introduction

India's rural population, which constitutes approximately 65% of the country's total population, faces a persistent challenge in accessing reliable professional services. Unlike urban centres where digital platforms such as UrbanCompany and JustDial have streamlined service discovery, rural areas continue to depend on informal social networks and local reputation. This information asymmetry creates two core problems:

1. **For Residents:** Difficulty in finding verified, available service providers when needed, leading to delays and reliance on unqualified individuals.
2. **For Service Providers:** Limited visibility beyond their immediate neighbourhood, restricting their customer base and income potential.

GraamSeva addresses these challenges by providing a centralised, web-based platform that connects rural residents with local service providers. The name "GraamSeva" itself is derived from Hindi — *Graam* meaning "village" and *Seva* meaning "service" — encapsulating the project's core mission of service to rural communities.

### Objectives

The primary objectives of this project are:

- To develop a user-friendly web application that allows rural residents to search, discover, and book local service providers.
- To provide service providers with a digital profile where they can list their services, set pricing, manage availability, and receive reviews.
- To implement a robust administrative panel for platform governance, including provider approval, user management, and analytics.
- To ensure the platform is mobile-responsive and performs well on low-bandwidth connections.
- To incorporate a transparent rating and review system to build trust within the community.

### Scope

The current scope of GraamSeva encompasses:

- User registration and authentication with role-based access (Resident, Provider, Admin).
- Service listing, categorisation (12 categories including Plumber, Electrician, Carpenter, Tutor, Doctor, Mechanic, Tailor, Mason, Painter, Agricultural, Cleaner, and Other), and full-text keyword search.
- A booking workflow with status management (pending, confirmed, completed, cancelled).
- A five-star rating and text review system.
- Provider-side dashboards for managing listings, bookings, earnings, and weekly availability slots.
- Resident-side features including favourites, booking history, and review management.
- An administrative dashboard with provider approval, user management, review moderation, analytics, and announcement capabilities.
- Dark mode and light mode theme switching.
- Mobile-first responsive design with a dedicated bottom navigation bar for small screens.

---

## Keywords

Rural Service Discovery, MERN Stack, Full-Stack Web Application, Service Provider Platform, Booking System, Role-Based Access Control, MongoDB, Express.js, React, Node.js, REST API, Responsive Web Design, Community Reviews, Rural Development, Digital India

---

## Technical Background / Technical Concept

### Technology Stack

GraamSeva is built using the **MERN Stack**, a widely adopted full-stack JavaScript framework comprising four core technologies:

| Layer        | Technology    | Version | Purpose                                           |
|-------------|---------------|---------|---------------------------------------------------|
| **Database**    | MongoDB       | 8.4     | NoSQL document database for flexible data storage |
| **Backend**     | Express.js    | 4.19    | Minimalist web framework for building REST APIs   |
| **Frontend**    | React         | 18.3    | Component-based UI library for building interfaces|
| **Runtime**     | Node.js       | 20.x    | Server-side JavaScript execution environment      |

### Supporting Libraries and Tools

**Frontend:**
- **Vite** (v5.3) — Next-generation frontend build tool offering near-instantaneous hot module replacement (HMR).
- **React Router DOM** (v6.24) — Declarative client-side routing with nested route support.
- **Framer Motion** (v12.42) — Production-ready animation library for smooth page transitions and micro-interactions.
- **Axios** (v1.7) — Promise-based HTTP client for API communication.
- **Lucide React** (v1.25) — Open-source icon library with 1500+ consistent SVG icons.
- **React Hot Toast** (v2.6) — Lightweight toast notification system.
- **FullCalendar React** (v6.1) — Interactive calendar component for provider availability management.

**Backend:**
- **Mongoose** (v8.4) — Elegant MongoDB object modelling with schema validation.
- **JSON Web Token (JWT)** (v9.0) — Industry-standard token-based authentication.
- **bcrypt.js** (v2.4) — Secure password hashing using the bcrypt algorithm.
- **CORS** (v2.8) — Cross-Origin Resource Sharing middleware.
- **Morgan** (v1.10) — HTTP request logger for development debugging.
- **dotenv** (v16.4) — Environment variable management from `.env` files.

### Architecture Overview

The application follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│                   CLIENT (React)                │
│  ┌───────────┐  ┌──────────┐  ┌──────────────┐ │
│  │  Pages    │  │Components│  │  Context API  │ │
│  │  (Views)  │  │(Reusable)│  │ (Auth State)  │ │
│  └─────┬─────┘  └────┬─────┘  └──────┬───────┘ │
│        └──────────────┼───────────────┘         │
│                       │ Axios HTTP              │
└───────────────────────┼─────────────────────────┘
                        │ REST API
┌───────────────────────┼─────────────────────────┐
│                  SERVER (Express)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Routes  │  │Middleware│  │   Models       │  │
│  │  (API)   │  │(Auth/JWT)│  │  (Mongoose)    │  │
│  └─────┬────┘  └────┬─────┘  └──────┬────────┘  │
│        └─────────────┼───────────────┘           │
│                      │ Mongoose ODM              │
└──────────────────────┼───────────────────────────┘
                       │
              ┌────────┴────────┐
              │    MongoDB      │
              │   (Atlas Cloud) │
              └─────────────────┘
```

### Database Design

The application uses four primary MongoDB collections:

1. **Users** — Stores all user accounts with role-specific fields. Supports three roles: `resident`, `provider`, and `admin`. Provider-specific fields include `isApproved`, `isSuspended`, `averageRating`, and `totalBookings`. Residents have a `favourites` array referencing Service documents.

2. **Services** — Contains service listings created by providers. Each service belongs to one of 12 predefined categories, includes a price range (`min`/`max`), description, and availability slots (day-wise hourly slots). A text index on `title`, `description`, and `category` enables full-text keyword search.

3. **Bookings** — Records service booking requests made by residents. Each booking references both the service and the resident, and maintains a status field (`pending`, `confirmed`, `completed`, `cancelled`) to track the booking lifecycle.

4. **Reviews** — Stores ratings (1–5 stars) and text reviews submitted by residents after service completion. Each review references the service, the reviewer, and the provider, enabling aggregated rating computation.

### Authentication and Authorisation

The platform implements a **JWT-based authentication** system:

- Upon successful login, the server generates a signed JWT containing the user's ID and role.
- The client stores this token and includes it as a `Bearer` token in the `Authorization` header of subsequent API requests.
- A server-side middleware (`auth.js`) verifies the token on protected routes and extracts the authenticated user's identity.
- Role-based route protection is enforced both on the client side (via a `ProtectedRoute` component) and on the server side (via role-checking middleware), ensuring defence in depth.

### API Design

The backend exposes a RESTful API organised into six route modules:

| Module       | Base Path       | Purpose                                |
|-------------|-----------------|----------------------------------------|
| Auth        | `/api/auth`     | Registration, login, token refresh     |
| Services    | `/api/services` | CRUD operations, search, filtering     |
| Bookings    | `/api/bookings` | Create, update status, list bookings   |
| Reviews     | `/api/reviews`  | Submit, list, aggregate reviews        |
| Me          | `/api/me`       | Current user profile, favourites, data |
| Admin       | `/api/admin`    | User management, analytics, approvals  |

---

## Methodology

The development of GraamSeva followed an **Agile-inspired iterative methodology**, adapted for a small team working within an academic semester timeline.

### Phase 1: Requirement Analysis and Planning

The team conducted a study of the challenges faced by rural communities in locating service providers. Key pain points were identified through informal discussions and observation:

- Lack of a centralised directory of local service providers.
- No mechanism for verifying the quality or reliability of providers.
- Absence of an appointment or booking system.
- No platform for providers to showcase their skills and availability.

Based on these findings, functional requirements were documented, user roles were defined, and a database schema was designed.

### Phase 2: Backend Development

The backend was developed first to establish a stable API foundation:

1. **Database schema design** — Four Mongoose models (User, Service, Booking, Review) were defined with appropriate validations, references, and indexing.
2. **Authentication system** — JWT-based registration and login endpoints were implemented with bcrypt password hashing.
3. **RESTful API endpoints** — CRUD operations for services, bookings, and reviews were built with proper authorisation checks.
4. **Admin module** — Dedicated routes for provider approval, user suspension, review moderation, and platform analytics were added.

### Phase 3: Frontend Development

The frontend was built using React with a component-driven approach:

1. **Design system** — A comprehensive CSS custom property-based design system was created in `index.css`, defining colour tokens, spacing scales, typography, and component styles for both light and dark themes.
2. **Core layout** — The application shell (Navbar, Footer, Bottom Navigation) was implemented with responsive breakpoints.
3. **Page development** — Individual pages were developed for each user flow: public pages (Home, Search, Service Detail), resident dashboards (Bookings, Favourites, Reviews, Profile), provider dashboards (Listings, Bookings, Earnings, Availability, Reviews, Profile), and admin dashboards (Dashboard, Providers, Residents, Bookings, Reviews, Analytics, Announcements).
4. **State management** — React Context API was used for global authentication state, eliminating the need for external state management libraries.

### Phase 4: Integration and Testing

- The frontend was connected to the backend API using Axios with a centralised instance configuration.
- Protected routes were tested across all three user roles to verify access control.
- The application was tested on multiple screen sizes (desktop, tablet, mobile) to ensure responsiveness.
- Seed scripts were developed to populate the database with realistic test data.

### Phase 5: Deployment

The application was configured for deployment on **Vercel** (frontend and serverless API) with the following setup:

- A `vercel.json` configuration file handles build commands, output directory, and URL rewrites.
- The MongoDB database is hosted on **MongoDB Atlas** (cloud-managed).
- Environment variables (database URI, JWT secret) are managed through the deployment platform's settings.

---

## Conclusion

GraamSeva successfully demonstrates how modern web technologies can be leveraged to address a real-world problem faced by rural communities in India. The platform provides a functional, aesthetically refined, and mobile-responsive solution for rural service discovery, bridging the gap between skilled professionals and the households that need their services.

### Key Achievements

- A fully functional three-role platform (Resident, Provider, Admin) with dedicated dashboard experiences for each.
- An intuitive service discovery workflow with category filtering, keyword search, and detailed service profiles.
- A transparent booking and review ecosystem that fosters trust and accountability.
- A comprehensive admin panel enabling platform governance, provider verification, and data-driven insights.
- A polished, mobile-first user interface with dark/light mode support, smooth page transitions, and micro-animations.

### Limitations

- The current version does not support real-time chat or notifications between residents and providers.
- Payment integration has not been implemented; the platform currently facilitates offline payments.
- The search functionality is limited to text-based matching and does not incorporate geolocation-based proximity filtering.

### Future Scope

- **Geolocation-based search** — Integrating GPS-based service discovery to show providers nearest to the user's location.
- **Real-time notifications** — Implementing WebSocket-based push notifications for booking updates.
- **Payment gateway integration** — Adding UPI and digital wallet support for seamless online transactions.
- **Vernacular language support** — Adding Hindi and other regional language interfaces to improve accessibility for non-English-speaking users.
- **Mobile application** — Developing a dedicated React Native mobile application for wider reach.

GraamSeva stands as a testament to the potential of technology in empowering rural India, and this NTCC project has provided the team with invaluable hands-on experience in full-stack web development, collaborative software engineering, and solving real-world problems through code.

---

*Submitted as a Non-Teaching Credit Course (NTCC) Project Report*
*BCA 3rd Semester — Amity University, Patna*
*July 2026*
