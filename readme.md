# Access Compass ♿️🗺️

**Access Compass** is a full-stack web application that helps users discover accessible locations in the city. Whether you're looking for parks, cafes, theaters, or historical sites, Access Compass makes it easy to find inclusive places based on detailed accessibility features and user reviews.

🌐 **Live site**: [accessibility-compass.netlify.app](https://accessibility-compass.netlify.app)

---

## 🌟 Features

- 🔍 Filter locations by:
  - **Categories** (Park, Café, Theater, etc.)
  - **Accessibility Features** (Wheelchair ramp, Restrooms, Parking, etc.)
  - **Accessibility Levels** (Color-coded)
  - **Minimum rating**

- 🗺️ Interactive Map with Routing (Leaflet + Routing Machine)
- ✍️ Add reviews and ratings for locations
- 🔐 Role-based access:
  - Admin users can add/remove accessibility features from locations
- ⚡ Fast, modern, responsive UI (React + Tailwind + Radix UI)

---

## 🧩 Tech Stack

### Frontend

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Leaflet.js](https://leafletjs.com/)
- [React Router](https://reactrouter.com/)
- Shadcn UI components

### Backend

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- PostgreSQL
- JWT Authentication
- Cloudinary for image uploads

---

## 🛠️ Installation

### Clone the repo

```bash
git clone https://github.com/eugenekravchuk/byteme_hackathon.git
cd byteme_hackathon
```

## 📦 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🐍 Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 🧪 API Documentation

You can test all endpoints using the built-in Swagger docs:

🔗 https://access-compass-django.onrender.com/api/docs/

## 🔐 Authentication

    JWT-based login

    Tokens are stored in localStorage

    Admin users can modify accessibility features per location

    Public users can leave reviews

## 📂 Folder Structure

```bash
byteme_hackathon/
├── backend/                # Django backend
│   └── locations/          # API for locations, features, etc.
├── frontend/               # React frontend
│   ├── components/         # UI components (Buttons, Cards, etc.)
│   ├── context/            # Global AppContext (state)
│   ├── pages/              # Route-based pages
│   └── lib/                # API functions
```

## 👥 Team

- [Yuliana Hrynda](https://github.com/YulianaHrynda)
- [Eugene Kravchuk](https://github.com/eugenekravchuk)
- [Sofia Sampara](https://github.com/sofiasampara76)
- [Roman Pavlosiuk](https://github.com/gllekkoff)
- [Oleksandra Ostafiichuk](https://github.com/OleksandraOO)
