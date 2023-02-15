Some code I use for experimenting with direct requests to Google Maps' `/vt?pb=` map tile endpoint.

## Build
```sh
git clone https://github.com/sk-zk/vt.git
cd vt
npm i --global rollup
npm i
rollup -c
python -m http.server
```
