'use client';

import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {AssistantRuntimeProvider,useLocalRuntime,ThreadPrimitive,MessagePrimitive,ComposerPrimitive,type ChatModelAdapter} from '@assistant-ui/react';

type Def={kind:string;version:number;definition:{required:string[];properties:Record<string,string>};skill:string};
type Values=Record<string,string|boolean|number>;
type Saved={id:string;kind:string;version:number;schema_version:number;data:Values};
type Activity={runs:any[];events:any[]};
async function api(path:string,body?:unknown,signal?:AbortSignal,ownerContext?:string){
 const response=await fetch('/api/'+path,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'Content-Type':'application/json',...(ownerContext?{'X-QL-Owner-Context':ownerContext}:{})},body:body===undefined?undefined:JSON.stringify(body),signal});
 const result=await response.json();if(!response.ok)throw Error(result.error);return result;
}
const operation=(name:string,body:unknown,signal?:AbortSignal,owner?:string)=>api('ops/'+name,body,signal,owner);
const key=()=>crypto.randomUUID();

function UserMessage(){return <MessagePrimitive.Root className="message human"><MessagePrimitive.Parts/></MessagePrimitive.Root>;}
function AssistantMessage(){return <MessagePrimitive.Root className="message assistant"><MessagePrimitive.Parts/><MessagePrimitive.Error><p role="alert">Response interrupted. Your saved records are unchanged.</p></MessagePrimitive.Error></MessagePrimitive.Root>;}

function Chat({onSource}:{onSource:(text:string)=>void}){
 const adapter=useMemo<ChatModelAdapter>(()=>({async *run({messages,abortSignal}){
  const latest=messages.filter(m=>m.role==='user').at(-1);
  const source=latest?.content.filter(p=>p.type==='text').map(p=>p.text).join('\n')||'';onSource(source);
  const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:source}),signal:abortSignal});
  if(!response.ok||!response.body)throw Error('Stream unavailable');
  const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',text='',complete=false;
  try{while(true){const part=await reader.read();if(part.done)break;buffer+=decoder.decode(part.value,{stream:true});const lines=buffer.split('\n');buffer=lines.pop()||'';
   for(const line of lines){if(!line)continue;const chunk=JSON.parse(line);if(chunk.error)throw Error('Response interrupted');if(chunk.done)complete=true;if(chunk.text){text+=chunk.text;yield {content:[{type:'text',text}]};}}
  }if(!complete&&!abortSignal.aborted)throw Error('Response interrupted');}finally{await reader.cancel().catch(()=>{});}
 }}),[onSource]);
 const runtime=useLocalRuntime(adapter);
 return <AssistantRuntimeProvider runtime={runtime}><ThreadPrimitive.Root className="thread">
  <ThreadPrimitive.Viewport id="conversation" aria-live="polite"><ThreadPrimitive.Empty><article className="message assistant">I’m here. What would you like to talk through?</article></ThreadPrimitive.Empty><ThreadPrimitive.Messages components={{UserMessage,AssistantMessage}}/></ThreadPrimitive.Viewport>
  <ComposerPrimitive.Root id="chatForm"><label className="sr-only" htmlFor="message">Your thought</label><ComposerPrimitive.Input id="message" placeholder="Leave a thought here…" rows={4} maxLength={16000}/><div className="composer-footer"><span>This preview uses synthetic responses.</span><ComposerPrimitive.Send className="circle" aria-label="Send thought">↑</ComposerPrimitive.Send><ComposerPrimitive.Cancel aria-label="Stop response">Stop response</ComposerPrimitive.Cancel></div></ComposerPrimitive.Root>
 </ThreadPrimitive.Root></AssistantRuntimeProvider>;
}

