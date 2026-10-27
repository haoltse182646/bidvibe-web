// Local UI verification only. This process never contacts the BidVibe backend.
// Run: node tests/ui-fixture.mjs, then open http://127.0.0.1:5174/#/admin.
// Fake credentials: qa@example.test / qa-only. Never use real credentials here.
import http from 'node:http';
import { createServer } from 'vite';
const today = new Date().toISOString();
const account = { id:'qa-admin',fullName:'QA — Dữ liệu kiểm thử',role:'admin',kind:'ops',status:'active' };
const rows = Array.from({length:20},(_,i)=>({id:i+1,fullName:`Người dùng kiểm thử ${i+1}`,email:`user${i+1}@example.test`,role:i%2?'seller':'bidder',status:i%3?'active':'suspended',createdAt:today}));
const fixture = {
  '/api/admin/dashboard':{auctions:{live:12,endingIn24h:3},appraisal:{pending:7,needsInfo:2},orders:{awaitingPayment:9,awaitingSellerShipment:4,inTransitToWarehouse:5,inspecting:2,outbound:8,deliveredAwaitingConfirm:1},flags:{open:2,paused:1},disputes:{open:1},users:{bidders:120,sellers:30,ops:6,suspended:3},escrowHeld:15400000},
  '/api/admin/report/weekly':{period:{from:today,to:today},auctions:{ended:14,sold:9,cancelled:2},sales:{orders:9,gmv:38000000,estimatedFees:1900000},payments:{paid:7,expired:2},newAccounts:{bidder:8,seller:2},appraisals:{approved:9,rejected:1},disputes:{opened:2,resolved:1},walletTopups:{count:20,total:50000000},topCategories:[{code:'watches',orders:4,gmv:22000000},{code:'electronics',orders:5,gmv:16000000}]},
  '/api/admin/flags':{flags:[{id:1,auction:{id:44,title:'Phiên kiểm thử — không phải dữ liệu thật',currentPrice:8500000,endsAt:today},severity:'high',reason:'Lý do kiểm thử',aiExplanation:'Giải thích kiểm thử',status:'pending',evidence:[{label:'Mẫu kiểm tra',value:'Chỉ dùng cho QA'}]}]},
  '/api/admin/disputes':{disputes:[{id:1,orderId:10,title:'Tranh chấp kiểm thử',itemTitle:'Sản phẩm kiểm thử',buyer:{name:'QA Buyer'},seller:{storeName:'QA Seller'},status:'open',escrowAmount:1000000,timeline:[{at:today,note:'Mở tranh chấp kiểm thử'}]}]},
  '/api/admin/ops-accounts':{accounts:[{id:'qa-admin',name:'QA Admin',email:'qa@example.test',role:'admin',status:'active',weeklyLoad:2}]},
};
const api=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5174');
  res.setHeader('Access-Control-Allow-Headers','Authorization,Content-Type');
  if(req.method==='OPTIONS'){res.writeHead(204).end();return;}
  res.setHeader('Content-Type','application/json');
  const url=new URL(req.url,'http://127.0.0.1');
  let data;let status=200;let message='';
  if(url.pathname==='/api/auth/ops/login'){
    let body='';for await (const chunk of req)body+=chunk;
    const input=JSON.parse(body);
    if(input.email==='qa@example.test'&&input.password==='qa-only')data={token:'local-fixture-only',role:'admin',account};
    else if(input.email==='seller@example.test')data={token:'wrong-role',role:'seller',account};
    else{status=401;message='Email hoặc mật khẩu không đúng';}
  }else if(req.headers.authorization!=='Bearer local-fixture-only'){status=401;message='Phiên đã hết hạn';}
  else if(url.pathname==='/api/me')data=account;
  else if(url.pathname==='/api/admin/accounts'){
    let filtered=rows.filter(r=>(!url.searchParams.get('q')||r.email.includes(url.searchParams.get('q')))&&(!url.searchParams.get('status')||r.status===url.searchParams.get('status'))&&(!url.searchParams.get('role')||r.role===url.searchParams.get('role')));
    data={accounts:filtered.slice(Number(url.searchParams.get('offset')||0),Number(url.searchParams.get('offset')||0)+20)};
  }else if(fixture[url.pathname])data=fixture[url.pathname];else{status=404;message='Không tìm thấy';}
  res.writeHead(status).end(JSON.stringify({success:status===200,data,error:status===200?null:{message,code:status===401?'UNAUTHORIZED':'NOT_FOUND'}}));
});
api.listen(4179,'127.0.0.1');
const vite=await createServer({server:{host:'127.0.0.1',port:5174,strictPort:true},define:{'import.meta.env.VITE_API_BASE_URL':JSON.stringify('http://127.0.0.1:4179')}});
await vite.listen();
console.log('QA fixture only: http://127.0.0.1:5174/#/admin (qa@example.test / qa-only)');
const stop=async()=>{api.close();await vite.close();process.exit(0);};
process.on('SIGINT',stop);process.on('SIGTERM',stop);
