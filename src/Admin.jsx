import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, LayoutDashboard, ChartColumn, Flag, MessageSquareWarning, Users, UserCog, LogOut, RefreshCw, ShieldCheck, Eye, EyeOff, Gavel, Wallet, Clock, PackageCheck, Search, ChevronLeft, ChevronRight, X, Download, Plus, Pencil, LockKeyhole, Unlock, Check } from 'lucide-react';
import { Brand } from './Landing';
import { createApi } from './api';
import AdminAction, { Dialog } from './AdminActions';
import { flagActions } from './admin-model';
import { OverviewCharts, WeeklyCharts } from './AdminCharts';

const money = value => value == null ? '—' : new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND', maximumFractionDigits:0 }).format(value);
const number = value => value == null ? '—' : new Intl.NumberFormat('vi-VN').format(value);
const date = value => value ? new Date(value).toLocaleString('vi-VN') : '—';
const labels = { active:'Hoạt động', suspended:'Tạm khóa', admin:'Admin', bidder:'Bidder', seller:'Seller', appraiser:'Thẩm định', warehouse:'Kho', pending:'Chờ xử lý', paused:'Tạm dừng', verify:'Cần xác minh', safe:'An toàn', terminated:'Đã chấm dứt', open:'Đang mở', resolved:'Đã xử lý', high:'Cao', medium:'Trung bình', low:'Thấp', refund:'Hoàn tiền', keep:'Giữ giao dịch', approved:'Đã duyệt', rejected:'Từ chối', needs_info:'Cần bổ sung' };
const tabs = [
  { id:'overview', title:'Tổng quan', icon:LayoutDashboard, path:'/admin/dashboard' },
  { id:'weekly', title:'Báo cáo tuần', icon:ChartColumn, path:'/admin/report/weekly' },
  { id:'flags', title:'Phiên nghi vấn', icon:Flag, path:'/admin/flags', key:'flags' },
  { id:'disputes', title:'Tranh chấp', icon:MessageSquareWarning, path:'/admin/disputes', key:'disputes' },
  { id:'accounts', title:'Người dùng', icon:Users, path:'/admin/accounts', key:'accounts' },
  { id:'ops', title:'Tài khoản nội bộ', icon:UserCog, path:'/admin/ops-accounts', key:'accounts' },
];
function Status({ value }) { return <span className={`status status-${value}`}>{labels[value] || value || '—'}</span>; }
function Metric({ icon:Icon, label, value, caption, accent }) { return <article className="metric"><div className={`metric-icon ${accent || ''}`}><Icon size={20}/></div><p>{label}</p><strong>{value}</strong>{caption && <small>{caption}</small>}</article>; }
function Login({ api, onLogin }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(true);
  useEffect(()=>{ mounted.current = true; return ()=>{ mounted.current = false; }; },[]);
  async function submit(e) {
    e.preventDefault(); if (busy) return;
    const form = new FormData(e.currentTarget);
    setBusy(true); setError('');
    try {
      const result = await api('/auth/ops/login', { method:'POST', auth:false, body:{ email:form.get('email').trim(), password:form.get('password') } });
      if (!result.token || result.role !== 'admin') throw new Error('Tài khoản này không có quyền Admin. Vui lòng dùng tài khoản quản trị.');
      // Verify the returned identity on the backend before rendering the admin area.
      const verify = createApi(import.meta.env.VITE_API_BASE_URL || 'https://bidvibe-be.onrender.com', ()=>result.token);
      const me = await verify('/me');
      if (me.role !== 'admin' || me.kind !== 'ops' || me.status !== 'active') throw new Error('Tài khoản không có quyền quản trị đang hoạt động.');
      if (mounted.current) onLogin({ token:result.token, account:me });
    } catch(err) { if (mounted.current) setError(err.message); }
    finally { if (mounted.current) setBusy(false); }
  }
  return <main className="login-page"><div className="login-story"><Brand light/><div><p className="eyebrow">BIDVIBE / KHÔNG GIAN QUẢN TRỊ</p><h1>Mọi nhịp đấu giá.<br/>Trong một <span className="serif">tầm nhìn.</span></h1><p>Không gian quản trị để theo dõi vận hành,<br/>nắm bắt dữ liệu và chăm sóc trải nghiệm BidVibe.</p><div className="login-decoration"><Gavel size={140} strokeWidth={.7}/><span>✳</span></div></div><small>Được kết nối với hệ thống BidVibe.</small></div><div className="login-main"><a className="back-link" href="#"><ArrowLeft size={16}/> Về trang chủ</a><div className="login-form-wrap"><span className="login-shield"><ShieldCheck size={28}/></span><p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p><h2>Đăng nhập quản trị</h2><p>Sử dụng tài khoản Admin nội bộ của BidVibe.</p><form onSubmit={submit}><label htmlFor="email">Email quản trị</label><input id="email" name="email" type="email" placeholder="Email của bạn" required autoComplete="username" disabled={busy}/><label htmlFor="password">Mật khẩu</label><div className="password-input"><input id="password" name="password" type={show?'text':'password'} placeholder="Nhập mật khẩu" required autoComplete="current-password" disabled={busy}/><button type="button" aria-label={show?'Ẩn mật khẩu':'Hiện mật khẩu'} onClick={()=>setShow(!show)}>{show?<EyeOff size={19}/>:<Eye size={19}/>}</button></div>{error && <div className="error-box" role="alert">{error}</div>}<button className="button orange login-submit" disabled={busy}>{busy?<><RefreshCw className="spin" size={18}/> Đang xác thực…</>:<>Đăng nhập <ArrowRight size={18}/></>}</button></form><p className="login-note"><ShieldCheck size={16}/> Phiên được giữ trong bộ nhớ. Tải lại trang để đăng nhập mới.</p></div><small className="login-copyright">BidVibe · Không gian dành cho quản trị viên</small></div></main>;
}

