#!/usr/bin/env bash

echo "Build site"
grunt build --force
echo "Succesfully built site"
echo "Commit new build"
git add dist && git commit -m "New build"
echo "Deploy build to GH Pages"
git subtree push --prefix dist stage gh-pages
echo "Successfully updated site"