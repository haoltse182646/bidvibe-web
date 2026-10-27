import test from 'node:test';
import assert from 'node:assert/strict';
import { createApi, ApiError, publicUrl } from '../src/api.js';

test('ops login sends the exact backend envelope and excludes existing bearer token', async t => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://example.test/api/auth/ops/login');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, undefined);
    assert.deepEqual(JSON.parse(options.body), {email:'admin@example.test',password:'test-only'});
    return Response.json({success:true,data:{token:'test-token',role:'admin'}});
  });
  const result = await createApi('https://example.test/',()=>'old-token')('/auth/ops/login',{method:'POST',auth:false,body:{email:'admin@example.test',password:'test-only'}});
  assert.equal(result.role,'admin');
});
test('protected request includes bearer token, and invalid session triggers sign-out', async t => {
  let signedOut = false;
  t.mock.method(globalThis,'fetch',async (url,options)=>{
    assert.equal(options.headers.Authorization,'Bearer test-token');
    return Response.json({success:false,error:{code:'UNAUTHORIZED',message:'Hết phiên'}},{status:401});
  });
  await assert.rejects(createApi('https://example.test',()=>'test-token',()=>{signedOut=true;})('/admin/dashboard'),error=>error instanceof ApiError && error.status===401);
  assert.equal(signedOut,true);
});
test('suspended account also ends the session',async t=>{
  let signedOut=false;
  t.mock.method(globalThis,'fetch',async()=>Response.json({success:false,error:{code:'ACCOUNT_SUSPENDED',message:'Tạm khóa'}},{status:403}));
  await assert.rejects(createApi('https://example.test',()=>'token',()=>{signedOut=true;})('/me'));
  assert.equal(signedOut,true);
});
test('forbidden permissions do not silently render successful dashboard data',async t=>{
  t.mock.method(globalThis,'fetch',async()=>Response.json({success:false,error:{code:'FORBIDDEN',message:'Không có quyền'}},{status:403}));
  await assert.rejects(createApi('https://example.test')('/admin/dashboard'),error=>error.code==='FORBIDDEN' && error.message==='Không có quyền');
});
test('network and invalid JSON errors have readable error messages',async t=>{
  const mocked=t.mock.method(globalThis,'fetch',async()=>{throw new TypeError('Failed to fetch');});
  await assert.rejects(createApi('https://example.test')('/admin/dashboard'),error=>error instanceof ApiError && error.message.includes('CORS'));
  mocked.mock.mockImplementation(async()=>new Response('<html>Bad gateway</html>',{status:502}));
  await assert.rejects(createApi('https://example.test')('/admin/dashboard'),error=>error.status===502);
});
test('aborted requests preserve cancellation',async t=>{
  const controller=new AbortController();controller.abort();
  t.mock.method(globalThis,'fetch',async(_url,opts)=>{assert.equal(opts.signal.aborted,true);throw new DOMException('aborted','AbortError');});
  await assert.rejects(createApi('https://example.test')('/admin/dashboard',{signal:controller.signal}),error=>error.name==='AbortError');
});
test('public buttons accept HTTPS URLs and reject executable URLs',()=>{
  assert.equal(publicUrl('javascript:alert(1)'), '');
  assert.equal(publicUrl('http://example.test'), '');
  assert.equal(publicUrl('https://bidvibe.netlify.app/'),'https://bidvibe.netlify.app/');
});
