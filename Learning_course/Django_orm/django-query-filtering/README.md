# Django Query Filtering Project

This project demonstrates advanced query filtering using Django's Q objects and various lookup methods. It includes a management command that showcases different query scenarios and their corresponding SQL outputs.

## Project Structure

```
django-query-filtering
├── manage.py
├── config
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── restaurants
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   ├── migrations
│   │   └── __init__.py
│   └── management
│       ├── __init__.py
│       └── commands
│           ├── __init__.py
│           └── demonstrate_queries.py
├── requirements.txt
└── README.md
```

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd django-query-filtering
   ```

2. **Create a Virtual Environment**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Requirements**
   ```
   pip install -r requirements.txt
   ```

4. **Run Migrations**
   ```
   python manage.py migrate
   ```

5. **Create Superuser (Optional)**
   ```
   python manage.py createsuperuser
   ```

6. **Run the Development Server**
   ```
   python manage.py runserver
   ```

## Usage

To demonstrate the advanced query filtering, run the following management command:

```
python manage.py demonstrate_queries
```

This command will execute various queries using Q objects and print the SQL output for each query.

## Queries Overview

The project includes several advanced queries that utilize Django's ORM capabilities:

1. **Type Isolation**: Fetches restaurants of type Italian or Mexican.
2. **Negated Range Check**: Retrieves restaurants that have not opened in the last 30 days.
3. **Evaluated Set Union**: Combines queries for Italian/Mexican restaurants or those opened in the last 30 days.
4. **Infix Containment Check**: Searches for restaurants with names containing "grill".
5. **Suffix End Anchoring**: Finds restaurants with names ending in "Cafe".
6. **Numeric Entity Identification**: Identifies restaurants with numeric characters in their names.
7. **Relational Multi-Field Condition**: Compares income and expenditure for sales related to restaurants.

## Conclusion

This project serves as a practical example of how to leverage Django's powerful ORM features for complex querying. The management command provides a hands-on demonstration of the queries and their SQL translations, making it a valuable resource for understanding Django's capabilities.