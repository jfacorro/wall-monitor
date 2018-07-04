# Wall Monitors #

This is a project that aims to implement a client for showing web based graphs in wall monitors.

## Client ##

The client is an [electron](http://electron.atom.io/) application that reads a configuration an opens
as many browser windows as specified in it.

The client reads the configuration from a YAML file that is provided either through the local file system
or through an HTTP POST request to the web server listening on port `8080`. This makes updating the
configuration of any wall monitor in the system trivial.

The following is an example request using `curl`:

```
curl -v -X POST "http://localhost:8080/load" --data-binary @config.yml
```

### Configuration ###

Each screen has a number of URLs that it will show with a specific layout. Current available layouts are
`carrousel` and `splitted`.

The `carrousel` layout has a single configuration value called `time`, which determines for how long a
specific URL is shown on screen before rotating to the next one. The value is an integer which represent
the amount of milliseconds.

The `splitted` layout also has a single configuration value called `orientation`, which determines if the
screen will be splitted in the `vertical` or `horizontal` direction.

The following is an example of what a configuration would look like in YAML:

```yaml
- name: "Screen 1"
  pages:
    - url: "http://google.com"
      zoom: 0.5
    - url: "http://github.com"
      code: "alert('hello world!');"
  layout:
    name: splitted
    orientation: vertical

- name: "Screen 2"
  pages:
    - url: "http://lanacion.com.ar"
    - url: "http://stackoverflow.com"
  layout:
    name: carrousel
    time: 5000

- name: "Screen 3"
  pages:
    - url: "http://twitter.com"
    - url: "http://start"
  layout:
    name: carrousel
    time: 10000
```
