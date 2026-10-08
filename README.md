# Healthcare Management API

Backend API built with Django REST Framework and PostgreSQL for managing doctors, patients, and doctor-patient mappings.

## Tech Stack
- Django & Django REST Framework
- PostgreSQL
- SimpleJWT (Authentication)
- drf-spectacular (Swagger Documentation)

## Setup & Installation

1. Clone the repository and navigate into the project:
```bash
git clone https://github.com/Devesh369/WhatBytes_assignment.git
cd WhatBytes_assignment
```

2. Create and activate a virtual environment:
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Update your PostgreSQL database credentials in `.env`.

5. Apply migrations:
```bash
python manage.py migrate
```

6. Run the server:
```bash
python manage.py runserver
```

## API Documentation
Interactive Swagger documentation is available at:
http://127.0.0.1:8000/api/docs/

## Endpoints

### Authentication
- POST /api/auth/register/ - Register user
- POST /api/auth/login/ - Login and get JWT tokens
- POST /api/auth/token/refresh/ - Refresh access token

### Doctors
- GET /api/doctors/ - List doctors
- POST /api/doctors/ - Add doctor (authenticated)
- GET /api/doctors/<id>/ - Doctor details
- PUT/PATCH /api/doctors/<id>/ - Update doctor (creator only)
- DELETE /api/doctors/<id>/ - Delete doctor (creator only)

### Patients
- GET /api/patients/ - List user's patients
- POST /api/patients/ - Add patient (authenticated)
- GET /api/patients/<id>/ - Patient details
- PUT/PATCH /api/patients/<id>/ - Update patient
- DELETE /api/patients/<id>/ - Delete patient

### Mappings
- GET /api/mappings/ - List mappings for user's patients
- POST /api/mappings/ - Map doctor to patient
- GET /api/mappings/<patient_id>/ - Get doctors assigned to patient
- DELETE /api/mappings/<id>/ - Remove mapping
