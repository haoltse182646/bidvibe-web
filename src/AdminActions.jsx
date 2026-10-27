import React, { useEffect, useId, useRef, useState } from 'react';
import { X, RefreshCw, Check, ShieldAlert } from 'lucide-react';
import { buildAdminMutation, flagActions } from './admin-model';

export function Dialog({title,eyebrow,children,onClose,busy=false,className=''}) {
  const titleId=useId();
  const ref=useRef(null);
  const onCloseRef=useRef(onClose);onCloseRef.current=onClose;
  const busyRef=useRef(busy);busyRef.current=busy;
  useEffect(()=>{
    const previous=document.activeElement;
    const focusables=()=>Array.from(ref.current?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')||[]).filter(el=>el.getClientRects().length);
    focusables()[0]?.focus();
    const keydown=e=>{
      if(e.key==='Escape'&&!busyRef.current){e.preventDefault();onCloseRef.current();}
      if(e.key==='Tab'){
        const list=focusables();const first=list[0];const last=list.at(-1);
        if(!list.length){e.preventDefault();ref.current?.focus();}
        else if(e.shiftKey&&(document.activeElement===first||!ref.current?.contains(document.activeElement))){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&(document.activeElement===last||!ref.current?.contains(document.activeElement))){e.preventDefault();first.focus();}
      }
    };
    const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    document.addEventListener('keydown',keydown);
    return()=>{document.removeEventListener('keydown',keydown);document.body.style.overflow=previousOverflow;if(previous?.isConnected)previous.focus();};
  },[]);
  return <div className="modal-backdrop" onClick={()=>!busy&&onClose()}><section ref={ref} tabIndex={-1} className={`detail-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-busy={busy} onClick={e=>e.stopPropagation()}><div className="panel-heading"><div><p className="eyebrow">{eyebrow||'BIDVIBE / QUẢN TRỊ'}</p><h2 id={titleId}>{title}</h2></div><button className="icon-button" disabled={busy} onClick={onClose} aria-label="Đóng cửa sổ"><X/></button></div>{children}</section></div>;
}

export default function AdminAction({task,api,currentUser,onClose,onSaved,onRefresh}) {
  const {type,item}=task;
  const isSelf=type==='ops'&&item&&String(item.id)===String(currentUser.id);
  const [fields,setFields]=useState({name:item?.name||'',email:item?.email||'',role:item?.role||'appraiser',status:type==='account'?(item.status==='active'?'suspended':'active'):(item?.status||'active'),password:'',action:task.action||'',reason:'',resolution:task.resolution||'',note:''});
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [uncertain,setUncertain]=useState(false);
  const busyRef=useRef(false);
  const mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  const set=(key,value)=>setFields(previous=>({...previous,[key]:value}));
  const title=type==='ops'?(item?'Chỉnh sửa nhân sự':'Thêm tài khoản nội bộ'):type==='account'?(fields.status==='suspended'?'Tạm khóa người dùng':'Mở khóa người dùng'):type==='flag'?flagActions[fields.action]:'Phán quyết tranh chấp';
  const submitText=type==='ops'?(item?'Lưu thay đổi':'Tạo tài khoản'):type==='account'?(fields.status==='suspended'?'Xác nhận tạm khóa':'Xác nhận mở khóa'):type==='flag'?`Xác nhận ${flagActions[fields.action]?.toLowerCase()}`:fields.resolution==='refund'?'Xác nhận hoàn tiền':'Xác nhận giữ giao dịch';
  const name=item?.fullName||item?.name||item?.auction?.title||item?.title;
  async function submit(e){
    e.preventDefault();if(busyRef.current||uncertain)return;
    setError('');
    let request;
    try{request=buildAdminMutation(type,item,fields,currentUser.id);}catch(err){setError(err.message);return;}
    busyRef.current=true;setBusy(true);
    try{
      const {path,...options}=request;
      const result=await api(path,options);
      if(mounted.current)onSaved({type,item:result,isSelf,changedPassword:Boolean(fields.password)});
    }catch(err){
      if(mounted.current){
        const unknown=err.status===0||err.status>=500;
        setUncertain(unknown);
        setError(unknown?'Chưa xác nhận được kết quả thao tác. Hãy kiểm tra lại danh sách trước khi thực hiện lần nữa.':err.status===409?`${err.message} Hãy đóng cửa sổ và làm mới để kiểm tra trạng thái mới nhất.`:err.message);
      }
    }finally{busyRef.current=false;if(mounted.current)setBusy(false);}
  }
  return <Dialog title={title} onClose={onClose} busy={busy} className="action-dialog"><form onSubmit={submit}>
    {type==='ops'?<><p className="action-intro">{item?`Cập nhật tài khoản ${item.email}.`:'Cấp tài khoản để nhân sự tham gia vận hành BidVibe.'}</p><fieldset disabled={busy||uncertain} className="action-fields"><label>Họ tên<input name="name" value={fields.name} required maxLength={100} onChange={e=>set('name',e.target.value)} autoComplete="off"/></label><label>Email<input name="email" type="email" value={fields.email} readOnly={Boolean(item)} required maxLength={254} onChange={e=>set('email',e.target.value)} autoComplete="off"/>{item&&<small>Email được giữ nguyên theo tài khoản đã tạo.</small>}</label><div className="form-two-columns"><label>Vai trò<select name="role" value={fields.role} disabled={isSelf} onChange={e=>set('role',e.target.value)}><option value="appraiser">Thẩm định viên</option><option value="warehouse">Nhân viên kho</option><option value="admin">Quản trị viên</option></select></label>{item&&<label>Trạng thái<select name="status" value={fields.status} disabled={isSelf} onChange={e=>set('status',e.target.value)}><option value="active">Hoạt động</option><option value="suspended">Tạm khóa</option></select></label>}</div><label>{item?'Mật khẩu mới (không bắt buộc)':'Mật khẩu khởi tạo'}<input name="password" type="password" minLength={6} maxLength={72} value={fields.password} required={!item} onChange={e=>set('password',e.target.value)} autoComplete="new-password"/><small>{item?'Để trống để giữ mật khẩu hiện tại. ':''}Từ 6 đến 72 ký tự.</small></label>{isSelf&&<p className="data-note">Bạn đang sửa tài khoản của mình. Vai trò và trạng thái được giữ nguyên để bảo vệ quyền quản trị.</p>}</fieldset></>:<><p className="action-target">{name}<small>#{item.id}{item.email?` · ${item.email}`:''}</small></p><div className={`action-impact ${type==='dispute'||fields.action==='terminate'?'critical':''}`}><ShieldAlert size={20}/><p>{type==='account'?(fields.status==='suspended'?'Người dùng sẽ không thể tiếp tục sử dụng tài khoản và các kết nối đang mở có thể bị ngắt.':'Người dùng có thể đăng nhập và sử dụng tài khoản trở lại.'):type==='flag'?(fields.action==='terminate'?'Phiên sẽ bị hủy và tiền cọc được hoàn cho người tham gia theo quy trình hệ thống. Thao tác này không thể tiếp tục đổi trạng thái cờ.':fields.action==='pause'?'Phiên sẽ tạm dừng nhận cọc, đặt giá và đóng tự động cho tới khi được xử lý.':fields.action==='safe'?'Cờ được đóng và đánh dấu an toàn. Nếu phiên đang tạm dừng, phiên sẽ được bỏ chặn. Không thể sửa lại cờ đã đóng.':'Phiên được chuyển sang trạng thái cần xác minh. Nếu đang tạm dừng, trạng thái chặn đặt giá sẽ được bỏ theo quy trình hệ thống.'):(fields.resolution==='refund'?`Hoàn ${new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(item.escrowAmount)} về ví người mua và đóng tranh chấp. Phán quyết này không thể sửa sau khi lưu.`:'Giữ nguyên giao dịch và đóng tranh chấp. Đơn được giải ngân cho người bán khi không còn tranh chấp khác đang mở. Phán quyết này không thể sửa sau khi lưu.')}</p></div>{type==='flag'&&<fieldset className="action-fields" disabled={busy||uncertain}><label>Lý do{fields.action==='terminate'?' (bắt buộc)':' (không bắt buộc)'}<textarea name="reason" required={fields.action==='terminate'} maxLength={1000} rows={4} value={fields.reason} onChange={e=>set('reason',e.target.value)} placeholder="Ghi nhận căn cứ xử lý phiên…"/></label></fieldset>}{type==='dispute'&&<fieldset className="action-fields" disabled={busy||uncertain}><label>Ghi chú phán quyết<textarea name="note" maxLength={2000} rows={4} value={fields.note} onChange={e=>set('note',e.target.value)} placeholder="Ghi nhận căn cứ đưa ra phán quyết…"/></label></fieldset>}</>}
    {error&&<div role="alert" className="error-box">{error}</div>}<div className="dialog-actions"><button type="button" disabled={busy} className="button secondary small" onClick={onClose}>Hủy</button>{uncertain?<button type="button" className="button orange small" onClick={()=>{onClose();onRefresh();}}>Kiểm tra lại dữ liệu</button>:<button type="submit" disabled={busy} className={`button small ${fields.action==='terminate'||fields.resolution==='refund'?'danger-button':'orange'}`}>{busy?<RefreshCw className="spin" size={16}/>:<Check size={16}/>} {busy?'Đang lưu…':submitText}</button>}</div>
  </form></Dialog>;
}
