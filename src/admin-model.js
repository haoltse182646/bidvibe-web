export const flagActions = { pause:'Tạm dừng phiên', verify:'Yêu cầu xác minh', safe:'Đánh dấu an toàn', terminate:'Chấm dứt phiên' };
const opsRoles = ['admin', 'appraiser', 'warehouse'];
const statuses = ['active', 'suspended'];
function required(value, label, max) {
  const text = String(value || '').trim();
  if (!text) throw new Error(`${label} không được để trống.`);
  if (text.length > max) throw new Error(`${label} tối đa ${max} ký tự.`);
  return text;
}
function id(value) {
  if (!/^\d{1,18}$/.test(String(value))) throw new Error('Mã bản ghi không hợp lệ. Vui lòng làm mới danh sách.');
  return encodeURIComponent(value);
}
export function buildAdminMutation(type, item, fields, currentUserId) {
  if (type === 'account') {
    if (!statuses.includes(fields.status)) throw new Error('Trạng thái không hợp lệ.');
    return {path:`/admin/accounts/${id(item.id)}`, method:'PATCH', body:{status:fields.status}};
  }
  if (type === 'ops') {
    const body = {name:required(fields.name, 'Họ tên', 100), role:fields.role};
    if (!opsRoles.includes(body.role)) throw new Error('Vai trò không hợp lệ.');
    if (item) {
      if (!statuses.includes(fields.status)) throw new Error('Trạng thái không hợp lệ.');
      if (String(item.id) === String(currentUserId) && (fields.status !== 'active' || fields.role !== 'admin')) throw new Error('Bạn không thể tự khóa hoặc tự bỏ quyền quản trị.');
      body.status = fields.status;
    } else {
      body.email = required(fields.email, 'Email', 254).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) throw new Error('Email không đúng định dạng.');
    }
    if (!item || fields.password) {
      if (typeof fields.password !== 'string' || fields.password.length < 6 || fields.password.length > 72) throw new Error('Mật khẩu cần có từ 6 đến 72 ký tự.');
      body.password = fields.password;
    }
    return {path:item?`/admin/ops-accounts/${id(item.id)}`:'/admin/ops-accounts',method:item?'PATCH':'POST',body};
  }
  if (type === 'flag') {
    if (['safe','terminated'].includes(item.status)) throw new Error('Phiên nghi vấn đã được xử lý xong.');
    if (!Object.hasOwn(flagActions,fields.action)) throw new Error('Hành động không hợp lệ.');
    const next = {pause:'paused',verify:'verify',safe:'safe',terminate:'terminated'}[fields.action];
    if (item.status === next) throw new Error('Bản ghi đã ở trạng thái này.');
    const reason = String(fields.reason || '').trim();
    if (fields.action === 'terminate') required(reason,'Lý do chấm dứt',1000);
    if (reason.length > 1000) throw new Error('Lý do tối đa 1000 ký tự.');
    return {path:`/admin/flags/${id(item.id)}/action`,method:'POST',body:{action:fields.action,...(reason?{reason}:{})}};
  }
  if (type === 'dispute') {
    if (item.status !== 'open') throw new Error('Tranh chấp này đã được xử lý.');
    if (!['refund','keep'].includes(fields.resolution)) throw new Error('Vui lòng chọn phán quyết.');
    const note = String(fields.note || '').trim();
    if (note.length > 2000) throw new Error('Ghi chú tối đa 2000 ký tự.');
    return {path:`/admin/disputes/${id(item.id)}/resolve`,method:'POST',body:{resolution:fields.resolution,...(note?{note}:{})}};
  }
  throw new Error('Thao tác chưa được hỗ trợ.');
}

export function chartData(entries) {
  return entries.map(([label,value,color]) => ({label,value:Math.max(0,Number(value)||0),color}));
}
