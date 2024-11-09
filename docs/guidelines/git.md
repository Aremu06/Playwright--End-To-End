# Git
This page provides essential Git processes to help you efficiently manage your test automation code. Whether you're new to Git or looking for a quick reference, these guidelines will support you in maintaining a smooth and organized workflow.

## Useful git processes

### Creating a new branch

Step 1: Ensure you are on the main branch: 
```sh
git checkout main
```

Step 2: Pull the latest changes: 
```sh
git pull
```

Step 3: Create and switch to a new branch:
```sh
git checkout -b ticket-no_short_description
```

### Committing/pushing changes

Info: This is how you can see the working tree status:
```sh
git status
```

Step 1: Add changes to the staging area:
```sh
git add <file>
``` 
or 

```sh
git add .
``` 
to add all changes

Step 2: Commit changes with a message:
```sh
git commit -m "feat: description of new feature"
```

Step 3: Ensure you are on the correct branch. Push your changes to the remote repository:
```sh
git push
```

### Merging Changes

Step 1: Switch to the branch you want to merge into your current branch:
```sh
git checkout main
```

Step 2: Pull the latest changes: 
```sh 
git pull
```

Step 3: Switch to the branch you want to merge into:
```sh
git checkout <branch-name>
```

Step 4: Merge the other branch into your current branch:
```sh
git merge main
```

Step 5: Resolve any merge conflicts if they occur.

Step 6: Commit the merge:
```sh
git commit -m "Merge branch 'branch-name' into main"
```

## Additional resources
- [Git Documentation](https://git-scm.com/doc)
- [Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
