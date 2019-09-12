set -e
git checkout qa
echo 'Enter tag:'
read tag
git fetch --tags
git merge $tag
#git commit
git push origin qa

