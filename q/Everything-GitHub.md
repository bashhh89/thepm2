# Everything GitHub for QanDu - SIMPLIFIED GUIDE

This is your simple reference guide for GitHub. It explains how to manage your code in basic terms.

## What We Did Today

1. We fixed your GitHub repository by:
   - Removing all unnecessary branches
   - Creating a single clean branch with all your current work
   - Making this clean branch the default (main) branch

2. Now your repository has:
   - A single `main` branch containing your complete project
   - All features properly working including advanced search functionality

## How to Work With Your Repository

### When Starting on a New Computer

```
# Clone your repository (do this once on a new computer)
git clone https://github.com/bashhh89/thepm2.git

# Go into the project folder
cd thepm2

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Day-to-Day Work (After Initial Setup)

```
# Pull the latest changes (do this when starting work each day)
git pull

# After making changes, save them
git add .
git commit -m "Brief description of what you changed"
git push
```

## Troubleshooting Common Issues

### If npm start/dev doesn't work:
```
# Kill all running Node processes (copy-paste this in PowerShell)
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
taskkill /PID [THE_NUMBER_YOU_SEE] /F
```

### If GitHub asks for credentials:
- Use your GitHub username and Personal Access Token (not your regular password)
- If you forgot your token, create a new one on GitHub.com under Settings > Developer settings > Personal access tokens

## Super Simple Best Practices

1. **Always pull before working**: Start by running `git pull` to get the latest changes
2. **Commit regularly**: Save your work often with meaningful commit messages
3. **Don't worry about branches**: We're keeping everything in the main branch for simplicity
4. **Back up before big changes**: Make a copy of your folder before attempting anything complex

## Getting Help

If you encounter GitHub issues:
1. Take screenshots of any error messages
2. Share these with your development team or coding assistant
3. Reference this document when explaining your problem

Remember: Most problems can be solved with a fresh clone of the repository or by carefully following the troubleshooting steps above. 