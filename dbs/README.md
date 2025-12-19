# 🚀 Laramie Databases

This repository is designed to manage database changes for all projects.

## Init DB (only once)

1. Clone the repository to your local machine.
2. Run `docker-compose up -d` to start the PostgreSQL container.
3. Download all the backup files from https://drive.google.com/drive/u/0/folders/14uhb7xBbyYMpZVuLbsWkY5uuyiDYqaQE
4. Restore backup files (move backup files to `generated/db-backups` directory and run the following commands):
5. Run `docker exec -it laramie-db bash -c "bash /var/lib/postgresql/scripts/init-db.sh"` to create the databases, users, roles and restore the backups.

[![asciicast](https://asciinema.org/a/urL5Ko0juvLFpqIplX4Pq7cPl.svg)](https://asciinema.org/a/urL5Ko0juvLFpqIplX4Pq7cPl)

## Getting Started with migration scripts

For each project, follow these steps:

1. `cd` into the desired project directory.
2. Install the required dependencies on each directory by running `npm install`.
3. Create a `.env` file in the root of each project directory and configure the necessary environment variables. For example (in `apps/comunicacion/.env`):

```properties
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=user_laramie_comunicacion
DB_PASSWORD=12345
DB_DATABASE=laramie_comunicacion
```

4. Run the desired migration command using npm. For example:
   - To create a new migration: `npm run migration:create <migration_name>`
   - To check the status of migrations: `npm run migration:status`
   - To apply pending migrations: `npm run migration:up`
   - To rollback the last migration: `npm run migration:down`
5. Create a pull request with all the changes to be reviewed by the team.
