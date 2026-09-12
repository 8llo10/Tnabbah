# Development Notes

## Local development areas

TNABBAH spans mobile, backend, realtime messaging, and vehicle communication. Keep changes scoped to the affected layer and verify integration points before merging.

## Common checks

- Confirm environment variables are present without committing secrets.
- Verify API connectivity and authentication flows.
- Verify MQTT topics and vehicle/user separation when telemetry changes.
- Test BLE/OBD-II behavior on supported hardware when communication logic changes.
- Validate database changes against Supabase/PostgreSQL.
- Re-run the diagnostic/report flow after backend changes.

See also [System Overview](SYSTEM-OVERVIEW.md) and [Validation Checklist](TESTING.md).
