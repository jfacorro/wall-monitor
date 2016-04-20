all: deps build

deps:
	npm install

build: electron-packager
	@rm -rf bin
	@mkdir -p bin
	@electron-packager . wall-monitor-kiosk --platform=all --arch=x64 \
		--out=bin --icon=icon.icns

electron-packager:
	@if [ -z "$(which electron-packager)" ]; then \
		echo "ERROR: "; \
	fi



#  npm install electron-packager -g;
