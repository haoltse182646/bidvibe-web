// Local QA only. Never contacts BidVibe. Restart to reset all fake records.
// Run node tests/ui-fixture.mjs; fake account qa@example.test / qa-only.
import http from 'node:http';
import {createServer} from 'vite';
const now=new Date().toISOString();
const me={id:'900',fullName:'QA — Dữ liệu kiểm thử',role:'admin',kind:'ops',status:'active'};
const users=Array.from({length:24},(_,i)=>({id:String(i+1),fullName:`Người dùng kiểm thử ${i+1}`,email:`user${i+1}@example.test`,role:i%2?'seller':'bidder',status:i%3?'active':'suspended',createdAt:now}));
const ops=[{id:'900',name:me.fullName,email:'qa@example.test',role:'admin',status:'active',weeklyLoad:2,hasPassword:true},{id:'901',name:'Thẩm định QA',email:'appraiser@example.test',role:'appraiser',status:'active',weeklyLoad:5,hasPassword:true},{id:'902',name:'Kho QA',email:'warehouse@example.test',role:'warehouse',status:'suspended',weeklyLoad:3,hasPassword:true}];
const flags=[1,2,3].map(i=>({id:String(i),auction:{id:String(44+i),title:`Bình gốm kiểm thử ${i}`,status:'active',currentPrice:8500000,endsAt:now},severity:i===1?'high':'medium',reason:'Lý do kiểm thử',aiExplanation:'Giải thích kiểm thử',status:'pending',evidence:[{label:'Mẫu kiểm tra',value:'Chỉ dùng cho QA'}]}));
const disputes=[1,2].map(i=>({id:String(i),orderId:String(10+i),title:`Tranh chấp kiểm thử ${i}`,itemTitle:'Cổ vật kiểm thử',buyer:{name:'QA Buyer'},seller:{storeName:'QA Seller'},status:'open',escrowAmount:1000000,timeline:[{at:now,note:'Mở tranh chấp kiểm thử'}]}));
const weekly={period:{from:new Date(Date.now()-7*86400000).toISOString(),to:now},auctions:{ended:14,sold:9,cancelled:2},sales:{orders:9,gmv:38000000,estimatedFees:1900000},payments:{paid:7,expired:2},newAccounts:{bidder:8,seller:2},appraisals:{approved:9,rejected:1},disputes:{opened:2,resolved:1},walletTopups:{count:20,total:50000000},topCategories:[{code:'Gốm sứ',orders:4,gmv:22000000},{code:'Đồ đồng',orders:5,gmv:16000000}]};
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
const find=(rows,id)=>rows.find(r=>r.id===id)||fail('Không tìm thấy',404);
function page(rows,url){const p=url.searchParams;return rows.filter(r=>(!p.get('status')||r.status===p.get('status'))&&(!p.get('role')||r.role===p.get('role'))&&(!p.get('q')||`${r.fullName||r.name} ${r.email}`.toLowerCase().includes(p.get('q').toLowerCase()))).slice(Number(p.get('offset')||0),Number(p.get('offset')||0)+Number(p.get('limit')||100));}
const server=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5174');res.setHeader('Access-Control-Allow-Headers','Authorization,Content-Type');res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,OPTIONS');
  if(req.method==='OPTIONS'){res.writeHead(204).end();return;}
  res.setHeader('Content-Type','application/json');
  const url=new URL(req.url,'http://127.0.0.1');const path=url.pathname;let data;let status=200;
  try{
    let raw='';for await(const chunk of req)raw+=chunk;const body=raw?JSON.parse(raw):{};
    if(path==='/api/auth/ops/login'){
      if(body.email==='qa@example.test'&&body.password==='qa-only')data={token:'local-fixture-only',role:'admin',account:me};
      else if(body.email==='seller@example.test')data={token:'wrong-role',role:'seller',account:me};else fail('Email hoặc mật khẩu không đúng',401);
    }else{
      if(req.headers.authorization!=='Bearer local-fixture-only')fail('Phiên đã hết hạn',401);
      if(path==='/api/me')data=me;
      else if(path==='/api/admin/dashboard')data={auctions:{live:12,endingIn24h:3},appraisal:{pending:7,needsInfo:2},orders:{awaitingPayment:9,awaitingSellerShipment:4,inTransitToWarehouse:5,inspecting:2,outbound:8,deliveredAwaitingConfirm:1},flags:{open:flags.filter(f=>['pending','paused','verify'].includes(f.status)).length,paused:flags.filter(f=>f.status==='paused').length},disputes:{open:disputes.filter(d=>d.status==='open').length},users:{bidders:120,sellers:30,ops:ops.length,suspended:3},escrowHeld:15400000};
      else if(path==='/api/admin/report/weekly')data=weekly;
      else if(req.method==='GET'){
        const lists={'/api/admin/accounts':['accounts',users],'/api/admin/ops-accounts':['accounts',ops],'/api/admin/flags':['flags',flags],'/api/admin/disputes':['disputes',disputes]};const value=lists[path];if(!value)fail('Không tìm thấy',404);data={[value[0]]:page(value[1],url)};
      }else if(path==='/api/admin/ops-accounts'&&req.method==='POST'){
        if(ops.some(o=>o.email===body.email))fail('Email này đã được dùng cho tài khoản nội bộ khác',409);
        if(!body.name||!body.email||!['appraiser','warehouse','admin'].includes(body.role)||(body.password||'').length<6)fail('Thiếu dữ liệu hợp lệ');
        data={id:String(903+ops.length),name:body.name,email:body.email,role:body.role,status:'active',weeklyLoad:0,hasPassword:true};ops.push(data);status=201;
      }else if(/^\/api\/admin\/ops-accounts\/\d+$/.test(path)&&req.method==='PATCH'){
        const row=find(ops,path.split('/').at(-1));if(row.id==='900'&&(body.status==='suspended'||(body.role&&body.role!=='admin')))fail('Không thể tự khóa',409);
        const {password,...fields}=body;Object.assign(row,fields);data=row;if(row.id==='900')me.fullName=row.name;
      }else if(/^\/api\/admin\/accounts\/\d+$/.test(path)&&req.method==='PATCH'){
        const row=find(users,path.split('/').at(-1));if(!['active','suspended'].includes(body.status))fail('Trạng thái không hợp lệ');row.status=body.status;data=row;
      }else if(/^\/api\/admin\/flags\/\d+\/action$/.test(path)&&req.method==='POST'){
        const row=find(flags,path.split('/').at(-2));if(['safe','terminated'].includes(row.status))fail('Cờ đã xử lý xong',409);
        const next={pause:'paused',verify:'verify',safe:'safe',terminate:'terminated'}[body.action];if(!next||next===row.status||(body.action==='terminate'&&!body.reason?.trim()))fail('Hành động không hợp lệ',409);
        row.status=next;if(body.action==='terminate')row.auction.status='cancelled';data=row;
      }else if(/^\/api\/admin\/disputes\/\d+\/resolve$/.test(path)&&req.method==='POST'){
        const row=find(disputes,path.split('/').at(-2));if(row.status!=='open')fail('Tranh chấp đã được xử lý',409);if(!['keep','refund'].includes(body.resolution))fail('Phán quyết không hợp lệ');row.status='resolved';row.resolution=body.resolution;row.timeline.push({at:new Date().toISOString(),note:`QA: ${body.resolution} ${body.note||''}`});data=row;
      }else fail('Không tìm thấy',404);
    }
    if(req.method!=='GET')console.log(`[QA] ${req.method} ${path} -> ${status}`);
    res.writeHead(status).end(JSON.stringify({success:true,data,error:null}));
  }catch(error){res.writeHead(error.status||500).end(JSON.stringify({success:false,data:null,error:{message:error.message,code:error.status===409?'INVALID_STATE':error.status===401?'UNAUTHORIZED':'VALIDATION_ERROR'}}));}
});
server.listen(4179,'127.0.0.1');
const vite=await createServer({server:{host:'127.0.0.1',port:5174,strictPort:true},define:{'import.meta.env.VITE_API_BASE_URL':JSON.stringify('http://127.0.0.1:4179')}});await vite.listen();
console.log('QA fixture only: http://127.0.0.1:5174/#/admin (qa@example.test / qa-only)');
const stop=async()=>{server.close();await vite.close();process.exit(0);};process.on('SIGINT',stop);process.on('SIGTERM',stop);
