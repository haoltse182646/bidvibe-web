import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight, MoveUpRight, ShieldCheck, Zap, Wallet, Check, Plus, Minus, Menu, X, Smartphone, Download, Gavel, Fingerprint, PackageCheck, ChevronRight, Heart, Radio } from 'lucide-react';
import { publicUrl } from './api';

export function Brand({ light = false }) { return <a className={`brand ${light ? 'light' : ''}`} href="#" aria-label="BidVibe — Trang chủ"><span className="brand-icon"><Gavel size={23} strokeWidth={2.4} /></span>bidvibe<span className="brand-dot">.</span></a>; }

function AntiqueVase({ small = false }) {
  const id = small ? 'antique-card' : 'antique-phone';
  return <svg className={`watch-art ${small ? 'small' : ''}`} viewBox="0 0 300 420" role="img" aria-label="Minh họa bình gốm men lam phong cách cổ">
    <defs>
      <linearGradient id={`${id}-glaze`} x1="0" x2="1"><stop stopColor="#abb5a2"/><stop offset=".25" stopColor="#ece5cb"/><stop offset=".55" stopColor="#f7efd8"/><stop offset=".83" stopColor="#d7d1b5"/><stop offset="1" stopColor="#919f8e"/></linearGradient>
      <linearGradient id={`${id}-rim`} x1="0" x2="1"><stop stopColor="#7b897a"/><stop offset=".5" stopColor="#c2c7af"/><stop offset="1" stopColor="#6c7a70"/></linearGradient>
      <filter id={`${id}-shadow`}><feDropShadow dx="3" dy="12" stdDeviation="10" floodColor="#263b32" floodOpacity=".2"/></filter>
      <clipPath id={`${id}-body`}><path d="M117 70Q111 106 115 141C115 172 68 181 61 244C52 299 78 344 108 357L105 371Q150 386 195 371L192 357C222 344 248 299 239 244C232 181 185 172 185 141Q189 106 183 70Z"/></clipPath>
    </defs>
    <ellipse cx="151" cy="384" rx="85" ry="11" fill="#596f5420"/>
    <g filter={`url(#${id}-shadow)`}>
      <path d="M117 70Q111 106 115 141C115 172 68 181 61 244C52 299 78 344 108 357L105 371Q150 386 195 371L192 357C222 344 248 299 239 244C232 181 185 172 185 141Q189 106 183 70Z" fill={`url(#${id}-glaze)`} stroke="#84927c" strokeWidth="1.5"/>
      <g clipPath={`url(#${id}-body)`} fill="none" stroke="#35566a">
        <path d="M101 90Q150 102 199 90M103 98Q150 110 197 98M106 139Q150 152 194 139M103 148Q150 161 197 148" strokeWidth="3"/>
        <path d="M69 202Q150 225 231 202M65 210Q150 233 235 210M73 325Q150 346 227 325M78 335Q150 356 222 335M100 361Q150 375 200 361" strokeWidth="3"/>
        {Array.from({length:7},(_,i)=><path key={i} d={`M${76+i*24} 193q5-21 12-3q5 14 12 0`} strokeWidth="2" opacity=".8"/>)}
        <path d="M88 306Q124 276 151 258Q182 242 215 247M122 282Q105 254 99 240M150 259Q141 237 145 228M175 249Q186 270 207 283M119 285Q137 300 152 307" strokeWidth="3" strokeLinecap="round"/>
        <g fill="#486a7c" strokeWidth="1.2">
          <path d="M104 257q-22-2-20-16q17-1 20 16M112 270q1-20 13-23q7 15-13 23M184 267q16-10 25-1q-5 13-25 1M137 297q-6 16 7 22q11-10-7-22"/>
          <path d="M153 254q-23-9-15-21q14-4 16 12q2-22 15-17q11 10-5 20q23-3 22 10q-9 14-24 2q4 22-10 20q-13-7 1-26Z"/>
          <circle cx="157" cy="253" r="5" fill="#ddd5b7"/>
        </g>
        <path d="M124 115q10-16 20 0t20 0t20 0" strokeWidth="2" opacity=".7"/>
        <path d="M82 242l5-9m125 70 5-9m-109 16 4-6m92-70 4-6" strokeWidth="1" opacity=".35"/>
      </g>
      <ellipse cx="150" cy="70" rx="38" ry="9" fill={`url(#${id}-rim)`} stroke="#727e6f" strokeWidth="2"/>
      <ellipse cx="150" cy="70" rx="29" ry="4" fill="#69786b"/>
      <path d="M115 366q35 12 70 0" fill="none" stroke="#35566a" strokeWidth="3"/>
      <path d="M100 219q-26 69 4 108" fill="none" stroke="#fff8e2" strokeWidth="5" opacity=".35" strokeLinecap="round"/>
    </g>
  </svg>;
}
function Phone() {
  return <div className="phone-scene" aria-label="Minh họa giao diện BidVibe, số liệu ví dụ">
    <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
    <span className="floating-tag verified"><span className="tag-icon green"><ShieldCheck size={21}/></span><span>Đã được thẩm định<small>An tâm trong từng lượt giá</small></span><Check size={15}/></span>
    <div className="phone"><div className="phone-status"><span>9:41</span><span>••• ▰</span></div><div className="phone-notch"/>
      <div className="phone-header"><span>Khám phá<span className="brand-dot">.</span></span><span className="round-icon"><Heart size={17}/></span></div>
      <div className="phone-search">Tìm cổ vật bạn yêu <span>⌕</span></div>
      <div className="phone-tabs"><span className="selected">Dành cho bạn</span><span>Đang diễn ra</span><span>Sắp mở</span></div>
      <div className="phone-product"><span className="live-pill"><i/> ĐANG ĐẤU GIÁ</span><AntiqueVase/><span className="product-heart"><Heart size={16}/></span><span className="product-time">Kết thúc sau <b>02 : 34 : 18</b></span></div>
      <div className="phone-copy"><small>GỐM SỨ & ĐỒ CỔ</small><h3>Bình gốm men lam</h3><div className="phone-bid"><span>Giá hiện tại<strong>8.500.000 <em>₫</em></strong></span><span className="bid-count">↗ 12 lượt giá</span></div><div className="phone-action">Khám phá phiên <ArrowUpRight size={16}/></div><p>Giao diện minh họa · Không phải phiên thật</p></div>
      <div className="phone-bottom"><span>⌂<small>Khám phá</small></span><span>♡<small>Theo dõi</small></span><span>▣<small>Ví của tôi</small></span><span>◉<small>Hồ sơ</small></span></div>
    </div>
    <div className="floating-tag bid-alert"><span className="tag-icon orange"><Zap size={22}/></span><div>Mỗi lượt giá, một nhịp cảm xúc.<small>Khám phá. Đặt giá. Sở hữu.</small></div></div>
    <span className="scene-note">Một trải nghiệm. Nhiều điều bất ngờ. <svg viewBox="0 0 70 35" aria-hidden="true"><path d="M2 28Q40 35 57 8m-13 3 16-8-2 17" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></span>
  </div>;
}

