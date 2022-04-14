<p align="center"><a href="https://k6.io/"><img src="assets/k6-logo-with-grafana.svg" alt="k6" width="258" height="210" /></a></p>

<h3 align="center">Like unit testing, for performance</h3>
<p align="center">A modern load testing tool for developers and testers in the DevOps era.</p>

<br/>
<img src="assets/github-hr.png" alt="---" />
<br/>

**k6** is a modern load testing tool, building on [our](https://k6.io/about) years of experience in the load and performance testing industry. It provides a clean, approachable scripting API, [local](https://k6.io/docs/getting-started/running-k6) and [cloud execution](https://k6.io/docs/cloud), and flexible configuration.

Install
-------

### Mac

Install with [Homebrew](https://brew.sh/) by running:

```bash
brew install k6
```

### Windows

If you use the [Chocolatey package manager](https://chocolatey.org/) you can install the unofficial k6 package with:

```
choco install k6
```

Running k6
----------

k6 works with the concept of **virtual users** (VUs) that execute scripts - they're essentially glorified, parallel `while(true)` loops. Scripts are written using JavaScript as ES6 modules, which allows you to break larger tests into smaller and more reusable pieces, making it easy to scale tests across an organization.

Scripts must contain, at the very least, an exported `default` function - this defines the entry point for your VUs, similar to the `main()` function in many languages. Let's create a very simple script that makes an HTTP GET request to a test website:

```js
import http from "k6/http";
export default function() {
    let response = http.get("https://reqres.in/api/users");
};
```

The script details and how we can extend and configure it will be explained below, but for now, simply save the above snippet as a `script.js` file somewhere on your system. Assuming that you've [installed k6](#install) correctly, on Linux and Mac, you can run the saved script by executing `k6 run script.js` from the same folder. For Windows, the command is almost the same - `k6.exe run script.js`.
