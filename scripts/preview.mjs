import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist'),port=Number(process.env.PORT)||4173;
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4'};
http.createServer(async(req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const relative=pathname==='/'?'index.html':pathname.slice(1);
  let filename=path.resolve(root,relative);
  if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(!path.extname(filename))filename+='.html';
  let body,status=200;
  try{body=await readFile(filename);}catch{filename=path.join(root,'404.html');body=await readFile(filename);status=404;}
  res.writeHead(status,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(body);
 }catch{res.writeHead(400).end('Solicitud no válida');}
}).listen(port,'127.0.0.1',()=>console.log('Preview local: http://localhost:'+port));
