import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
// A deterministic LanguageModelV3 adapter. No HTTP/provider/client credentials exist here.
export function fakeModel() {
 let calls=0;
 return {specificationVersion:/** @type {const} */('v3'),provider:'local-fixture',modelId:'synthetic-c1-v1',supportedUrls:{},
  async doGenerate(){throw Error('Use streaming fixture');},
  async doStream(options){
   calls++;
   const toolResult=options.prompt.some(m=>m.role==='tool');
   const parts=toolResult?[
    {type:'text-start',id:'answer'},
    ...['This is a synthetic Companion response. ','Your records remain yours to inspect and correct.'].map(delta=>({type:'text-delta',id:'answer',delta})),
    {type:'text-end',id:'answer'}
   ]:[{type:'tool-call',toolCallId:'discovery',toolName:'discover',input:'{}'}];
   const stream=new ReadableStream({async start(controller){
    controller.enqueue({type:'stream-start',warnings:[]});
    for(const part of parts) {
     if(options.abortSignal?.aborted){controller.error(new Error('aborted'));return;}
     controller.enqueue(part);await new Promise(r=>setTimeout(r,10));
    }
    controller.enqueue({type:'finish',finishReason:{unified:toolResult?'stop':'tool-calls',raw:toolResult?'stop':'tool_calls'},usage:{inputTokens:{total:1,noCache:1,cacheRead:0,cacheWrite:0},outputTokens:{total:1,text:1,reasoning:0}}});
    controller.close();
   }});
   return {stream};
  },get calls(){return calls;}
 };
}
/** @param {{discover:()=>Promise<unknown>,signal?:AbortSignal,onText?:(text:string)=>unknown}} options */
export async function streamCompanion({discover,signal,onText}) {
 const model=fakeModel();let tools=0;
 const agent=new Agent({id:'c1-companion-fixture',name:'Companion fixture',model,
  instructions:'Synthetic local proof. Discover definitions; never claim a saved record from conversation.',
  tools:{discover:createTool({id:'discover',description:'Read allowed definitions',inputSchema:z.object({}).strict(),execute:async()=>{tools++;return discover();}})}});
 const output=await agent.stream('Run the deterministic local proof.',{maxSteps:3,abortSignal:signal});
 let text='';for await(const chunk of output.textStream){text+=chunk;await onText?.(chunk);}
 const reason=await output.finishReason;
 if(signal?.aborted)throw new Error('aborted');
 return {text,modelCalls:model.calls,tools,reason};
}
