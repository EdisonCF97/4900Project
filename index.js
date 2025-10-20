// document.addEventListener('DOMContentLoaded', () => {
//     /* ========== 轮播图 ========== */
//     const slides = document.querySelector('.banner-slides');
//     const dots = document.querySelectorAll('.banner-dot');
//     const arrows = document.querySelectorAll('.banner-arrow');
//     let currentSlide = 0;
//     const slideCount = document.querySelectorAll('.banner-slide').length;
//     let slideInterval;
//
//     function goToSlide(index){
//         if(index < 0) index = slideCount - 1;
//         else if(index >= slideCount) index = 0;
//
//         slides.style.transform = `translateX(-${index * 33.333}%)`;
//         dots.forEach((d,i)=>{
//             d.classList.toggle('active', i===index);
//             d.setAttribute('aria-selected', i===index ? 'true':'false');
//         });
//         currentSlide = index;
//     }
//     function nextSlide(){ goToSlide(currentSlide + 1); }
//     function startSlideShow(){ slideInterval = setInterval(nextSlide, 20000); }
//     function resetSlideShow(){ clearInterval(slideInterval); startSlideShow(); }
//
//     dots.forEach(dot=>{
//         dot.addEventListener('click', ()=>{
//             const idx = parseInt(dot.getAttribute('data-slide'), 10);
//             goToSlide(idx); resetSlideShow();
//         });
//     });
//     arrows.forEach(arrow=>{
//         arrow.addEventListener('click', ()=>{
//             if(arrow.classList.contains('left')) goToSlide(currentSlide - 1);
//             else goToSlide(currentSlide + 1);
//             resetSlideShow();
//         });
//     });
//     startSlideShow();
//
//     /* ========== 工具 ========== */
//     const $ = (sel, root=document)=>root.querySelector(sel);
//     const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
//     const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
//     const currency = new Intl.NumberFormat(undefined, { style:'currency', currency:'USD' });
//
//     /* ========== 购物车（localStorage） ========== */
//     const CART_KEY = 'sushi_lin_cart_v1';
//     const cartBtn = $('#cart-button');
//     const cartCountEl = $('.cart-count');
//     const cartDrawer = $('#cart-drawer');
//     const cartOverlay = $('.cart-overlay');
//     const cartItemsEl = $('#cart-items');
//     const cartSubtotalEl = $('#cart-subtotal');
//
//     function loadCart(){
//         try{
//             const raw = localStorage.getItem(CART_KEY);
//             return raw ? JSON.parse(raw) : { items:{} };
//         }catch{ return { items:{} }; }
//     }
//     function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
//
//     function cartCount(cart){
//         return Object.values(cart.items).reduce((sum, it)=>sum + it.qty, 0);
//     }
//     function cartTotalCents(cart){
//         return Object.values(cart.items).reduce((sum, it)=>sum + it.price * it.qty, 0);
//     }
//     function updateCartBadge(cart){ cartCountEl.textContent = cartCount(cart); }
//
//     function ensureProductFromCard(card){
//         const id = card.dataset.id || slugify($('.product-name', card).textContent);
//         const name = card.dataset.name || $('.product-name', card).textContent.trim();
//         const img = card.dataset.img || $('.product-image img', card)?.src || '';
//         const price = card.dataset.price
//             ? parseInt(card.dataset.price, 10)
//             : Math.round(parseFloat($('.product-price', card).textContent.replace(/[^0-9.]/g,'')) * 100);
//         return { id, name, img, price };
//     }
//
//     function addItem(cart, product, delta = 1){
//         const cur = cart.items[product.id] || { ...product, qty:0 };
//         cur.qty = Math.max(0, cur.qty + delta);
//         if(cur.qty === 0) delete cart.items[product.id];
//         else cart.items[product.id] = cur;
//         return cart;
//     }
//
//     function renderCart(){
//         const cart = loadCart();
//         updateCartBadge(cart);
//
//         const rows = Object.values(cart.items).map(it => `
//       <div class="cart-item" data-id="${it.id}">
//         <img src="${it.img}" alt="${it.name}">
//         <div>
//           <h4>${it.name}</h4>
//           <div class="price">${currency.format(it.price/100)}</div>
//           <div class="cart-qty" role="group" aria-label="Quantity">
//             <button class="qty-btn" data-action="dec" aria-label="Decrease">-</button>
//             <span class="qty" aria-live="polite">${it.qty}</span>
//             <button class="qty-btn" data-action="inc" aria-label="Increase">+</button>
//           </div>
//         </div>
//         <button class="remove" data-action="remove" aria-label="Remove">Remove</button>
//       </div>
//     `).join('');
//
//         cartItemsEl.innerHTML = rows || `<p class="text-muted">Your cart is empty.</p>`;
//         cartSubtotalEl.textContent = currency.format(cartTotalCents(cart)/100);
//
//         // 同步页面卡片上的数量
//         syncProductCardQuantities(cart);
//     }
//
//     function syncProductCardQuantities(cart){
//         $$('.product-card').forEach(card=>{
//             const { id } = ensureProductFromCard(card);
//             const display = $('.quantity-display', card);
//             if(display) display.textContent = cart.items[id]?.qty || 0;
//         });
//     }
//
//     function openCart(){
//         cartOverlay.hidden = false;
//         cartDrawer.classList.add('open');
//         cartDrawer.setAttribute('aria-hidden','false');
//         cartBtn.setAttribute('aria-expanded','true');
//         renderCart();
//         setTimeout(()=>cartDrawer.focus(), 0);
//     }
//     function closeCart(){
//         cartOverlay.hidden = true;
//         cartDrawer.classList.remove('open');
//         cartDrawer.setAttribute('aria-hidden','true');
//         cartBtn.setAttribute('aria-expanded','false');
//     }
//
//     cartBtn?.addEventListener('click', (e)=>{ e.preventDefault(); openCart(); });
//     $('.cart-close')?.addEventListener('click', closeCart);
//     cartOverlay?.addEventListener('click', closeCart);
//     document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart(); });
//
//     // 页面上的 + / -（事件委托）
//     document.addEventListener('click', (e)=>{
//         const btn = e.target.closest('.quantity-btn');
//         if(!btn) return;
//
//         const card = e.target.closest('.product-card');
//         if(!card) return;
//
//         const cart = loadCart();
//         const product = ensureProductFromCard(card);
//
//         if(btn.classList.contains('plus')){
//             addItem(cart, product, +1);
//             // 飞入购物车动画
//             tryFlyToCart(card, product);
//         }else if(btn.classList.contains('minus')){
//             addItem(cart, product, -1);
//         }
//
//         saveCart(cart);
//         updateCartBadge(cart);
//         const display = $('.quantity-display', card);
//         if(display) display.textContent = cart.items[product.id]?.qty || 0;
//     });
//
//     // 抽屉里的 inc/dec/remove
//     cartDrawer.addEventListener('click', (e)=>{
//         const actionBtn = e.target.closest('[data-action]');
//         if(!actionBtn) return;
//
//         const itemEl = e.target.closest('.cart-item');
//         if(!itemEl) return;
//
//         const id = itemEl.dataset.id;
//         const cart = loadCart();
//
//         const action = actionBtn.dataset.action;
//         if(action === 'inc'){
//             cart.items[id].qty += 1;
//         }else if(action === 'dec'){
//             cart.items[id].qty = Math.max(0, cart.items[id].qty - 1);
//             if(cart.items[id].qty === 0) delete cart.items[id];
//         }else if(action === 'remove'){
//             delete cart.items[id];
//         }
//
//         saveCart(cart);
//         renderCart();
//     });
//
//     // 初始同步
//     (function initCartUI(){
//         const cart = loadCart();
//         updateCartBadge(cart);
//         syncProductCardQuantities(cart);
//     })();
//
//     // 飞入购物车动画
//     function tryFlyToCart(card, product){
//         const imgEl = $('.product-image img', card);
//         const cartIcon = $('#cart-button .fa-shopping-cart');
//         if(!imgEl || !cartIcon) return;
//
//         const anim = document.createElement('div');
//         anim.classList.add('cart-animation');
//         anim.innerHTML = `<img src="${product.img || imgEl.src}" alt="${product.name}">`;
//         document.body.appendChild(anim);
//
//         const from = imgEl.getBoundingClientRect();
//         const to = cartIcon.getBoundingClientRect();
//
//         Object.assign(anim.style, {
//             left: `${from.left + from.width/2}px`,
//             top: `${from.top + from.height/2}px`,
//             width: '60px', height: '60px', opacity: '1',
//             transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
//         });
//
//         requestAnimationFrame(()=>{
//             Object.assign(anim.style, {
//                 left: `${to.left + to.width/2}px`,
//                 top: `${to.top + to.height/2}px`,
//                 width:'10px', height:'10px', opacity:'0.5'
//             });
//         });
//
//         setTimeout(()=> anim.remove(), 820);
//     }
//
//     /* ========== 订阅（demo） ========== */
//     const subscribeBtn = document.getElementById('subscribe-btn');
//     const emailInput = document.getElementById('newsletter-email');
//     const response = document.getElementById('subscription-response');
//     const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
//
//     subscribeBtn?.addEventListener('click', (e)=>{
//         e.preventDefault();
//         const email = emailInput.value.trim();
//         if(!isEmail(email)){
//             response.style.color = 'red';
//             response.textContent = 'Please enter a valid email address.';
//             return;
//         }
//         response.style.color = 'green';
//         response.textContent = `Thank you for subscribing, ${email}!`;
//         emailInput.value = '';
//     });
// });
