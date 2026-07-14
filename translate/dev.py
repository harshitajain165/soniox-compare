import os
import sys


def main() -> None:
    os.execvp("fastapi", ["fastapi", "dev", "main.py", *sys.argv[1:]])
