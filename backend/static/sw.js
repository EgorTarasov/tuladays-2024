if(!self.define){let s,e={};const i=(i,l)=>(i=new URL(i+".js",l).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(l,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let t={};const o=s=>i(s,r),u={module:{uri:r},exports:t,require:o};e[r]=Promise.all(l.map((s=>u[s]||o(s)))).then((s=>(n(...s),t)))}}define(["./workbox-3e8df8c8"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/_doctor-BoDA2U5t.js",revision:null},{url:"assets/_doctor-CsGdfpDE.js",revision:null},{url:"assets/_id-CujfkPmj.js",revision:null},{url:"assets/_id-xaiL5TUn.js",revision:null},{url:"assets/index-4yMN-NVw.js",revision:null},{url:"assets/index-CIL_iqxM.js",revision:null},{url:"assets/index-CkB7HPHX.css",revision:null},{url:"assets/index-CxL__hIQ.js",revision:null},{url:"assets/index-ecS7vfqh.js",revision:null},{url:"assets/index-VGG823Qk.css",revision:null},{url:"assets/login-abO64AiA.js",revision:null},{url:"assets/login-iyVJBjGQ.js",revision:null},{url:"assets/register-Bah8F31M.js",revision:null},{url:"assets/register-BrR0zLVP.js",revision:null},{url:"assets/table-C9b8UqDF.js",revision:null},{url:"assets/table-CUyVR68N.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"index.html",revision:"5b158fc059f91affd4d22a9c271c1618"},{url:"manifest.webmanifest",revision:"1424007f80d4aee10563f1113d14501c"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
