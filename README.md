# Bridge High

Bridge High is a Student Management System (SMS) running on a django rest API, React frontend and a PostgreSQL database.

The application is hosted on DigitalOcean and can be accessed through this [link](https://bridge-app-qcn53.ondigitalocean.app)

- To run the app in development mode, you need to have Python 3.6 or higher installed on your machine.

- Follow the steps below to run the app in development mode:

1. Clone the repository

   ```bash
   git clone https://github.com/justicenyaga/bridge_high.git && cd bridge_high
   ```

2. Create a virtual environment

   ```bash
   virtualenv -p python3 venv
   ```

3. Activate the virtual environment

   ```bash
   source venv/bin/activate
   ```

4. Install the dependencies

   ```bash
   pip install -r requirements.txt
   ```

5. Create a .env file in the root directory and add the following environment variables

   ```
   SECRET_KEY=your_secret_key
   ALLOWED_HOSTS=localhost
   DEVELOPEMENT_MODE=True
   DEBUG=True
   DATABASE_URL=postgres://user:password@localhost:5432/db_name
   ```

   ```
   NB: The app uses sqlite3 database when DEVELOPEMENT_MODE is set to True and PostgreSQL 
   database if DEVELOPMENT_MODE is set to False
   ```

6. Run the migrations

   ```bash
   python manage.py migrate
   ```

7. Create a superuser

   ```bash
   python manage.py createsuperuser
   ```

8. Run the app

   ```bash
   python manage.py runserver
   ```

- Open [http://localhost:8000](http://localhost:8000) on your browser to view the app.

  ```
  use the superuser credentials to login to the admin panel
  ```
