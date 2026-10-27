import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAdminMutation,chartData} from '../src/admin-model.js';
test('create staff sends required fields and normalized email',()=>{
  assert.deepEqual(buildAdminMutation('ops',null,{name:' Nhân sự ',email:' TEST@EXAMPLE.TEST ',role:'appraiser',password:'qa-only'},'900'),{path:'/admin/ops-accounts',method:'POST',body:{name:'Nhân sự',email:'test@example.test',role:'appraiser',password:'qa-only'}});
});
test('editing keeps email immutable and leaves blank password out of the request',()=>{
  const result=buildAdminMutation('ops',{id:'901'},{name:'Nhân sự kho',email:'ignored@example.test',role:'warehouse',status:'suspended',password:''},'900');
  assert.deepEqual(result,{path:'/admin/ops-accounts/901',method:'PATCH',body:{name:'Nhân sự kho',role:'warehouse',status:'suspended'}});
});
test('self lockout and removing own admin role are rejected',()=>{
  assert.throws(()=>buildAdminMutation('ops',{id:'900'},{name:'QA',role:'admin',status:'suspended'},900),/tự khóa/);
  assert.throws(()=>buildAdminMutation('ops',{id:900},{name:'QA',role:'warehouse',status:'active'},'900'),/tự khóa/);
});
test('password validation matches backend length and only sends a new password if supplied',()=>{
  assert.throws(()=>buildAdminMutation('ops',null,{name:'QA',email:'qa@example.test',role:'admin',password:'123'},1),/6 đến 72/);
  assert.equal(buildAdminMutation('ops',{id:2},{name:'QA',role:'admin',status:'active',password:'new-qa-only'},1).body.password,'new-qa-only');
});
test('user status uses PATCH and supports large bigint IDs without numeric precision loss',()=>{
  assert.deepEqual(buildAdminMutation('account',{id:'123456789012345678'},{status:'suspended'},1),{path:'/admin/accounts/123456789012345678',method:'PATCH',body:{status:'suspended'}});
  assert.throws(()=>buildAdminMutation('account',{id:'../ops'},{status:'active'},1),/Mã bản ghi/);
});
test('all four flag actions have correct action bodies; termination requires a reason',()=>{
  for(const action of ['pause','verify','safe','terminate']){
    const value=buildAdminMutation('flag',{id:4,status:'pending'},{action,reason:' Căn cứ QA '},1);
    assert.deepEqual(value,{path:'/admin/flags/4/action',method:'POST',body:{action,reason:'Căn cứ QA'}});
  }
  assert.throws(()=>buildAdminMutation('flag',{id:4,status:'pending'},{action:'terminate',reason:'  '},1),/Lý do/);
});
test('terminal flags and repeated transitions cannot be submitted',()=>{
  for(const status of ['safe','terminated'])assert.throws(()=>buildAdminMutation('flag',{id:4,status},{action:'verify'},1),/xử lý xong/);
  assert.throws(()=>buildAdminMutation('flag',{id:4,status:'paused'},{action:'pause'},1),/trạng thái này/);
});
test('both dispute outcomes use correct resolution, note and endpoint',()=>{
  for(const resolution of ['refund','keep'])assert.deepEqual(buildAdminMutation('dispute',{id:6,status:'open'},{resolution,note:' Căn cứ '},1),{path:'/admin/disputes/6/resolve',method:'POST',body:{resolution,note:'Căn cứ'}});
  assert.throws(()=>buildAdminMutation('dispute',{id:6,status:'resolved'},{resolution:'refund'},1),/đã được xử lý/);
});
test('invalid enums and overly long notes cannot be sent',()=>{
  assert.throws(()=>buildAdminMutation('account',{id:2},{status:'deleted'},1),/Trạng thái/);
  assert.throws(()=>buildAdminMutation('dispute',{id:6,status:'open'},{resolution:'refund',note:'x'.repeat(2001)},1),/2000/);
  assert.throws(()=>buildAdminMutation('flag',{id:3,status:'pending'},{action:'unknown'},1),/Hành động/);
});
test('charts normalize zero, missing and invalid data without NaN/negative slices',()=>{
  assert.deepEqual(chartData([['A',0,'red'],['B',undefined,'green'],['C',-1,'blue'],['D','5','orange']]).map(v=>v.value),[0,0,0,5]);
});