function Space({owner,onLogout}:{owner:string;onLogout:()=>void}){
 const [inspectionOpen,setInspectionOpen]=useState(false);
 const op=useCallback((name:string,body:unknown,signal?:AbortSignal)=>operation(name,body,signal,owner),[owner]);
 const [defs,setDefs]=useState<Def[]>([]),[kind,setKind]=useState('note'),[values,setValues]=useState<Values>({}),[source,setSource]=useState('');
 const [records,setRecords]=useState<Saved[]>([]),[history,setHistory]=useState<any>(null),[editTitle,setEditTitle]=useState('');
 const [activity,setActivity]=useState<Activity>({runs:[],events:[]}),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const scope=useRef(new AbortController());const active=useRef(true);const saving=useRef(false);
 const inform=useCallback((text:string)=>{if(active.current)setNotice(text);},[]);
 const loadRecords=useCallback(async()=>{const result=await op('query',{},scope.current.signal);if(active.current)setRecords(result.records);},[op]);
 const inspect=useCallback(async(id:string)=>{try{const h=await op('history',{id},scope.current.signal);if(active.current){setHistory(h);setEditTitle(h.record.data.title);}}catch{inform('Record could not be loaded.');}},[inform]);
 useEffect(()=>{
  // Each owner has a fresh runtime, aborted requests, draft and source state.
  active.current=true;scope.current=new AbortController();const signal=scope.current.signal;
  op('discover',{},signal).then(v=>{if(active.current)setDefs(v.definitions);}).catch(()=>inform('Definitions unavailable.'));
  loadRecords().catch(()=>inform('Records unavailable.'));
  const events=new EventSource('/api/events');events.onmessage=e=>{if(active.current){setActivity(JSON.parse(e.data));loadRecords().catch(()=>{});}};events.onerror=()=>{events.close();inform('Live activity disconnected. Reload to reconnect.');};
  return ()=>{active.current=false;scope.current.abort();events.close();};
 },[loadRecords,inform,op]);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4500);return ()=>clearTimeout(timer);},[notice]);
 const definition=defs.find(d=>d.kind===kind);
 async function save(operation:string){
  if(saving.current)return;saving.current=true;setBusy(true);
  // Capture ownership, scope, payload and operation before any asynchronous work.
  const signal=scope.current.signal;const originOwner=owner;const payload={kind,data:Object.fromEntries(Object.entries(values).filter(([,v])=>v!=='')),source};
  try {
   if(!payload.source.trim())throw Error('source_required');
   const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify({operation,...payload}))))).map(n=>n.toString(16).padStart(2,'0')).join('');
   if(signal.aborted||!active.current)return;
   const stored=JSON.parse(sessionStorage.getItem('pending:'+originOwner)||'null');const operationKey=stored?.hash===digest?stored.key:key();sessionStorage.setItem('pending:'+originOwner,JSON.stringify({key:operationKey,hash:digest}));
   const result=await op(operation,{key:operationKey,...payload},signal);
   if(signal.aborted||!active.current)return;sessionStorage.removeItem('pending:'+originOwner);inform(operation==='create'?'Saved. Your source is preserved.':'Queued for the Steward.');await loadRecords();if(result.id)await inspect(result.id);
  }catch(e){if(!signal.aborted)inform(e instanceof Error&&e.message==='source_required'?'Add the original source before saving.':'Could not save. Check required fields, then retry safely.');}
  finally{saving.current=false;if(active.current)setBusy(false);}
 }
 async function correct(){if(!history)return;setBusy(true);try{await op('update',{key:key(),id:history.record.id,expectedVersion:history.record.version,data:{...history.record.data,title:editTitle}},scope.current.signal);inform('Correction saved. Earlier versions preserved.');await inspect(history.record.id);await loadRecords();}catch{inform('Could not update. Reload the record to check its current version.');}finally{if(active.current)setBusy(false);}}
 async function control(operation:string,id:string){try{await op(operation,{key:key(),id},scope.current.signal);}catch{inform('Run changed or is no longer pending.');}}
 const onSource=useCallback((text:string)=>{if(active.current)setSource(text);},[]);
 return <><button id="logout" className="logout" onClick={async()=>{await api('logout',{});onLogout();}}>{owner} · Sign out</button><main id="workspace" className={inspectionOpen?"inspection-open":"conversation-first"}>
  <aside className="library" hidden={!inspectionOpen}><div className="section-title"><h2>Your records</h2><span id="recordCount">{records.length}</span></div><p className="muted">Thoughts with a source.</p><div id="records">{records.length?records.map(r=><button key={r.id} className="record" onClick={()=>inspect(r.id)}><small>{r.kind.replaceAll('_',' ')}</small><strong>{r.data.title}</strong></button>):<p className="empty">No saved thoughts yet.</p>}</div><div className="library-footer">Preserved. Inspectable. Yours.</div></aside>
  <section className="companion"><p className="eyebrow">COMPANION</p><h1>What’s on your mind?</h1><p className="intro">We can start wherever you are.</p><button id="open-inspection" className="space-link" aria-expanded={inspectionOpen} onClick={()=>setInspectionOpen(v=>!v)}>{inspectionOpen?"Back to our conversation":"Your space"}</button><Chat onSource={onSource}/>
   <div className="save-panel" hidden={!inspectionOpen}><div className="section-title"><h2>Keep this thought</h2><span>Explicit save</span></div><label htmlFor="source">Original source</label><textarea id="source" value={source} onChange={e=>setSource(e.target.value)} rows={2} maxLength={16000}/><label htmlFor="kind">Record kind</label><select id="kind" value={kind} onChange={e=>{setKind(e.target.value);setValues({});}}>{defs.map(d=><option key={d.kind} value={d.kind}>{d.kind.replaceAll('_',' ')}</option>)}</select>
    <div id="fields">{Object.entries(definition?.definition.properties||{}).sort(([a],[b])=>a==='title'?-1:b==='title'?1:a.localeCompare(b)).map(([field,type])=><div key={field}><label htmlFor={'field-'+field}>{field[0].toUpperCase()+field.slice(1)}{definition?.definition.required.includes(field)?' *':''}</label>{type==='boolean'?<select id={'field-'+field} value={values[field]===undefined?'':String(values[field])} onChange={e=>setValues(v=>({...v,[field]:e.target.value===''?'':e.target.value==='true'}))}><option value="">Not recorded</option><option value="true">Yes</option><option value="false">No</option></select>:<input id={'field-'+field} type={type==='date'?'date':type==='integer'?'number':'text'} min={type==='integer'?0:undefined} max={type==='integer'?100000:undefined} maxLength={field==='title'?200:16000} value={String(values[field]??'')} onChange={e=>setValues(v=>({...v,[field]:type==='integer'&&e.target.value!==''?Number(e.target.value):e.target.value}))}/>}</div>)}</div>
    <div className="actions"><button id="save" className="primary" disabled={busy} onClick={()=>save('create')}>Save now</button><button id="enqueue" disabled={busy} onClick={()=>save('enqueue')}>Ask Steward to save</button></div><p className="hint">The original source is preserved. Saved is shown after the database commits.</p></div>
  </section>
  <aside className="inspection" hidden={!inspectionOpen}><div className="section-title"><h2>Inspection</h2><span className="dot"/></div><div id="inspect">{history?<><span className="tag">SOURCE & HISTORY</span><h3>{history.record.data.title}</h3><p className="source">{history.source.body}</p><div className="audit"><div>Version {history.record.version} · schema {history.record.schema_version}</div><div>Source {history.source.id}</div>{history.revisions.map((r:any)=><div key={r.version}><div>Revision {r.version} · {r.actor}</div><pre>{JSON.stringify(r.data,null,2)}</pre></div>)}{history.events.map((e:any)=><div key={e.id}>{e.action} · {e.actor} · {new Date(e.created_at).toLocaleString()}</div>)}</div><label htmlFor="edit-title">Correct the title</label><input id="edit-title" value={editTitle} onChange={e=>setEditTitle(e.target.value)} maxLength={200}/><button disabled={busy} onClick={correct}>Save correction</button></>:<p className="empty">Choose a record to see its source and changes.</p>}</div>
   <div className="section-title activity-title"><h2>Steward</h2><span>Separate worker</span></div><p className="hint">Quiet background work. Conversation stays available.</p><div id="runs">{activity.runs.length?activity.runs.map(run=><div className="run" key={run.id}><span className="status">{run.visible_status}</span><small>Run {run.id.slice(0,8)} · attempt {run.attempt} · step {run.step}</small>{run.error_code&&<p>The worker failed. You can retry safely.</p>}{run.record_id&&<button onClick={()=>inspect(run.record_id)}>Inspect result</button>}{['queued','running'].includes(run.status)&&<button onClick={()=>control('cancel',run.id)}>Cancel</button>}{run.status==='failed'&&<button onClick={()=>control('retry',run.id)}>Retry</button>}<details><summary>Run activity</summary>{activity.events.filter(e=>e.run_id===run.id).map(e=><p key={e.id}>{e.action} · {e.actor}</p>)}</details></div>):<p className="empty">No work queued.</p>}</div>
  </aside></main>{notice&&<div id="notice" role="status" aria-live="polite">{notice}</div>}</>;
}