function Overview({ data }) {
  const d = data;
  const orderItems = [['Chờ thanh toán','awaitingPayment'],['Chờ người bán gửi kho','awaitingSellerShipment'],['Đang chuyển về kho','inTransitToWarehouse'],['Kho đang kiểm tra','inspecting'],['Đang giao người mua','outbound'],['Đã giao, chờ xác nhận','deliveredAwaitingConfirm']];
  const total = orderItems.reduce((sum,[,key])=>sum+Number(d.orders?.[key] || 0),0);
  return <><div className="metrics-grid"><Metric icon={Gavel} label="Phiên đang chạy" value={number(d.auctions?.live)} caption={`${number(d.auctions?.endingIn24h)} phiên kết thúc trong 24 giờ`} accent="orange"/><Metric icon={Clock} label="Chờ thẩm định" value={number(d.appraisal?.pending)} caption={`${number(d.appraisal?.needsInfo)} tin cần bổ sung`}/><Metric icon={Flag} label="Cờ đang mở" value={number(d.flags?.open)} caption={`${number(d.flags?.paused)} phiên đang tạm dừng`} accent="red"/><Metric icon={MessageSquareWarning} label="Tranh chấp đang mở" value={number(d.disputes?.open)} caption="Theo trạng thái trên hệ thống"/></div><div className="admin-content-grid"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">VẬN HÀNH HIỆN TẠI</p><h3>Hành trình đơn hàng</h3></div><PackageCheck size={22}/></div><div className="order-bars">{orderItems.map(([label,key],i)=><div className="order-bar" key={key}><div><span><i>{String(i+1).padStart(2,'0')}</i>{label}</span><strong>{number(d.orders?.[key])}</strong></div><div className="bar-track"><span style={{width:`${total?Number(d.orders?.[key]||0)/total*100:0}%`}}/></div></div>)}</div><p className="data-note">Phân bố đơn hàng theo từng giai đoạn vận hành hiện tại.</p></section><div className="panel-stack"><section className="escrow-card"><Wallet size={28}/><p>Tiền nền tảng đang giữ</p><strong>{money(d.escrowHeld)}</strong><small>Khoản thanh toán của các đơn chưa giải ngân.</small></section><section className="panel"><div className="panel-heading"><h3>Cộng đồng BidVibe</h3><Users size={21}/></div><dl className="summary-list">{[['Bidder',d.users?.bidders],['Seller',d.users?.sellers],['Nhân sự nội bộ',d.users?.ops],['Tài khoản tạm khóa',d.users?.suspended]].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{number(v)}</dd></div>)}</dl></section></div></div><OverviewCharts data={d}/></>;
}
function Weekly({ data:d }) {
  const categories = d.topCategories || [];
  const max = Math.max(1,...categories.map(c=>Number(c.gmv)));
  function download() { const blob = new Blob([JSON.stringify(d,null,2)], {type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download='bidvibe-bao-cao-tuan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
  return <><div className="report-period"><p><Clock size={16}/> {date(d.period?.from)} — {date(d.period?.to)}</p><button className="button secondary small" onClick={download}><Download size={16}/> Tải báo cáo JSON</button></div><div className="metrics-grid"><Metric icon={ChartColumn} label="Tổng giá trị đơn (GMV)" value={money(d.sales?.gmv)} caption={`${number(d.sales?.orders)} đơn trong kỳ`} accent="orange"/><Metric icon={Wallet} label="Phí nền tảng ước tính" value={money(d.sales?.estimatedFees)} caption="Ước tính theo dữ liệu báo cáo"/><Metric icon={Gavel} label="Phiên bán thành công" value={number(d.auctions?.sold)} caption={`${number(d.auctions?.ended)} phiên kết thúc`}/><Metric icon={Wallet} label="Tổng tiền nạp ví" value={money(d.walletTopups?.total)} caption={`${number(d.walletTopups?.count)} giao dịch nạp ví`}/></div><div className="admin-content-grid"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">7 NGÀY GẦN NHẤT</p><h3>Giá trị đơn theo danh mục</h3></div><ChartColumn size={22}/></div>{categories.length ? <div className="category-bars">{categories.map(c=><div className="category-bar" key={c.code}><div><span>{c.code}</span><strong>{money(c.gmv)}</strong></div><div className="bar-track"><span style={{width:`${Number(c.gmv)/max*100}%`}}/></div><small>{number(c.orders)} đơn hàng</small></div>)}</div> : <Empty text="Chưa có đơn hàng theo danh mục trong kỳ."/>}<p className="data-note">Tổng giá trị đơn hàng theo danh mục trong 7 ngày gần nhất.</p></section><section className="panel"><div className="panel-heading"><h3>Hoạt động trong tuần</h3></div><dl className="summary-list">{[['Đơn đã thanh toán',d.payments?.paid],['Đơn hết hạn',d.payments?.expired],['Phiên bị hủy',d.auctions?.cancelled],['Bidder mới',d.newAccounts?.bidder || 0],['Seller mới',d.newAccounts?.seller || 0],['Tranh chấp phát sinh',d.disputes?.opened],['Tranh chấp đã xử lý',d.disputes?.resolved],...Object.entries(d.appraisals||{}).map(([key,value])=>[`Thẩm định: ${labels[key]||key}`,value])].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{number(v)}</dd></div>)}</dl></section></div><WeeklyCharts data={d}/></>;
}
function Empty({ text = 'Chưa có dữ liệu phù hợp với bộ lọc.' }) { return <div className="empty-state"><Search size={30}/><h3>Chưa có dữ liệu</h3><p>{text}</p></div>; }
function Detail({ item, type, onClose, onAction }) {
  const actionable = type === 'flags' ? !['safe','terminated'].includes(item.status) : item.status === 'open';
  return <Dialog title={item.auction?.title || item.title} eyebrow={`${type==='flags'?'PHIÊN NGHI VẤN':'TRANH CHẤP'} #${item.id}`} onClose={onClose}>
    <Status value={item.status}/>
    {type==='flags'?<>
      <p className="detail-body">{item.reason}</p>
      <dl className="summary-list"><div><dt>Mức độ</dt><dd>{labels[item.severity]||item.severity}</dd></div><div><dt>Giá hiện tại</dt><dd>{money(item.auction?.currentPrice)}</dd></div><div><dt>Kết thúc</dt><dd>{date(item.auction?.endsAt)}</dd></div></dl>
      {item.aiExplanation&&<div className="detail-callout"><h3>Giải thích từ hệ thống</h3><p>{item.aiExplanation}</p></div>}
      <h3>Bằng chứng</h3>{(item.evidence||[]).length?(item.evidence||[]).map((e,i)=><p className="evidence-row" key={i}><b>{e.label}</b><span>{typeof e.value==='object'?JSON.stringify(e.value):String(e.value??'—')}</span></p>):<p className="data-note">Chưa có bằng chứng bổ sung.</p>}
    </>:<>
      <p className="detail-body">{item.itemTitle}</p>
      <dl className="summary-list"><div><dt>Người mua</dt><dd>{item.buyer?.name||'—'}</dd></div><div><dt>Người bán</dt><dd>{item.seller?.storeName||'—'}</dd></div><div><dt>Khoản ký quỹ</dt><dd>{money(item.escrowAmount)}</dd></div><div><dt>Phán quyết</dt><dd>{labels[item.resolution]||item.resolution||'Chưa có'}</dd></div></dl>
      <h3>Lịch sử xử lý</h3><ol className="timeline">{(item.timeline||[]).map((t,i)=><li key={i}><small>{date(t.at)}</small><p>{t.note}</p></li>)}</ol>
    </>}
    {actionable?<section className="detail-actions"><h3>{type==='flags'?'Xử lý phiên nghi vấn':'Đưa ra phán quyết'}</h3><p className="data-note">Chọn thao tác để xem hệ quả và xác nhận trước khi lưu.</p><div className="action-button-row">{type==='flags'?Object.entries(flagActions).filter(([action])=>({pause:'paused',verify:'verify',safe:'safe',terminate:'terminated'}[action]!==item.status)).map(([action,label])=><button className={`button small ${action==='terminate'?'danger-outline':'secondary'}`} key={action} onClick={()=>onAction({type:'flag',item,action})}>{label}</button>):<><button className="button secondary small" onClick={()=>onAction({type:'dispute',item,resolution:'keep'})}>Giữ nguyên giao dịch</button><button className="button danger-outline small" onClick={()=>onAction({type:'dispute',item,resolution:'refund'})}>Hoàn tiền người mua</button></>}</div></section>:<p className="data-note">Bản ghi đã được xử lý xong; không còn thao tác thay đổi.</p>}
  </Dialog>;
}

function DataTable({ tab, items, onDetail, onAction, currentUserId }) {
  if (!items.length) return <Empty/>;
  const kind=tab.id;
  const headers=kind==='flags'?['Phiên đấu giá','Mức độ','Trạng thái','Giá hiện tại','Chi tiết']:kind==='disputes'?['Tranh chấp','Người mua','Trạng thái','Ký quỹ','Chi tiết']:['Tài khoản','Vai trò','Trạng thái',kind==='ops'?'Khối lượng tuần':'Ngày đăng ký','Thao tác'];
  return <div className="table-scroll"><table><thead><tr>{headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{items.map(row=><tr key={row.id}>
    {kind==='flags'?<><td><b>{row.auction?.title}</b><small>Phiên #{row.auction?.id} · Cờ #{row.id}</small></td><td><Status value={row.severity}/></td><td><Status value={row.status}/></td><td>{money(row.auction?.currentPrice)}</td><td><button className="table-action" onClick={()=>onDetail(row)}>Xem & xử lý <ArrowUpRight size={15}/></button></td></>:kind==='disputes'?<><td><b>{row.title}</b><small>Đơn #{row.orderId} · {row.itemTitle}</small></td><td>{row.buyer?.name||'—'}</td><td><Status value={row.status}/></td><td>{money(row.escrowAmount)}</td><td><button className="table-action" onClick={()=>onDetail(row)}>Xem & xử lý <ArrowUpRight size={15}/></button></td></>:<><td><b>{row.fullName||row.name}</b><small>{row.email}</small>{kind==='ops'&&String(row.id)===String(currentUserId)&&<small className="self-label">Tài khoản của bạn</small>}</td><td>{labels[row.role]||row.role}</td><td><Status value={row.status}/></td><td>{kind==='ops'?number(row.weeklyLoad):date(row.createdAt)}</td><td>{kind==='ops'?<button className="table-action" onClick={()=>onAction({type:'ops',item:row})}><Pencil size={13}/> Chỉnh sửa</button>:<button className={`table-action ${row.status==='active'?'suspend-action':''}`} onClick={()=>onAction({type:'account',item:row})}>{row.status==='active'?<LockKeyhole size={13}/>:<Unlock size={13}/>} {row.status==='active'?'Tạm khóa':'Mở khóa'}</button>}</td></>}
  </tr>)}</tbody></table></div>;
}

export default function Admin({ api, session, setSession }) {
  const [tabId,setTabId]=useState('overview');
  const [revision,setRevision]=useState(0);
  const [status,setStatus]=useState('');
  const [role,setRole]=useState('');
  const [q,setQ]=useState('');
  const [search,setSearch]=useState('');
  const [offset,setOffset]=useState(0);
  const [result,setResult]=useState({loading:true,data:null,error:'',at:null});
  const [detail,setDetail]=useState(null);
  const [task,setTask]=useState(null);
  const [notice,setNotice]=useState('');
  const tab=tabs.find(t=>t.id===tabId);
  const refresh=()=>setRevision(r=>r+1);
  useEffect(()=>{
    if (!session) {setTask(null);setDetail(null);setNotice('');setResult({loading:true,data:null,error:'',at:null});return;}
    const controller=new AbortController();let cancelled=false;
    const params=new URLSearchParams();
    if(tab.key){if(status)params.set('status',status);if(role)params.set('role',role);if(tabId==='accounts'&&search)params.set('q',search);if(tabId!=='ops'){params.set('limit','20');params.set('offset',String(offset));}}
    setResult({loading:true,data:null,error:'',at:null});
    api(`${tab.path}${params.size?`?${params}`:''}`,{signal:controller.signal})
      .then(data=>{if(!cancelled)setResult({loading:false,data,error:'',at:new Date()});})
      .catch(error=>{if(!cancelled)setResult({loading:false,data:null,error:error.message,at:null});});
    return()=>{cancelled=true;controller.abort();};
  },[api,session,tab,tabId,status,role,search,offset,revision]);
  if(!session)return <Login api={api} onLogin={setSession}/>;
  function changeTab(id){setTabId(id);setStatus('');setRole('');setQ('');setSearch('');setOffset(0);setDetail(null);setNotice('');}
  function openAction(next){setDetail(null);setTask(next);setNotice('');}
  function saved(out){
    setTask(null);setDetail(null);
    if(out.isSelf){
      if(out.changedPassword){setSession(null);return;}
      setSession(previous=>previous?{...previous,account:{...previous.account,fullName:out.item.name}}:previous);
    }
    setNotice(out.type==='ops'?'Đã lưu tài khoản nội bộ.':out.type==='account'?'Đã cập nhật trạng thái người dùng.':out.type==='flag'?'Đã ghi nhận xử lý phiên nghi vấn.':'Đã lưu phán quyết tranh chấp.');
    refresh();
  }
  const items=tab.key?(result.data?.[tab.key]||[]):[];
  const statuses=tabId==='flags'?['pending','paused','verify','safe','terminated']:tabId==='disputes'?['open','resolved']:['active','suspended'];
  return <div className="admin-layout">
    <aside className="admin-sidebar"><Brand/><div className="workspace-label">KHÔNG GIAN QUẢN TRỊ</div>
      <nav aria-label="Menu quản trị">{tabs.map(({id,title,icon:Icon})=><button key={id} className={tabId===id?'selected':''} onClick={()=>changeTab(id)}><Icon size={19}/>{title}{tabId===id&&<span className="nav-active-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><a href="#"><ArrowLeft size={17}/> Về trang giới thiệu</a><div className="admin-profile"><span className="profile-avatar">{(session.account.fullName||'A')[0]}</span><div><b>{session.account.fullName||'Admin'}</b><small>Quản trị viên</small></div><button aria-label="Đăng xuất" className="icon-button" onClick={()=>setSession(null)}><LogOut size={18}/></button></div></div>
    </aside>
    <div className="admin-body">
      <header className="admin-topbar"><span>Không gian quản trị <ChevronRight size={14}/> <b>{tab.title}</b></span><div><span className={`live-dot ${result.error?'connection-error':result.loading?'connection-loading':''}`}/>{result.error?'Chưa thể đồng bộ':result.loading?'Đang đồng bộ…':'Đồng bộ cùng BidVibe'}<a href="#" aria-label="Mở trang chủ"><ArrowUpRight size={17}/></a></div></header>
      <main className="admin-main">
        <div className="admin-title-row"><div><p className="eyebrow">BIDVIBE / QUẢN TRỊ</p><h1>{tab.title}<span className="orange-text">.</span></h1><p>{tabId==='weekly'?'Báo cáo tổng hợp 7 ngày gần nhất từ hệ thống.':'Theo dõi và quản lý hoạt động của nền tảng đấu giá đồ cổ.'}</p></div><div className="title-actions">{tabId==='ops'&&<button className="button orange small" onClick={()=>openAction({type:'ops',item:null})}><Plus size={16}/> Thêm nhân sự</button>}<button className="button secondary small" disabled={result.loading} onClick={refresh}><RefreshCw className={result.loading?'spin':''} size={16}/> Làm mới</button></div></div>
        <div className="admin-data-label"><span className={`live-dot ${result.error?'connection-error':result.loading?'connection-loading':''}`}/><span>{result.at?`Cập nhật lúc ${result.at.toLocaleTimeString('vi-VN')} · Dữ liệu từ hệ thống`:result.error?'Chưa tải được dữ liệu mới nhất':'Đang kết nối với hệ thống…'}</span><span className="read-only-badge">Quyền quản trị</span></div>
        {notice&&<div className="success-notice" role="status"><Check size={17}/><span>{notice}</span><button aria-label="Ẩn thông báo" onClick={()=>setNotice('')}><X size={16}/></button></div>}
        {tab.key&&<form className="filters" onSubmit={e=>{e.preventDefault();setSearch(q);setOffset(0);}}>{tabId==='accounts'&&<div className="search-field"><Search size={17}/><input aria-label="Tìm người dùng" placeholder="Tìm tên hoặc email…" value={q} onChange={e=>setQ(e.target.value)}/><button type="submit">Tìm</button></div>}<select aria-label="Lọc trạng thái" value={status} onChange={e=>{setStatus(e.target.value);setOffset(0);}}><option value="">Tất cả trạng thái</option>{statuses.map(s=><option key={s} value={s}>{labels[s]}</option>)}</select>{['accounts','ops'].includes(tabId)&&<select aria-label="Lọc vai trò" value={role} onChange={e=>{setRole(e.target.value);setOffset(0);}}><option value="">Tất cả vai trò</option>{(tabId==='ops'?['admin','appraiser','warehouse']:['bidder','seller']).map(s=><option value={s} key={s}>{labels[s]}</option>)}</select>}</form>}
        {result.error?<div className="error-state" role="alert"><ShieldCheck size={34}/><h2>Chưa tải được dữ liệu</h2><p>{result.error}</p><button className="button orange small" onClick={refresh}>Thử lại <RefreshCw size={16}/></button></div>:result.loading?<div className="admin-loading" role="status"><RefreshCw className="spin" size={26}/><h3>Đang tải dữ liệu…</h3><p>Hệ thống có thể cần một chút thời gian để khởi động.</p></div>:result.data&&(tabId==='overview'?<Overview data={result.data}/>:tabId==='weekly'?<Weekly data={result.data}/>:<section className="panel table-panel"><div className="panel-heading"><h3>{tab.title}</h3><span className="table-count">{items.length} bản ghi trong trang</span></div><DataTable tab={tab} items={items} onDetail={setDetail} onAction={openAction} currentUserId={session.account.id}/>{tabId!=='ops'&&<div className="pagination"><span>Trang {Math.floor(offset/20)+1}</span><div><button disabled={offset===0} onClick={()=>setOffset(v=>Math.max(0,v-20))}><ChevronLeft size={16}/> Trước</button><button disabled={items.length<20} onClick={()=>setOffset(v=>v+20)}>Sau <ChevronRight size={16}/></button></div></div>}</section>)}
        <footer className="admin-footer">BidVibe Admin <span>Dành cho người kết nối những giá trị xưa.</span></footer>
      </main>
    </div>
    {detail&&<Detail item={detail} type={tabId} onClose={()=>setDetail(null)} onAction={openAction}/>}
    {task&&<AdminAction key={`${task.type}-${task.item?.id||'new'}-${task.action||task.resolution||''}`} task={task} api={api} currentUser={session.account} onClose={()=>setTask(null)} onSaved={saved} onRefresh={refresh}/>}
  </div>;
}
