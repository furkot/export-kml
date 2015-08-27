check: lint test

lint:
	./node_modules/.bin/jshint *.js lib test

test:
	./node_modules/.bin/mocha --recursive --require should

validate:
	xmllint --noout --schema http://www.opengis.net/kml/2.2 test/fixtures/*.kml

.PHONY: check lint test validate
