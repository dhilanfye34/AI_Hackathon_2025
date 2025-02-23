import hashlib

def compute_file_hash(filepath):
    """Compute MD5 hash of the file at 'filepath'."""
    md5_hash = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            md5_hash.update(chunk)
    return md5_hash.hexdigest()