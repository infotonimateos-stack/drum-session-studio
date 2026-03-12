#!/usr/bin/env python3
"""
Gmail Reader - Lee emails de las cuentas de Toni Mateos.

Uso:
  python3 scripts/gmail_reader.py search "from:alguien@email.com"
  python3 scripts/gmail_reader.py search "subject:factura after:2026/01/01"
  python3 scripts/gmail_reader.py search "from:sam.brisbe" --account tonidrummer
  python3 scripts/gmail_reader.py read MESSAGE_ID
  python3 scripts/gmail_reader.py read MESSAGE_ID --account tonidrummer

Cuentas:
  --account info        → infotonimateos@gmail.com (default)
  --account tonidrummer → tonidrummer@gmail.com

Requiere:
  - data/gmail_credentials.json (OAuth app config)
  - data/gmail_token.pickle (token infotonimateos)
  - data/gmail_token_tonidrummer.pickle (token tonidrummer)
"""

import os
import sys
import pickle
import argparse
import base64
from email.mime.text import MIMEText

# Ruta base del repo
REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_DIR, "data")

ACCOUNTS = {
    "info": {
        "token": os.path.join(DATA_DIR, "gmail_token.pickle"),
        "email": "infotonimateos@gmail.com"
    },
    "tonidrummer": {
        "token": os.path.join(DATA_DIR, "gmail_token_tonidrummer.pickle"),
        "email": "tonidrummer@gmail.com"
    }
}

CREDENTIALS_FILE = os.path.join(DATA_DIR, "gmail_credentials.json")
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


def get_service(account_name="info"):
    """Crea el servicio Gmail API autenticado."""
    from google.auth.transport.requests import Request
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build

    account = ACCOUNTS.get(account_name)
    if not account:
        print(f"Error: cuenta '{account_name}' no existe. Usa: {list(ACCOUNTS.keys())}")
        sys.exit(1)

    creds = None
    token_file = account["token"]

    if os.path.exists(token_file):
        with open(token_file, "rb") as f:
            creds = pickle.load(f)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(token_file, "wb") as f:
                pickle.dump(creds, f)
        elif os.path.exists(CREDENTIALS_FILE):
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
            with open(token_file, "wb") as f:
                pickle.dump(creds, f)
        else:
            print(f"Error: no hay token ({token_file}) ni credentials ({CREDENTIALS_FILE})")
            print("Copia estos archivos desde el iMac.")
            sys.exit(1)

    return build("gmail", "v1", credentials=creds)


def search_emails(query, account="info", max_results=10):
    """Busca emails y muestra resumen."""
    service = get_service(account)
    results = service.users().messages().list(
        userId="me", q=query, maxResults=max_results
    ).execute()

    messages = results.get("messages", [])
    if not messages:
        print(f"No se encontraron emails para: {query}")
        return

    print(f"Encontrados {len(messages)} emails:\n")

    for msg_info in messages:
        msg = service.users().messages().get(
            userId="me", id=msg_info["id"], format="metadata",
            metadataHeaders=["From", "To", "Subject", "Date"]
        ).execute()

        headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
        print(f"  ID: {msg_info['id']}")
        print(f"  De: {headers.get('From', '?')}")
        print(f"  Para: {headers.get('To', '?')}")
        print(f"  Asunto: {headers.get('Subject', '?')}")
        print(f"  Fecha: {headers.get('Date', '?')}")

        # Attachments
        parts = msg["payload"].get("parts", [])
        attachments = [p["filename"] for p in parts if p.get("filename")]
        if attachments:
            print(f"  Adjuntos: {', '.join(attachments)}")

        print()


def read_email(message_id, account="info"):
    """Lee el contenido completo de un email."""
    service = get_service(account)
    msg = service.users().messages().get(
        userId="me", id=message_id, format="full"
    ).execute()

    headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
    print(f"De: {headers.get('From', '?')}")
    print(f"Para: {headers.get('To', '?')}")
    print(f"Asunto: {headers.get('Subject', '?')}")
    print(f"Fecha: {headers.get('Date', '?')}")
    print("=" * 60)

    # Extraer cuerpo del mensaje
    body = extract_body(msg["payload"])
    if body:
        print(body)
    else:
        print("[Sin contenido de texto]")

    # Listar adjuntos
    parts = msg["payload"].get("parts", [])
    attachments = [p["filename"] for p in parts if p.get("filename")]
    if attachments:
        print("\n" + "=" * 60)
        print(f"Adjuntos ({len(attachments)}):")
        for att in attachments:
            print(f"  - {att}")


def extract_body(payload):
    """Extrae el texto plano del cuerpo del email."""
    if payload.get("mimeType") == "text/plain" and payload.get("body", {}).get("data"):
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")

    parts = payload.get("parts", [])
    for part in parts:
        if part.get("mimeType") == "text/plain" and part.get("body", {}).get("data"):
            return base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
        if part.get("parts"):
            result = extract_body(part)
            if result:
                return result
    return None


def main():
    parser = argparse.ArgumentParser(description="Gmail Reader para Toni Mateos")
    parser.add_argument("--account", default="info", choices=["info", "tonidrummer"],
                        help="Cuenta Gmail (default: info = infotonimateos)")
    subparsers = parser.add_subparsers(dest="command")

    # search
    sp_search = subparsers.add_parser("search", help="Buscar emails")
    sp_search.add_argument("query", help="Query de búsqueda Gmail")
    sp_search.add_argument("--max", type=int, default=10, help="Máximo resultados")

    # read
    sp_read = subparsers.add_parser("read", help="Leer un email por ID")
    sp_read.add_argument("message_id", help="ID del mensaje")

    args = parser.parse_args()

    if args.command == "search":
        search_emails(args.query, args.account, args.max)
    elif args.command == "read":
        read_email(args.message_id, args.account)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
