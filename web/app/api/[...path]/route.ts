// Streaming adapter to the existing authenticated gateway. Never proxy arbitrary destinations.
export const runtime='nodejs';
export const dynamic='force-dynamic';
async function proxy(request:Request){
 const incoming=new URL(request.url);
 const expected=process.env.QL_FRONTEND_ORIGIN||'http://127.0.0.1:4317';
 if(request.headers.get('host')!==new URL(expected).host)return Response.json({error:'invalid_host'},{status:403});
 if(request.method==='POST'&&request.headers.get('origin')!==expected)return Response.json({error:'origin_or_content_type'},{status:403});
 const port=Number(process.env.QL_PORT||4318);
 if(!Number.isInteger(port)||port<1||port>65535)throw Error('Local API port required');
 if(!/^\/api\/[a-zA-Z0-9_/-]+$/.test(incoming.pathname))return Response.json({error:'not_found'},{status:404});
 const headers=new Headers();
 for(const name of ['cookie','origin','content-type','x-ql-owner-context']){const value=request.headers.get(name);if(value)headers.set(name,value);}
 let body:string|undefined;
 if(request.method==='POST'){
  // Bound the proxy too; do not buffer unbounded client bodies before the gateway checks them.
  const reader=request.body?.getReader();const chunks:Uint8Array[]=[];let bytes=0;
  if(reader)while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>32768){await reader.cancel();return Response.json({error:'request_too_large'},{status:413});}chunks.push(part.value);}
  body=Buffer.concat(chunks).toString('utf8');
 }
 try {
  const upstream=await fetch(`http://127.0.0.1:${port}${incoming.pathname}${incoming.search}`,{method:request.method,headers,body,cache:'no-store',signal:request.signal});
  const responseHeaders=new Headers({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  for(const name of ['content-type','set-cookie']){const value=upstream.headers.get(name);if(value)responseHeaders.set(name,value);}
  return new Response(upstream.body,{status:upstream.status,headers:responseHeaders});
 }catch{return Response.json({error:'gateway_unavailable'},{status:503});}
}
export const GET=proxy;
export const POST=proxy;
