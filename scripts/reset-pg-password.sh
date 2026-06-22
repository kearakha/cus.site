#!/bin/bash
# reset-pg-password.sh
# Reset password Postgres 17 EnterpriseDB superuser di macOS.
# Run sekali: bash reset-pg-password.sh
# Butuh password Mac kamu untuk sudo.

set -e

PG_DATA="/Library/PostgreSQL/17/data"
PG_BIN="/Library/PostgreSQL/17/bin"
NEW_PASSWORD="satset"

echo "==> Stopping PostgreSQL..."
sudo $PG_BIN/pg_ctl -D $PG_DATA stop -m fast

echo "==> Backing up pg_hba.conf..."
sudo cp $PG_DATA/pg_hba.conf $PG_DATA/pg_hba.conf.bak

echo "==> Setting trust auth untuk localhost (temporary)..."
# Ganti semua method scram-sha-256/md5 ke trust untuk localhost
sudo sed -i.bak 's/\(127\.0\.0\.1\/32.*\)scram-sha-256/\1trust/' $PG_DATA/pg_hba.conf
sudo sed -i 's/\(::1\/128.*\)scram-sha-256/\1trust/' $PG_DATA/pg_hba.conf

echo "==> Starting PostgreSQL (now trust mode)..."
sudo $PG_BIN/pg_ctl -D $PG_DATA start

echo "==> Setting new password untuk superuser 'postgres'..."
$PG_BIN/psql -U postgres -h 127.0.0.1 -c "ALTER USER postgres WITH PASSWORD '$NEW_PASSWORD';"

echo "==> Creating database 'satset'..."
$PG_BIN/psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE satset;" 2>/dev/null || echo "   (database satset sudah ada)"

echo "==> Reverting pg_hba.conf ke scram-sha-256 (security)..."
sudo sed -i 's/\(127\.0\.0\.1\/32.*\)trust/\1scram-sha-256/' $PG_DATA/pg_hba.conf
sudo sed -i 's/\(::1\/128.*\)trust/\1scram-sha-256/' $PG_DATA/pg_hba.conf

echo "==> Reloading config..."
sudo $PG_BIN/pg_ctl -D $PG_DATA reload

echo ""
echo "==> Testing connection dengan password baru..."
PGPASSWORD=$NEW_PASSWORD $PG_BIN/psql -U postgres -h 127.0.0.1 -d satset -c "SELECT current_user, current_database();" 2>&1

echo ""
echo "==> Done! Update .env kamu dengan:"
echo "    DATABASE_URL=\"postgresql://postgres:satset@localhost:5432/satset\""
echo ""
echo "Lalu jalankan: cd ~/Documents/Project/satset && npx prisma db push"
