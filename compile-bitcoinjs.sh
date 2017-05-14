##
## Compiles a minified version of bitcoinjs into the src directory (/src/config)
##

# yarn install / npm install
if command -v yarn 2> /dev/null ; then
	yarn install
	echo ""
else 
	echo "Using npm install as fallback, because yarn is not installed."
	npm install
	echo ""
fi

# install command (see https://bitcoinjs.org/ for details)
echo "Compiling library..."
node ./node_modules/browserify/bin/cmd.js -r bitcoinjs-lib -s bitcoin | node ./node_modules/uglify-js/bin/uglifyjs > ./src/config/library-bitcoinjs.min.js
echo "Library compiled to ./src/config/library-bitcoinjs.min.js"
