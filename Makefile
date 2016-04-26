PLATFORM ?= darwin

ELECTRON_PACKAGER=$(which electron-packager)

all: deps build

deps:
	@cd client; npm install;cd ..

build: electron-packager
	@rm -rf bin client/config.yml; \
	mkdir -p bin; \
	electron-packager client wall-monitor-kiosk --platform=${PLATFORM} \
		--arch=x64 --out=bin --icon=client/icon.icns \
		--ignore="node_modules/electron-*" \
		--overwrite

electron-packager:
	@if [ -z "$(shell which electron-packager)" ]; then \
		npm install electron-packager -g; \
	fi
