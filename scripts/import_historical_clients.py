#!/usr/bin/env python3
"""
Import historical clients from clientes_unificado.json into Supabase.

Usage:
  SUPABASE_URL=https://xxftvsejuwkgmemciswl.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=<key> \
  python3 scripts/import_historical_clients.py

Run once after creating the historical_clients table.
"""

import json
import os
import sys
from datetime import datetime

try:
    import requests
except ImportError:
    print("Installing requests...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", "requests"])
    import requests

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(REPO_DIR, "data", "contabilidad", "clientes_unificado.json")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://xxftvsejuwkgmemciswl.supabase.co")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SERVICE_KEY:
    print("Error: SUPABASE_SERVICE_ROLE_KEY not set")
    print("Get it from Supabase Dashboard → Settings → API → service_role key")
    sys.exit(1)


def parse_date(d):
    """Parse DD/MM/YYYY to YYYY-MM-DD, return None if invalid."""
    if not d or not d.strip():
        return None
    try:
        return datetime.strptime(d.strip(), "%d/%m/%Y").strftime("%Y-%m-%d")
    except ValueError:
        return None


def normalize_phone(p):
    """Strip spaces from phone numbers."""
    if not p:
        return None
    return p.replace(" ", "").strip() or None


def main():
    print(f"Reading {DATA_FILE}...")
    with open(DATA_FILE, "r") as f:
        data = json.load(f)

    print(f"Found {len(data)} entries")

    rows = []
    for entry in data:
        emails = [e.lower().strip() for e in entry.get("emails", []) if e and e.strip()]
        phones = [normalize_phone(p) for p in entry.get("phones", []) if p]
        phones = [p for p in phones if p]  # remove None

        rows.append({
            "name": entry["name"],
            "alt_names": entry.get("alt_names", []),
            "roles": entry.get("role", []),
            "emails": emails,
            "phones": phones,
            "organization": entry.get("organization", "").strip() or None,
            "nif": entry.get("nif", "").strip() or None,
            "city": entry.get("city", "").strip() or None,
            "country": entry.get("country", "").strip() or None,
            "address": entry.get("address", "").strip() or None,
            "sessions": entry.get("sessions", 0) or 0,
            "total_revenue": entry.get("total_revenue", 0) or 0,
            "bands": entry.get("bands", []),
            "first_session": parse_date(entry.get("first_session")),
            "last_session": parse_date(entry.get("last_session")),
            "sources": entry.get("sources", []),
            "notes": entry.get("notes", []),
        })

    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    BATCH = 100
    url = f"{SUPABASE_URL}/rest/v1/historical_clients"

    for i in range(0, len(rows), BATCH):
        batch = rows[i:i + BATCH]
        r = requests.post(url, headers=headers, json=batch)
        if r.status_code not in (200, 201):
            print(f"Error at batch {i}: {r.status_code} - {r.text}")
            sys.exit(1)
        print(f"  Inserted {min(i + BATCH, len(rows))}/{len(rows)}")

    print(f"\nDone! {len(rows)} historical clients imported.")
    print("Verify with: SELECT count(*) FROM historical_clients;")


if __name__ == "__main__":
    main()
