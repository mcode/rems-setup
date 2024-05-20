# Steps to Publish a Release

1. Make sure all outstanding features and pull requests are merged into the dev branch of each respective project repo.
2. Pull the dev branch locally for each respective project repo  and test the entire worflow end to end to ensure that everything is functional.
3. For each repo, create a pull request that merges dev into main and merge dev into main. 
4. For each repo, except for rems-setup, draft a new release, incrementing the version number as need be and setting as a pre-release since our prorotype is not intended for production use.
5. Ensure that for each respective project repo that the CD pipeline correctly automatically built the new docker images with the corresponding version tags.  
6. In the rems-setup repo, update the version number tags in the docker-compose.yml file to match with our release version tags from step 5. Do this in either main or dev and merge to the other.
7. Draft a release for the rems-setup repo similar to in step 6.
