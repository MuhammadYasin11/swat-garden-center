"""
Simple file-based admin credential store.
Passwords are stored as SHA-256 hashes (hex). Default: admin123.
"""
import hashlib
import json
import os

CREDENTIALS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "data", "admin_credentials.json"
)
DEFAULT_ADMIN_PASSWORD = "admin123"


def _hash(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _ensure_credentials_file() -> None:
    os.makedirs(os.path.dirname(CREDENTIALS_PATH), exist_ok=True)
    if not os.path.exists(CREDENTIALS_PATH):
        data = {"password_hash": _hash(DEFAULT_ADMIN_PASSWORD)}
        with open(CREDENTIALS_PATH, "w") as f:
            json.dump(data, f, indent=2)


def _read_credentials() -> dict:
    _ensure_credentials_file()
    with open(CREDENTIALS_PATH, "r") as f:
        return json.load(f)


def _write_credentials(data: dict) -> None:
    _ensure_credentials_file()
    with open(CREDENTIALS_PATH, "w") as f:
        json.dump(data, f, indent=2)


def verify_admin_password(password: str) -> bool:
    """Return True if the given password matches the stored admin password."""
    data = _read_credentials()
    stored = data.get("password_hash") or _hash(DEFAULT_ADMIN_PASSWORD)
    return _hash(password) == stored


def set_admin_password(new_password: str) -> None:
    """Overwrite the stored admin password with the new one (stored as hash)."""
    data = _read_credentials()
    data["password_hash"] = _hash(new_password)
    _write_credentials(data)