const faqs = [
  ['BidVibe là gì?', 'BidVibe là ứng dụng đấu giá dành cho các loại đồ cổ, kết nối người bán với những người yêu thích sưu tầm. Bạn có thể khám phá đồ cổ, theo dõi phiên, đặt cọc và đặt giá ngay trong ứng dụng.'],
  ['Tôi bắt đầu tham gia đấu giá như thế nào?', 'Mở ứng dụng, đăng ký tài khoản Bidder và chọn phiên bạn quan tâm. Kiểm tra thông tin sản phẩm, nạp ví và đặt cọc theo yêu cầu của phiên trước khi đặt giá.'],
  ['Đồ cổ có được thẩm định trước khi đấu giá không?', 'Tin đăng được gửi tới bộ phận thẩm định trước khi mở phiên. Sau giao dịch, quy trình kho hỗ trợ kiểm tra sản phẩm và xử lý giao nhận theo trạng thái đơn hàng.'],
  ['Tôi có thể trải nghiệm mà không cài app không?', 'Có. Chọn “Mở ứng dụng” để sử dụng bản web của BidVibe trên trình duyệt. Bản Android có thể tải từ nút “Tải cho Android” bên dưới.'],
  ['Tôi muốn đưa đồ cổ lên đấu giá thì làm thế nào?', 'Đăng ký vai trò Seller trong ứng dụng, tạo tin đăng cho món đồ cổ với hình ảnh và thông tin mô tả, rồi gửi thẩm định. Sau khi được duyệt, món đồ sẽ được đưa vào phiên đấu giá theo quy trình của hệ thống.'],
];

