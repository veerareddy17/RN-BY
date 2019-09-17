set -e 
git checkout master 
echo 'Enter tag:' 
read tag 
git fetch --tags 
git merge $tag 
#git commit 
git push aws master 
git push vsts master

