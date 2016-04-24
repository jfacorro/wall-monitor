# Wall Monitors #

This is a project that aims to implement a client and a server for showing web based graphs in wall monitors. I guess the name is pretty self-explanatory.

## Client (Kiosk) ##

The client is an [electron](http://electron.atom.io/) application that reads a configuration an opens as many browser windows as specified in it.

Currently the client get the configuration from a YAML file in the local file system, but the idea is that each client requests its configuration from a central server. This makes updating the configuration of any wall monitor in the system trivial.

### Configuration ###

Each screen has a number of URLs that it will show with a specific layout. Current available layouts are `carrousel` and `splitted`.

The `carrousel` layout has a single configuration value called `time`, which determines for how long a specific URL is shown on screen before rotating to the next one. The value is an integer which represent the amount of milliseconds.

The `splitted` layout also has a single configuration value called `orientation`, which determines if the screen will be splitted in the `vertical` or `horizontal` direction.

The following is an example of what a configuration would look like in YAML:

```yaml
- name: "Screen 1"
  urls:
    - "http://google.com"
    - "http://github.com"
  layout:
    name: "splitted"
    orientation: "vertical"

- name: "Screen 2"
  urls:
    - "http://lanacion.com.ar"
    - "http://stackoverflow.com"
  layout:
    name: "carrousel"
    time: 5000

- name: "Screen 3"
  urls:
    - "http://twitter.com"
    - "http://start"
  layout:
    name: "carrousel"
    time: 10000
```

## Server ##

The server will keep the configuration of every wall monitor client in a central database.

A possible way to uniquley identify clients would be to have them register with the server when they are initiated. Then the server would generate this unique identifier and the client will store it locally for further use.

When a client's configuration is changed the client should update its screens accordingly.
