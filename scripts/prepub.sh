#!/bin/bash

if [ -f "RELEASE_NOTES.md" ]; then
  echo "Release notes already exist. Exiting..."
  exit 0
fi

version=$(jq -r '.version' package.json)
if [[ $version == *"-dev"* ]]; then
  echo "** Dropping the -dev prerelease ID"
  npm version patch --preid "" --no-git-tag-version
  version=$(jq -r '.version' package.json)
  echo "** New version is v$version"
  git add package.json && git commit -m "v$version"
fi

echo "** Files to be published:"
npm publish --dry-run

git push

previousRelease=$(gh release list --json tagName --jq ".[].tagName" --limit 1)
echo "** Previous release is $previousRelease"
comparePrevious="https://github.com/softcraft-development/lite-xml/compare/$previousRelease...main"
echo "** Comparison: $comparePrevious"
open $comparePrevious

# Create a markdown file with the version variable as the title
cp RELEASE_NOTES.template.md RELEASE_NOTES.md
echo "[$previousRelease...v$version](https://github.com/softcraft-development/lite-xml/compare/$previousRelease...v$version)" >> RELEASE_NOTES.md
echo "** Launching VSCode to edit the release notes"
# Open VSCode to modify the release notes
code RELEASE_NOTES.md


