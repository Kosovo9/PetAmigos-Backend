#!/bin/bash
# scripts/security-audit.sh
# Weekly Security Audit for PetAmigos

LOG_FILE="/var/log/petamigos-security-audit.log"
DATE=$(date +%Y-%m-%d)
PROJECT_ROOT="/app" # Adjust based on deployment

echo "🔒 Starting Security Audit: $DATE" >> $LOG_FILE

# 1. Search for exposed secrets in codebase and logs
# Keywords: AKIA (AWS), sk_live (Stripe), eyJ (JWT)
echo "--- scanning for secrets ---" >> $LOG_FILE
grep -rE "AKIA|sk_live_|eyJ" $PROJECT_ROOT/server/logs >> $LOG_FILE 2>&1
grep -rE "AKIA|sk_live_|eyJ" $PROJECT_ROOT/client/dist >> $LOG_FILE 2>&1

# 2. Check for .env misuse
echo "--- checking .env placement ---" >> $LOG_FILE
if [ -f "$PROJECT_ROOT/client/dist/.env" ] || [ -f "$PROJECT_ROOT/client/public/.env" ]; then
    echo "CRITICAL: .env found in public client folder!" >> $LOG_FILE
fi

# 3. Check for hardcoded passwords (basic check)
echo "--- checking hardcoded passwords ---" >> $LOG_FILE
grep -r "password = ['\"]" $PROJECT_ROOT/server >> $LOG_FILE 2>&1

# 4. Check file permissions
echo "--- checking file permissions ---" >> $LOG_FILE
find $PROJECT_ROOT -name "*.ts" -perm 777 >> $LOG_FILE 2>&1

echo "🔒 Audit Completed" >> $LOG_FILE
