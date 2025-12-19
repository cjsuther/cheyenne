#!/usr/bin/env bash

# Check if PostgreSQL is running
echo ""
echo ">> Checking if PostgreSQL is running..."
if ! pg_isready -q; then
  echo ">> Error: PostgreSQL is not running. Make sure the container is up."
  exit 1
fi
echo ">> PostgreSQL is running."

# Step 1: Switch to postgres user
echo ""
echo ">> Switching to postgres user..."
su - postgres <<EOF

# Step 2: Run the SQL script to create databases and roles
echo ""
echo ">> Creating databases and roles..."
psql -U user_laramie -d laramie < scripts/create-dbs-and-roles.sql
if [ $? -ne 0 ]; then
  echo ">> Error: Failed to create databases and roles."
  exit 1
fi
echo ""
echo ">>>>  Databases and roles created successfully."

# Step 3: Restoring backup files
echo ""
echo ">> Restoring laramie_seguridad database from backup..."
pg_restore --clean --if-exists -U user_laramie_seguridad -d laramie_seguridad < /mnt/laramie_seguridad.backup
if [ $? -ne 0 ]; then
  echo ">> Error: Failed to restore laramie_seguridad database."
  exit 1
fi
echo ">> laramie_seguridad database restored successfully."

echo ""
echo ">> Restoring laramie_administracion database from backup..."
pg_restore --clean --if-exists -U user_laramie_administracion -d laramie_administracion < /mnt/laramie_administracion.backup
if [ $? -ne 0 ]; then
  echo ">> Error: Failed to restore laramie_administracion database."
  exit 1
fi
echo ">> laramie_administracion database restored successfully."

echo ""
echo ">> Restoring laramie_ingresos_publicos database from backup..."
pg_restore --clean --if-exists -U user_laramie_ingresos_publicos -d laramie_ingresos_publicos < /mnt/laramie_ingresos_publicos.backup
if [ $? -ne 0 ]; then
  echo ">> Error: Failed to restore laramie_ingresos_publicos database."
  exit 1
fi
echo ">> laramie_ingresos_publicos database restored successfully."

echo ""
echo ">> Restoring laramie_comunicacion database from backup..."
pg_restore --clean --if-exists -U user_laramie_comunicacion -d laramie_comunicacion < /mnt/laramie_comunicacion.backup
if [ $? -ne 0 ]; then
  echo ">> Error: Failed to restore laramie_comunicacion database."
  exit 1
fi
echo ">> laramie_comunicacion database restored successfully."

echo ""
echo ">> Restoring laramie_tesoreria database from backup..."
pg_restore --clean --if-exists -U user_laramie_tesoreria -d laramie_tesoreria < /mnt/laramie_tesoreria.backup
if [ $? -ne 0 ]; then
  echo ">> Error: Failed to restore laramie_tesoreria database."
  exit 1
fi
echo ">> laramie_tesoreria database restored successfully."

EOF

echo ""
echo ">>>> Database initialization and restoration process completed."
