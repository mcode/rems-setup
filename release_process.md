# Steps to Publish a Release

1. Make sure all outstanding features and pull requests are merged into the dev branch of each respective project repo.
2. Pull the dev branch locally for each respective project repo  and test the entire worflow end to end to ensure that everything is functional.
3. For each repo, create a pull request that merges dev into main and merge dev into main. 
4. For each repo, except for rems-setup, draft a new release, incrementing the version number as need be and setting as a pre-release since our prorotype is not intended for production use. 
5. In the rems-setup repo, update the version numbers in the docker-compose.yml file to match with our release number (new container images were built automatically in step 3) in either the main or the dev branch, then merge into the other.
6. Draft a release for the rems-setup repo similar to in step 6.
