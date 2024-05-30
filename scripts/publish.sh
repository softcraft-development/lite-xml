#!/bin/bash

# Exit if RELEASE_NOTES.md is missing or has zero length
if [ ! -s "RELEASE_NOTES.md" ]; then
  echo "RELEASE_NOTES.md is missing or empty"
  exit 1
fi

# Check if fast-forward is not possible
git fetch
git merge-base --is-ancestor origin/main HEAD
if [ $? -ne 0 ]; then
  echo "Fast-forward is not possible. Exiting..."
  exit 1
fi

# Get the version number from package.json
version=$(jq -r '.version' package.json)
# Exit if the version was not retrieved correctly
if [ -z "$version" ]; then
  echo "Failed to retrieve version from package.json"
  exit 1
fi
echo "** Version is $version"

# Exit if the version is a dev prerelease
if [[ $version == *"-dev"* ]]; then
  echo "Drop the -dev prerelease before publishing. Exiting..."
  exit 0
fi

# Check if the version is already tagged
if git rev-parse "v$version" >/dev/null 2>&1; then
  echo "Version $version is already tagged. Exiting..."
  exit 0
fi

echo "** Validating"
pnpm run validate
if [ $? -ne 0 ]; then
  echo "Validation failed. Exiting..."
  exit 1
fi

echo "** Building"
pnpm run build && pnpm declare
if [ $? -ne 0 ]; then
  echo "Error during the build. Exiting..."
  exit 1
fi

echo "** Generating Docs"
pnpm run docs
if [ $? -ne 0 ]; then
  echo "Error during the documentation build. Exiting..."
  exit 1
fi

echo "** Pushing Docs to Git"
git add docs && git commit -m "Rebuild documentation" --allow-empty && git push
if [ $? -ne 0 ]; then
  echo "Error pushing docs to Git. Exiting..."
  exit 1
fi

# Create a GitHub release and tag with the version number
echo "** Creating GitHub Release"
if [[ $version == 0* ]]; then
  gh release create v$version --title "Prerelease $version" --notes-file RELEASE_NOTES.md --prerelease
else
  gh release create v$version --title "Release $version" --notes-file RELEASE_NOTES.md
fi

# Exit if anything failed
if [ $? -ne 0 ]; then
  echo "An error publishing to GitHub. Exiting..."
  exit 1
fi

echo "** Archiving Release Notes"
mv RELEASE_NOTES.md RELEASE_NOTES.v$version.md

# Publish the package to npm
pushd dist
cp ../package.json .
cp ../README.md .
cp ../LICENSE .
echo "** Publishing to NPM"
npm publish --access public
popd

if [ $? -ne 0 ]; then
  echo "An error occurred publishing to NPM. Exiting..."
  exit 1
fi

echo "** Incrementing version number for next round of development"
newVersion=$(npm version prerelease --preid dev --no-git-tag-version)
echo "Adding new version $newVersion to git"
git add package.json && git commit -m "$newVersion" && git push

echo "** Publish complete"
