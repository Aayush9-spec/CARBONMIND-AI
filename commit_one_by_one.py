import subprocess
import os
import sys

def main():
    # Get list of files from git status --porcelain
    result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
    lines = result.stdout.strip().split('\n')

    files = []
    for line in lines:
        if not line:
            continue
        # git status --porcelain output starts with status flags at indices 0-1, then a space, then the path.
        # It may be quoted if it contains special characters.
        path = line[3:].strip().strip('"').strip()
        if path:
            files.append(path)

    if not files:
        print("No files to commit.")
        sys.exit(0)

    print(f"Found {len(files)} files to commit one by one.")

    for i, f in enumerate(files):
        print(f"\n[{i+1}/{len(files)}] Processing file: {f}")
        
        # Git add
        add_res = subprocess.run(['git', 'add', f], capture_output=True, text=True)
        if add_res.returncode != 0:
            print(f"Error staging {f}: {add_res.stderr}")
            continue
            
        # Determine clean commit message prefix
        base = os.path.basename(f)
        if f.endswith('.json') or f.endswith('.config.ts') or f.startswith('.') or 'prisma' in f:
            msg = f"chore: configure {base}"
        elif f.endswith('.css'):
            msg = f"style: design system {base}"
        elif f.endswith('.md'):
            msg = f"docs: document {base}"
        else:
            msg = f"feat: implement {base}"
            
        print(f"Committing with message: {msg}")
        commit_res = subprocess.run(['git', 'commit', '-m', msg], capture_output=True, text=True)
        if commit_res.returncode != 0:
            print(f"Error committing {f}: {commit_res.stderr}")
            continue

    print("\nAll commits completed successfully locally!")

if __name__ == '__main__':
    main()
