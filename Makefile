PLATFORM ?= darwin

all: deps build

deps:
	@cd client; npm install;cd ..

build: electron-packager
	@rm -rf bin; \
	mkdir -p bin; \
	electron-packager client wall-monitor-kiosk --platform=${PLATFORM} \
		--arch=x64 --out=bin --icon=client/icon.icns \
		--ignore="node_modules/electron-*" \
		--overwrite

electron-packager:
	@if [ -z "$(which electron-packager)" ]; then \
		echo "ERROR: "; \
	fi

#  npm install electron-packager -g;
