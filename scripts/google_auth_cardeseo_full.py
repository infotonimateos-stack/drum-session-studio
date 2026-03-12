#!/usr/bin/env python3
"""Genera token OAuth para info@cardeseo.com con Gmail + Sheets"""
import pickle
import os
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/spreadsheets',
]
CLIENT_SECRET = os.path.expanduser('~/drum-session-studio/data/client_secret.json')
TOKEN_PATH = os.path.expanduser('~/drum-session-studio/data/google_token_cardeseo.pickle')

flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET, SCOPES)
creds = flow.run_local_server(port=8091)

with open(TOKEN_PATH, 'wb') as f:
    pickle.dump(creds, f)

print(f"\nToken guardado en: {TOKEN_PATH}")
print("Gmail + Sheets autenticado correctamente.")