export default function Landing() {
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(0);
  const appUrl = publicUrl(import.meta.env.VITE_APP_WEB_URL) || 'https://bidvibe.netlify.app/';
  const apkUrl = publicUrl(import.meta.env.VITE_APP_DOWNLOAD_URL) || '/downloads/bidvibe.apk';
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }), { threshold: .12 });
    elements.forEach(e => { e.classList.add('will-reveal'); observer.observe(e); });
    return () => observer.disconnect();
  }, []);
  return <>
    <a className="skip-link" href="#main">Bỏ qua menu</a>
    <header className="site-header"><div className="nav-wrap"><Brand/><nav className={menu ? 'main-nav is-open' : 'main-nav'} aria-label="Điều hướng chính"><a href="#experience" onClick={() => setMenu(false)}>Trải nghiệm</a><a href="#how-it-works" onClick={() => setMenu(false)}>Cách hoạt động</a><a href="#why-bidvibe" onClick={() => setMenu(false)}>Vì sao BidVibe?</a></nav><div className="nav-actions"><a href={appUrl} target="_blank" rel="noreferrer" className="button dark small">Mở ứng dụng <ArrowUpRight size={16}/></a><button className="menu-button" aria-expanded={menu} aria-label={menu ? 'Đóng menu' : 'Mở menu'} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div></div></header>
    <main id="main">
      <section className="hero section-wrap"><div className="hero-copy"><div className="eyebrow"><span className="tiny-spark">✳</span> ĐẤU GIÁ ĐỒ CỔ CÙNG BIDVIBE</div><h1>Cổ vật <span className="serif">độc đáo.</span><br/>Trải nghiệm<br/><span className="orange-text">xứng đáng<span className="heading-dot">.</span></span></h1><p>Một cổ vật, một câu chuyện qua thời gian.<br className="desktop-break"/> Khám phá và đấu giá những món đồ cổ bạn yêu,<br className="desktop-break"/> cùng BidVibe.</p><div className="hero-actions"><a href={appUrl} target="_blank" rel="noreferrer" className="button orange">Khám phá BidVibe <ArrowUpRight size={20}/></a><a href="#how-it-works" className="text-link"><span className="play-icon">▶</span> Cách hoạt động</a></div><div className="hero-footnote"><span className="mini-shield"><ShieldCheck size={16}/></span><span>Thẩm định đồ cổ</span><span className="dot-separator">·</span><span>Đấu giá trực tiếp</span></div></div><Phone/><div className="hero-index"><span>01 — KHÁM PHÁ ĐIỀU KHÁC BIỆT</span><a href="#experience" aria-label="Cuộn để khám phá">CUỘN ĐỂ KHÁM PHÁ <span>↓</span></a></div></section>
      <div className="ticker" aria-hidden="true"><div>{[0,1,2,3].map(i => <span key={i}>KHÁM PHÁ GIÁ TRỊ XƯA <span>✳</span> ĐẶT GIÁ THEO CÁCH BẠN <span>✳</span> KẾT NỐI ĐAM MÊ ĐỒ CỔ <span>✳</span></span>)}</div></div>
      <section id="experience" className="section-wrap experience section-space"><div className="section-heading reveal"><div><p className="eyebrow">01 / TRẢI NGHIỆM BIDVIBE</p><h2>Mỗi cổ vật,<br/>một câu chuyện <span className="serif">mới.</span></h2></div><p>Từ gốm sứ đến những món đồ cổ mang dấu ấn thời gian,<br className="desktop-break"/> khám phá câu chuyện xưa và tìm dấu ấn cho bộ sưu tập của bạn.</p></div><div className="experience-grid"><article className="experience-card watch-card reveal"><div className="card-top"><span>01 — KHÁM PHÁ</span><ArrowUpRight/></div><div className="collection-art"><AntiqueVase small/><span className="art-circle"/><span className="art-caption">DẤU ẤN XƯA.<br/>GIÁ TRỊ CÒN MÃI.</span></div><h3>Tìm dấu ấn cho bộ sưu tập.</h3><p>Khám phá đồ cổ với hình ảnh, mô tả và tình trạng được công bố trong từng tin đăng.</p></article><article className="experience-card live-card reveal"><div className="card-top"><span>02 — ĐẶT GIÁ</span><ArrowUpRight/></div><div className="bid-art"><div className="bid-line"><span className="avatar one">B</span><div><b>Bạn vừa đặt giá</b><small>Một bước gần hơn tới cổ vật yêu thích</small></div><Check size={17}/></div><div className="price-display"><span>MỖI LƯỢT GIÁ</span><strong>Một nhịp <em>cảm xúc.</em></strong><div><Radio size={14}/> Cập nhật trực tiếp</div></div><div className="bid-pills"><span>Khám phá</span><span>Đặt giá <ArrowUpRight size={12}/></span><span>Sở hữu</span></div></div><h3>Hòa nhịp từng phiên đấu.</h3><p>Theo dõi mức giá mới và tham gia phiên ngay trên ứng dụng với cập nhật realtime.</p></article><article className="experience-card trust-card reveal"><div className="card-top"><span>03 — AN TÂM</span><ArrowUpRight/></div><div className="shield-art"><div className="shield-ring"/><ShieldCheck size={99} strokeWidth={1}/><span className="check-badge"><Check size={18}/></span><div className="shield-label">THẨM ĐỊNH · KIỂM TRA · GIAO NHẬN</div></div><h3>Niềm tin trong từng bước.</h3><p>Từ thẩm định tin đăng đến kiểm tra tại kho, cùng quy trình hỗ trợ khi có tranh chấp.</p></article></div></section>
      <section id="how-it-works" className="how-section"><div className="section-wrap how-grid"><div className="how-intro reveal"><p className="eyebrow">02 / ĐƠN GIẢN ĐỂ BẮT ĐẦU</p><h2>Chạm. Đặt giá.<br/><span className="serif">Và hơn thế nữa.</span></h2><p>Mọi thứ bạn cần cho hành trình sưu tầm đồ cổ,<br/>gói gọn trong một ứng dụng.</p><a href={appUrl} target="_blank" rel="noreferrer" className="text-link">Bắt đầu trải nghiệm <ArrowUpRight size={19}/></a><div className="how-symbol" aria-hidden="true">✳</div></div><div className="steps">{[[Smartphone,'01','Tạo tài khoản của bạn','Mở BidVibe và đăng ký tài khoản Bidder để bắt đầu khám phá.'],[Wallet,'02','Chọn phiên. Sẵn sàng đặt giá.','Xem thông tin, nạp ví và đặt cọc theo điều kiện của phiên.'],[Gavel,'03','Đặt giá và theo dõi trực tiếp','Chọn mức giá hợp lệ, theo dõi những thay đổi ngay trong phiên.'],[PackageCheck,'04','Thắng phiên. Đón cổ vật yêu.','Thanh toán và theo dõi hành trình đơn hàng trong ứng dụng.']].map(([Icon,n,title,body]) => <article className="step reveal" key={n}><span className="step-number">{n}</span><div><h3>{title}</h3><p>{body}</p></div><span className="step-icon"><Icon size={23} strokeWidth={1.5}/></span></article>)}</div></div></section>
      <section id="why-bidvibe" className="section-wrap section-space"><div className="why-grid"><div className="why-visual reveal"><span className="eyebrow">BUILT AROUND TRUST</span><div className="trust-orbit"><span className="orbit-center"><Fingerprint size={86} strokeWidth={1}/></span><span className="orbit-label label-top"><ShieldCheck size={17}/> Thẩm định</span><span className="orbit-label label-right"><Wallet size={17}/> Ví tích hợp</span><span className="orbit-label label-bottom"><PackageCheck size={17}/> Kiểm tra tại kho</span></div><p>Một hành trình có sự đồng hành.</p></div><div className="why-copy reveal"><p className="eyebrow">03 / VÌ SAO LÀ BIDVIBE?</p><h2>Đấu giá bằng cảm hứng.<br/>Lựa chọn bằng <span className="serif">niềm tin.</span></h2><p>BidVibe kết nối những người yêu đồ cổ qua các phiên đấu giá, nơi niềm đam mê sưu tầm đi cùng thông tin rõ ràng.</p><ul>{['Thông tin đồ cổ và điều kiện phiên rõ ràng','Ví, tiền cọc và lịch sử giao dịch trong ứng dụng','Quy trình thẩm định và kiểm tra tại kho','Hỗ trợ xử lý tranh chấp theo từng đơn hàng'].map(s=><li key={s}><span><Check size={14}/></span>{s}</li>)}</ul></div></div></section>
      <section className="faq-section section-wrap"><div className="faq-intro reveal"><p className="eyebrow">04 / BẠN HỎI, BIDVIBE ĐÁP</p><h2>Một chút <span className="serif">tò mò?</span></h2><p>Mọi hành trình hay đều bắt đầu từ một câu hỏi.</p></div><div className="faq-list reveal">{faqs.map(([q,a],i)=><article className={`faq-item ${open===i?'expanded':''}`} key={q}><h3><button aria-expanded={open===i} aria-controls={`faq-${i}`} onClick={()=>setOpen(open===i?null:i)}>{q}{open===i?<Minus size={20}/>:<Plus size={20}/>}</button></h3><div id={`faq-${i}`} hidden={open!==i}><p>{a}</p></div></article>)}</div></section>
      <section id="download" className="section-wrap download-wrap"><div className="download-banner reveal"><div><p className="eyebrow">CỔ VẬT TIẾP THEO ĐANG ĐỢI BẠN</p><h2>Đúng cổ vật.<br/>Đúng <span className="serif">cảm xúc.</span></h2><p>Mở BidVibe và tìm dấu ấn xưa cho bộ sưu tập của bạn.</p><div className="download-actions"><a href={appUrl} className="button cream" target="_blank" rel="noreferrer">Mở ứng dụng web <ArrowUpRight size={19}/></a><a className="button outline-light" href={apkUrl} download="BidVibe.apk"><Download size={18}/> Tải cho Android</a></div><small>Bản Android: file APK · Cần cho phép cài đặt từ nguồn tải về.</small></div><div className="download-art" aria-hidden="true"><Gavel size={160} strokeWidth={.8}/><span>LET'S<br/><em>BID.</em></span><span className="download-spark">✳</span></div></div></section>
    </main><footer className="site-footer section-wrap"><div className="footer-top"><Brand/><span>Kết nối đam mê đồ cổ. Tiếp nối những câu chuyện xưa.</span><a href="#/admin">Khu vực quản trị <MoveUpRight size={14}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} BidVibe. Nền tảng đấu giá đồ cổ trực tuyến.</span><a href="#main">Về đầu trang ↑</a></div></footer>
  </>;
}
