import React, { useState } from 'react';
import { chartData } from './admin-model';

export function DonutChart({title,subtitle,entries,center='Tổng cộng'}) {
  const data=chartData(entries);
  const total=data.reduce((sum,v)=>sum+v.value,0);
  const [selected,setSelected]=useState(null);
  let cursor=0;
  const stops=data.map(v=>{const start=cursor;cursor+=total?v.value/total*100:0;return `${v.color} ${start}% ${cursor}%`;}).join(',');
  const current=selected==null?null:data[selected];
  return <section className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">GÓC NHÌN DỮ LIỆU</p><h3>{title}</h3></div></div><div className="donut-content"><div className="donut-plot" role="img" aria-label={`${title}: ${data.map(v=>`${v.label} ${v.value}`).join(', ')}`} style={{background:total?`conic-gradient(${stops})`:'#e8ecdf'}}><div><strong>{new Intl.NumberFormat('vi-VN').format(current?.value??total)}</strong><span>{current?.label||center}</span></div></div><div className="chart-legend">{data.map((v,i)=><button key={v.label} type="button" className={selected===i?'selected':''} aria-pressed={selected===i} onClick={()=>setSelected(selected===i?null:i)}><i style={{background:v.color}}/><span>{v.label}</span><b>{new Intl.NumberFormat('vi-VN').format(v.value)}</b><small>{total?Math.round(v.value/total*100):0}%</small></button>)}</div></div><p className="data-note">{total?subtitle:'Chưa có dữ liệu để phân bố. Các giá trị hiện tại đều bằng 0.'}</p></section>;
}
export function OverviewCharts({data:d}) {
  return <div className="charts-grid"><DonutChart title="Cơ cấu thành viên" subtitle="Phân bố theo vai trò. Tài khoản tạm khóa đã nằm trong các nhóm này." entries={[
    ['Người đấu giá',d.users?.bidders,'#db8b63'],['Người bán',d.users?.sellers,'#819a70'],['Nhân sự nội bộ',d.users?.ops,'#b2bfa3']
  ]}/><DonutChart title="Hàng chờ thẩm định" subtitle="Các tin đang chờ thẩm định hoặc cần bổ sung thông tin." entries={[
    ['Chờ thẩm định',d.appraisal?.pending,'#d9a261'],['Cần bổ sung',d.appraisal?.needsInfo,'#a4b793']
  ]}/></div>;
}
export function WeeklyCharts({data:d}) {
  return <div className="charts-grid"><DonutChart title="Kết quả phiên đấu giá" subtitle="Các phiên kết thúc hoặc bị hủy trong kỳ báo cáo." entries={[
    ['Bán thành công',d.auctions?.sold,'#829c6c'],['Chưa bán được',Math.max(0,(d.auctions?.ended||0)-(d.auctions?.sold||0)),'#c9ccb8'],['Đã hủy',d.auctions?.cancelled,'#d68b70']
  ]}/><DonutChart title="Kết quả thanh toán" subtitle="Các đơn tạo trong kỳ đã thanh toán hoặc hết hạn; không gồm đơn còn chờ thanh toán." entries={[
    ['Đã thanh toán',d.payments?.paid,'#829c6c'],['Hết hạn thanh toán',d.payments?.expired,'#dca26e']
  ]}/></div>;
}
