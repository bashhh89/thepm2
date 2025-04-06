# Everything GitHub for QanDu

This document explains how we manage our GitHub repositories and code in simple terms. Keep this for reference when we encounter any GitHub-related issues in the future.

## Basic GitHub Concepts

- **Repository (Repo)**: Think of it as a project folder in the cloud that tracks all changes to your code.
- **Branch**: A version of your codebase. The main branch is your production-ready code.
- **Commit**: A saved change to your code with a message explaining what changed.
- **Push**: Uploading your local changes to GitHub.
- **Pull/Fetch**: Downloading changes from GitHub to your local computer.
- **Merge**: Combining changes from one branch into another.

## Our Repository Structure

We've simplified our project repository to have a clean structure:
- The `main` branch contains all the latest working features including SearchGPT functionality
- All development is based on this branch

## Common GitHub Commands

Here are the essential commands we've used (for reference):

### Branch Management
```
# Check what branch you're on and list all branches
git branch

# Switch to a branch
git checkout main

# Create and switch to a new branch
git checkout -b new-feature

# Rename a branch (while on that branch)
git branch -m old-name new-name

# Delete a branch
git branch -D branch-to-delete
```

### Working with Changes
```
# See what files have changes
git status

# Add files to be committed
git add .

# Commit changes with a message
git commit -m "Added new feature"

# Push changes to GitHub
git push origin main

# Force push (use carefully!)
git push -f origin main
```

### Repository Setup
```
# Check remote repositories
git remote -v

# Add a remote repository
git remote add origin https://github.com/username/repo.git

# Change remote URL
git remote set-url origin https://github.com/username/repo.git

# Remove a remote
git remote remove origin
```

## How We Fixed Our Repository

When we had issues with multiple branches and wanted to simplify:

1. We identified that our `main` branch and `main-for-thepm2` branch had different histories
2. We kept the branch with all our work (`main-for-thepm2`) 
3. We renamed it to `main`
4. We pushed this clean branch to GitHub

This created a single source of truth with all our code.

## Troubleshooting

### If npm start/dev doesn't work:
```
# Kill all running Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }

# Delete the .next build folder
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# Start the dev server again
npm run dev
```

### If port 3000 is in use:
```
# Find and kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### If you have merge conflicts:
1. Keep the version of the file that has the features you want
2. When in doubt, back up your changes and ask for help

## Best Practices

1. **Always work from the latest code**: Pull from `main` before starting new work
2. **Commit frequently**: Make small, focused commits with clear messages
3. **Push regularly**: Don't wait too long to push changes
4. **Keep it simple**: We use a single branch workflow for now
5. **Back up before major changes**: Copy your code folder before attempting complex operations

## Remember

When we encounter any GitHub issues again, refer to this document or share it with your technical help. Most problems can be solved by:

1. Making sure you're on the right branch
2. Pulling the latest changes
3. Cleaning up any temporary files (.next folder)
4. Restarting your development server

If you see an error about "intelliSearchService.ts" file, this was an issue we resolved by removing problematic files and creating local type definitions instead of importing them. 