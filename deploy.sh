#!/bin/sh

#servers to deploy to

SERVERS=( "bitcoin2-test.csg.uzh.ch" )

if [ "$#" -eq 1 ]; then
   PRIV="-i $1 "
fi


#Build and install of the frontend
if ! yarn install; then
    echo "yarn install failed"
    exit 1
fi
if ! yarn run build; then
    echo "yarn build failed"
    exit 1
fi

#Deployment
for i in "${SERVERS[@]}"
do
    ssh "$PRIV$i" 'sudo rm -rf /var/www/html/*'
    scp -r "$PRIV" dist/* "$i":/var/www/html
done
