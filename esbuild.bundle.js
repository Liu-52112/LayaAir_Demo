const path = require('path');
const fs = require('fs');
const child = require('child_process');
const dir_code = path.resolve(__dirname, 'bin/js');
const dir_bundleJs = path.join(dir_code, 'bundle.js');
const dir_bundleJsMin = path.join(dir_code, 'bundle.min.js');
const argv = process.argv.slice(2);

const compilationTimePlugin = {
  name: 'compilationTime',
  setup(build) {
    build.onEnd(result => {
      const d = new Date;
      const fz = s => typeof s == 'number' && s < 10 ? `0${+s}` : `${s}`;
      const cVersion = `${d.getFullYear()}-${fz(d.getMonth() + 1)}-${fz(d.getDate())} ${fz(d.getHours())}:${fz(d.getMinutes())}:${fz(d.getSeconds())}`;
      const additionalContent = `window['COMPILATION_VERSION'] = "${cVersion}";`;
      try {
        const jsContent = fs.readFileSync(dir_bundleJs, 'utf-8');
        fs.writeFileSync(dir_bundleJs, `${jsContent}\n;${additionalContent}`);
      } catch (e) { }
      try {
        const jsMinContent = fs.readFileSync(dir_bundleJsMin, 'utf-8');
        fs.writeFileSync(dir_bundleJsMin, `${jsMinContent}\n;${additionalContent}`);
      } catch (e) { }
      console.log('COMPILATION_VERSION: ', cVersion);
      console.log('esbuild build finish');
    })
  }
}

const esbuild = require('esbuild');
const esbuildOptions = {
  entryPoints: ['src/Main.ts'],
  bundle: true,
  outfile: 'bin/js/bundle.js',
  plugins: [compilationTimePlugin],
}

esbuild.build(esbuildOptions);
if (!!argv.find(v => v == '--min')) {
  console.log('tsc syntax check start');
  child.exec('tsc --noEmit', (err, sto) => {
    console.log('err:'+err);
    console.log(sto);
    console.log('tsc syntax check finish');
    esbuild.build({
      ...esbuildOptions,
      outfile: 'bin/js/bundle.min.js',
      minify: true
    })
  })
}