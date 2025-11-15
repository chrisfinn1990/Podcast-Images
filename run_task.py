import argparse
import json
import subprocess
import sys

TASKS_FILE = "tasks.json"

def list_tasks(tasks):
    """Prints a list of available tasks."""
    print("Available tasks:")
    for task in tasks:
        name = task.get('name', 'No name')
        description = task.get('description', 'No description provided.')
        print(f"  - \"{name}\": {description}")

def run_task(task):
    """Executes a given task using subprocess."""
    program = task.get('program')
    args = task.get('args', [])
    
    if not program:
        print(f"[ERROR] Task \"{task.get('name')}\" has no 'program' defined.", file=sys.stderr)
        sys.exit(1)
        
    command = [sys.executable, program] + args
    
    print(f"\n--- Running task: \"{task.get('name')}\" ---")
    print(f"[*] Executing command: {' '.join(command)}\n")
    
    try:
        result = subprocess.run(command, check=True, text=True, capture_output=True)
        print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        print(f"\n[SUCCESS] Task \"{task.get('name')}\" completed successfully.")
        return result
    except FileNotFoundError:
        print(f"[ERROR] Program '{program}' not found.", file=sys.stderr)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"[FAILURE] Task \"{task.get('name')}\" failed with exit code {e.returncode}.", file=sys.stderr)
        print(e.stdout)
        print(e.stderr, file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    """Main function to parse arguments and dispatch tasks."""
    parser = argparse.ArgumentParser(
        description="A task runner for the project, inspired by VSCode's launch.json.",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        'task_name', 
        nargs='?', 
        help='The name of the task to run from tasks.json. \nIf not provided, lists all available tasks.'
    )
    parser.add_argument(
        '--list',
        action='store_true',
        help='List all available tasks and their descriptions.'
    )
    args = parser.parse_args()

    try:
        with open(TASKS_FILE, 'r') as f:
            data = json.load(f)
            tasks = data.get('tasks', [])
    except FileNotFoundError:
        print(f"[ERROR] Tasks file '{TASKS_FILE}' not found.", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"[ERROR] Could not decode JSON from '{TASKS_FILE}'.", file=sys.stderr)
        sys.exit(1)

    if args.list or not args.task_name:
        list_tasks(tasks)
        sys.exit(0)

    task_to_run = next((task for task in tasks if task.get('name') == args.task_name), None)
    
    if task_to_run:
        run_task(task_to_run)
    else:
        print(f"[ERROR] Task \"{args.task_name}\" not found in '{TASKS_FILE}'.", file=sys.stderr)
        list_tasks(tasks)
        sys.exit(1)

if __name__ == "__main__":
    main()

