// MODULE: file:// compatibility; HTTP uses original ES Modules, local files use a generated bundle.
if(location.protocol==='file:') {
  const script=document.createElement('script');script.src=new URL('bundle.js',document.currentScript.src).href;document.head.append(script);
} else {
  import('./app.js').catch(error=>{document.getElementById('view').textContent='Aplikasi gagal dimuat: '+error.message;});
}
