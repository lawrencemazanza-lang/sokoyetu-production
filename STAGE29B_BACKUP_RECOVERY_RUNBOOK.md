# SokoYetu Mtaani Stage 29B: Backup and Recovery Runbook

## Before major changes

1. Export products.
2. Export orders.
3. Export payments.
4. Export sellers.
5. Export support notes.
6. Confirm Git status is clean.
7. Confirm Render latest deployment is stable.

## If a deployment fails

1. Check Render deploy logs.
2. If the site is down, redeploy the last known working commit.
3. Check /api/health.
4. Check admin-system-health.html.
5. Avoid changing DNS unless the domain itself is failing.
6. Do not rotate M-PESA credentials unless the issue is clearly payment configuration.

## If database records look wrong

1. Stop adding new records.
2. Export the current affected dataset.
3. Compare with the latest saved export.
4. Restore manually only after identifying the exact issue.
5. Keep a note of what was changed and when.

## Sensitive data handling

Do not share customer exports publicly. Exports may include phone numbers, addresses, emails and payment references.

