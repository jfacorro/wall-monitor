all: deps build

deps:
	@cd client; npm install;cd ..

build: electron-packager
	@rm -rf bin
	@mkdir -p bin
	@electron-packager client wall-monitor-kiosk --platform=all --arch=x64 \
		--out=bin --icon=icon.icns

electron-packager:
	@if [ -z "$(which electron-packager)" ]; then \
		echo "ERROR: "; \
	fi

#  npm install electron-packager -g;