export default function Page(){
 const [owner,setOwner]=useState<string|null>(null),[loading,setLoading]=useState(true),[username,setUsername]=useState('alice'),[password,setPassword]=useState(''),[error,setError]=useState('');
 useEffect(()=>{const controller=new AbortController();api('me',undefined,controller.signal).then(v=>setOwner(v.owner)).catch(()=>{}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return ()=>controller.abort();},[]);
 return <><header><a className="brand" href="/">◌ <span>quellight</span></a><div className="environment">PREVIEW <span>· Synthetic responses</span></div></header>{loading?<main className="login"><p>Opening your space…</p></main>:owner?<Space key={owner} owner={owner} onLogout={()=>{setOwner(null);setPassword('');}}/>:<main id="loginView" className="login"><p className="eyebrow">A PLACE TO RETURN TO</p><h1>A little continuity.</h1><p>Keep a thought, return to its source, and see what changed.</p><form id="loginForm" onSubmit={async e=>{e.preventDefault();setError('');try{const r=await api('login',{username,password});setPassword('');setOwner(r.owner);}catch{setError('Sign-in failed. Check your local fixture password.');}}}><label htmlFor="username">Synthetic owner</label><select id="username" value={username} onChange={e=>setUsername(e.target.value)}><option value="alice">Alice</option><option value="bob">Bob</option></select><label htmlFor="password">Local fixture password</label><input id="password" type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/><button className="primary" type="submit">Enter your space <span>↗</span></button>{error&&<p role="alert">{error}</p>}</form><p className="hint">Use generated local fixture credentials from setup. No personal history is present.</p></main>}<footer>QUELLIGHT <span>A private space to think · Local preview</span></footer></>;
}
