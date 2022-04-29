# Read Me

This is for learning purpose.

In practice, you should not commit functions/.secret/prod.json file to the repository.

quick start:

1. `npm run reinstall`
2. change all the `REACT_APP_xxx` configs in `.github` folder to your own configs, you can use same config for both
3. backup `.github` folder to other folder.
4. `firebase init` setup Github Action deploys
5. copy the `firebaseServiceAccount` and `projectId` from the new `.github` folder to backup `.github` folder.
6. Delete the new `.github` folder and move back the back `.github` folder.
7. Change all the `REACT_APP_xxx` configs in `.config` folder to your own configs, you can use same config for both file
8. make sure the default project name in `firebase.json` is correct.

To work in dev:

1. Run `npm run f-d-deploy` to deploy functions to dev.
2. Run `npm run d-start` to start localhost.

To go live:

1. Run `npm run f-p-deploy` to deploy functions to prod.
2. Commit your code, it will deploy hosting to prod.
