# My user page
## source branch

This branch will contain the build tools that will help me build my pages/blog posts.

## master branch

This branch will contain the compiled static html pages.

## Using it

For a GitHub user page follow the bellow steps to create your own copy of the repo.

1. Create a repo at github with the name youruser.github.io

2. Clone my repo:
`git clone https://github.com/adicirstei/adicirstei.github.io.git youruser.github.io`

3. `cd` into the repo folder
`cd youruser.github.io`

4. Clean the git history by removing `.git` folder
`rm -r .git`

5. Initialize a new git history
`git init`

6. Add the remote url of your repo created at the first step
`git remote add origin https://github.com/youruser/youruser.github.io`

7. Add the files to the source control
```bash
git add .
git commit -m "initial commit"
git push -u origin source
```

8. Remove my posts
`rm src/posts/*`

9. Replace my analytics tracking id with yours in `src/layout.jade`

10. Install dependencies
`npm install`