# a-vue-into-3d-starter-vue3

About: This is the project that I built while writing Chapter 2 of a [A Vue into 3D](https://radicalappdev.com/2021/11/23/a-vue-into-3d-introduction/).

## Local network SSL certs

Used for testing the WebXR scene on an Oculus Quest while connected to the dev server over the local network.
More info: https://bharathvaj.me/blog/use-ssl-with-vue-cli-locally

run

```
mkdir -p .certs
```

then

```
mkcert -key-file ./.certs/key.pem -cert-file ./.certs/cert.pem "localhost"
```

If you don't want to use these certs just disable the following lines in `vue.config.js`

```
 https: {
      key: fs.readFileSync(".certs/key.pem"),
      cert: fs.readFileSync(".certs/cert.pem")
    },
```

---

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
