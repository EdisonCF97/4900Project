const CART_KEY = 'sushi_lin_cart_v1';

function loadCart(){
    try{ const raw = localStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : { items:{} }; }
    catch{ return { items:{} }; }
}
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function cartTotalQty(c = loadCart()){ return Object.values(c.items).reduce((s,it)=>s+it.qty,0); }
function cartTotalAmount(c = loadCart()){ return Object.values(c.items).reduce((s,it)=>s+it.qty*it.price,0); }
function fmt(n){ return `$${Number(n).toFixed(2)}`; }

function updateBadge(){
    const el = document.querySelector('.cart-count');
    if(!el) return;
    el.textContent = cartTotalQty();
}

function renderCart(){
    const c = loadCart();
    const itemsEl = document.querySelector('.cart-items');
    const totalEl = document.getElementById('cart-summary-total');
    if(!itemsEl) return;

    itemsEl.innerHTML = '';
    const ids = Object.keys(c.items);
    if(ids.length === 0){
        const empty = document.createElement('div');
        empty.className = 'text-muted';
        empty.style.padding = '12px';
        empty.textContent = 'Your cart is empty';
        itemsEl.appendChild(empty);
    }else{
        ids.forEach(id=>{
            const it = c.items[id];
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.dataset.id = id;
            row.innerHTML = `
        <div>
          <h4>${it.name}</h4>
          <div class="cart-qty">
            <button class="qty-btn" data-act="dec">-</button>
            <span class="qty">${it.qty}</span>
            <button class="qty-btn" data-act="inc">+</button>
            <button class="remove" data-act="rm">Remove</button>
          </div>
        </div>
        <div class="price">${fmt(it.qty * it.price)}</div>
      `;
            itemsEl.appendChild(row);
        });
    }
    if(totalEl){ totalEl.textContent = fmt(cartTotalAmount(c)); }
}

function addToCart({id,name,price,qty=1}){
    const c = loadCart();
    if(!c.items[id]) c.items[id] = { name, price, qty:0 };
    c.items[id].qty += qty;
    if(c.items[id].qty <= 0) delete c.items[id];
    saveCart(c);
    updateBadge();
    renderCart();
}

function openCart(){
    document.querySelector('.cart-drawer')?.classList.add('open');
    document.querySelector('.cart-overlay')?.classList.add('open');
}
function closeCart(){
    document.querySelector('.cart-drawer')?.classList.remove('open');
    document.querySelector('.cart-overlay')?.classList.remove('open');
}

/* Auth (localStorage mock) */
const USERS_KEY   = 'sushi_lin_users_v1';   // { [email]: {name, pass} }
const SESSION_KEY = 'sushi_lin_session_v1'; // { email, name } or null

function loadUsers(){ try{ const raw = localStorage.getItem(USERS_KEY); return raw?JSON.parse(raw):{}; }catch{ return {}; } }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession(){ try{ const raw = localStorage.getItem(SESSION_KEY); return raw?JSON.parse(raw):null; }catch{ return null; } }
function setSession(s){ if(s) localStorage.setItem(SESSION_KEY, JSON.stringify(s)); else localStorage.removeItem(SESSION_KEY); }

function applyAuthUI(){
    const loginLink = document.querySelector(".nav-links a[href='login.html'], .nav-links a.logout-link, .nav-links a[data-logout]");
    const navIcons  = document.querySelector('.nav-icons');
    const s = getSession();

    // 清理旧 greeting
    document.querySelector('.nav-greeting')?.remove();

    if(loginLink){
        if(s){
            // Login -> Logout
            loginLink.textContent = 'Logout';
            loginLink.removeAttribute('href');
            loginLink.setAttribute('data-logout','');
            loginLink.classList.add('logout-link');

            // 插入问候语
            const greet = document.createElement('span');
            greet.className = 'nav-greeting';
            greet.style.marginRight = '8px';
            greet.style.fontWeight = '800';
            greet.textContent = `Hi, ${s.name}`;
            if(navIcons) navIcons.insertBefore(greet, navIcons.firstChild);
        }else{
            // 恢复 Login
            loginLink.textContent = 'Login';
            loginLink.setAttribute('href','login.html');
            loginLink.removeAttribute('data-logout');
            loginLink.classList.remove('logout-link');
        }
    }
}

/* Bootstrap (runs on all pages) */
document.addEventListener('DOMContentLoaded', () => {
    // Cart open/close
    document.querySelectorAll('[data-open-cart]').forEach(btn=>{
        btn.addEventListener('click', (e)=>{ e.preventDefault(); renderCart(); openCart(); });
    });
    document.querySelector('[data-close-cart]')?.addEventListener('click', closeCart);
    document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);

    // Cart item actions (delegation)
    document.querySelector('.cart-items')?.addEventListener('click', function(e){
        const btn = e.target.closest('[data-act]');
        if(!btn) return;
        const row = e.target.closest('.cart-item');
        if(!row) return;
        const id = row.dataset.id;
        const act = btn.dataset.act;

        const c = loadCart();
        if(!c.items[id]) return;

        if(act === 'inc'){ c.items[id].qty += 1; }
        if(act === 'dec'){
            c.items[id].qty = Math.max(0, c.items[id].qty - 1);
            if(c.items[id].qty === 0) delete c.items[id];
        }
        if(act === 'rm'){ delete c.items[id]; }

        saveCart(c);
        updateBadge();
        renderCart();
    });

    // Global add-to-cart: any [data-add]
    document.body.addEventListener('click', (e)=>{
        const btn = e.target.closest('[data-add]');
        if(!btn) return;

        // If in menu row with quantity-input, honor its value
        const wrap = btn.closest('.menu-item');
        let qty = 1;
        const input = wrap?.querySelector('.quantity-input');
        if(input){
            qty = Math.max(1, parseInt(input.value || '1', 10));
        }

        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price || '0');

        addToCart({ id, name, price, qty });
    });

    // Proceed to checkout (from drawer)
    document.querySelector('[data-checkout]')?.addEventListener('click', ()=>{
        window.location.href = 'payment.html';
    });

    // Initialize badge & cart view
    updateBadge();
    renderCart();

    /* Index Slider */
    const slides = document.getElementById('banner-slides');
    if(slides){
        const prev = document.getElementById('banner-prev');
        const next = document.getElementById('banner-next');
        const dotsWrap = document.getElementById('banner-dots');
        const count = slides.children.length;
        let idx = 0; let timer;

        function go(i){
            idx = (i + count) % count;
            slides.style.transform = `translateX(-${idx * (100/count)}%)`;
            drawDots();
        }
        function drawDots(){
            if(!dotsWrap) return;
            dotsWrap.innerHTML = '';
            for(let i=0;i<count;i++){
                const b = document.createElement('button');
                if(i===idx) b.classList.add('active');
                b.addEventListener('click', ()=>{ go(i); restart(); });
                dotsWrap.appendChild(b);
            }
        }
        function nextSlide(){ go(idx + 1); }
        function start(){ timer = setInterval(nextSlide, 6000); }
        function restart(){ clearInterval(timer); start(); }

        prev?.addEventListener('click', ()=>{ go(idx - 1); restart(); });
        next?.addEventListener('click', ()=>{ go(idx + 1); restart(); });

        go(0); start();
    }

    /* Newsletter */
    document.getElementById('subscribe-btn')?.addEventListener('click', (e)=>{
        e.preventDefault();
        const input = document.getElementById('newsletter-email');
        const resp = document.getElementById('subscription-response');
        const email = (input?.value || '').trim();
        if(!email){ resp.textContent = 'Please enter a valid email address.'; resp.style.color = 'red'; return; }
        resp.textContent = `Thank you for subscribing, ${email}!`;
        resp.style.color = 'green';
        input.value = '';
    });

    /* Menu plus/minus */
    document.addEventListener('click', (e)=>{
        if(e.target.matches('[data-plus]')){
            const wrap = e.target.closest('.quantity-controls');
            const input = wrap?.querySelector('.quantity-input');
            if(input) input.value = (parseInt(input.value || '0', 10) + 1).toString();
        }
        if(e.target.matches('[data-minus]')){
            const wrap = e.target.closest('.quantity-controls');
            const input = wrap?.querySelector('.quantity-input');
            if(input) input.value = Math.max(0, parseInt(input.value || '0', 10) - 1).toString();
        }
    });

    /* Contact reservation */
    document.getElementById('reservation-form')?.addEventListener('submit', (e)=>{
        e.preventDefault();
        const name = document.getElementById('res-name').value.trim();
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const people = document.getElementById('res-people').value;
        const fb = document.getElementById('res-feedback');

        if(!name || !date || !time || !people){
            fb.textContent = 'Please complete all required fields.';
            fb.style.color = 'red';
            return;
        }
        fb.textContent = `Reservation received for ${name} on ${date} ${time} for ${people} people. We will confirm shortly.`;
        fb.style.color = 'green';
        e.target.reset();
    });

    /* Payment summary + PayPal + pickup/delivery */
    if (document.body.classList.contains('page-payment')) {
        const list  = document.getElementById('order-items');
        const subEl = document.getElementById('sum-subtotal');
        const delEl = document.getElementById('sum-delivery');
        const totEl = document.getElementById('sum-total');
        const fb    = document.getElementById('co-feedback');

        let orderType = 'pickup'; // pickup | delivery
        const DELIVERY_FEE = 5;

        function deliveryFee() {
            const c = loadCart(); const ids = Object.keys(c.items);
            return ids.length && orderType === 'delivery' ? DELIVERY_FEE : 0;
        }

        function toggleAddressUI() {
            const show = orderType === 'delivery';
            ['co-address','co-city','co-state','co-zip'].forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.required = show;
                const box = el.closest('div');
                if (box) box.style.display = show ? '' : 'none';
            });
            document.getElementById('address-fields')?.style.setProperty('opacity', show ? '1' : '.5');
        }

        function renderSummary() {
            const c = loadCart();
            list.innerHTML = '';
            const ids = Object.keys(c.items);

            if (ids.length === 0) {
                const p = document.createElement('p');
                p.className = 'text-muted';
                p.textContent = 'Your cart is empty.';
                list.appendChild(p);
            } else {
                ids.forEach((id) => {
                    const it = c.items[id];
                    const row = document.createElement('div');
                    row.className = 'order-item';
                    row.innerHTML = `
            <div>
              <div class="oi-name">${it.name}</div>
              <div class="oi-meta">Qty ${it.qty} × ${fmt(it.price)}</div>
            </div>
            <div class="oi-price">${fmt(it.qty * it.price)}</div>
          `;
                    list.appendChild(row);
                });
            }

            const subtotal = cartTotalAmount(c);
            const delivery = deliveryFee();
            subEl.textContent = fmt(subtotal);
            delEl.textContent = fmt(delivery);
            totEl.textContent = fmt(subtotal + delivery);
        }

        function renderPayPal() {
            const box = document.getElementById('paypal-buttons');
            if (!box || typeof paypal === 'undefined') return;
            box.innerHTML = '';

            const total = (cartTotalAmount() + deliveryFee()).toFixed(2);

            paypal.Buttons({
                style: { layout: 'vertical' },
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{ amount: { value: total } }]
                    });
                },
                onApprove: async (data, actions) => {
                    await actions.order.capture();
                    fb.textContent = 'Payment successful with PayPal! Your order is confirmed.';
                    fb.style.color = 'green';
                    saveCart({ items: {} });
                    updateBadge();
                    renderSummary();
                    renderPayPal();
                },
                onError: (err) => {
                    fb.textContent = 'PayPal payment error. Please try again.';
                    fb.style.color = 'red';
                }
            }).render('#paypal-buttons');
        }

        // order type change
        document.querySelectorAll('input[name="orderType"]').forEach(r => {
            r.addEventListener('change', (e) => {
                orderType = e.target.value;
                toggleAddressUI();
                renderSummary();
                renderPayPal();
            });
        });

        // init
        toggleAddressUI();
        renderSummary();
        renderPayPal();

        // fake card pay
        document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const num = document.getElementById('co-card').value.replace(/\s+/g,'');
            if (!/^\d{12,19}$/.test(num)) {
                fb.textContent = 'Please enter a valid card number.';
                fb.style.color = 'red';
                return;
            }
            fb.textContent = 'Payment successful! Your order is confirmed.';
            fb.style.color = 'green';
            saveCart({ items: {} });
            updateBadge();
            renderSummary();
        });
    }

    /* Login / Register page logic */

    applyAuthUI();

    // 全局登出
    document.addEventListener('click', (e)=>{
        const btn = e.target.closest('[data-logout]');
        if(!btn) return;
        e.preventDefault();
        setSession(null);
        applyAuthUI();
        // 如果当前在登录页，刷新成登录表单态
        if (document.body.classList.contains('page-login')) {
            document.querySelector('.auth-tab[data-tab="login"]')?.click();
            const fb = document.getElementById('lg-feedback');
            if (fb){ fb.textContent = 'You have logged out.'; fb.style.color = 'green'; }
        }
    });

    if(document.body.classList.contains('page-login')){
        // tabs
        document.querySelectorAll('.auth-tab').forEach(tab=>{
            tab.addEventListener('click', ()=>{
                document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active'));
                tab.classList.add('active');
                const t = tab.dataset.tab;
                document.getElementById('panel-login')?.classList.toggle('hidden', t!=='login');
                document.getElementById('panel-register')?.classList.toggle('hidden', t!=='register');
            });
        });

        // register
        document.getElementById('reg-form')?.addEventListener('submit',(e)=>{
            e.preventDefault();
            const name = document.getElementById('rg-name').value.trim();
            const email = document.getElementById('rg-email').value.trim().toLowerCase();
            const pass = document.getElementById('rg-pass').value;
            const fb = document.getElementById('rg-feedback');

            if(!name || !email || !pass){ fb.textContent='Please complete all fields.'; fb.style.color='red'; return; }
            if(!/^\S+@\S+\.\S+$/.test(email)){ fb.textContent='Please enter a valid email.'; fb.style.color='red'; return; }
            if(pass.length < 6){ fb.textContent='Password must be at least 6 characters.'; fb.style.color='red'; return; }

            const users = loadUsers();
            if(users[email]){ fb.textContent='This email is already registered.'; fb.style.color='red'; return; }
            users[email] = { name, pass };
            saveUsers(users);

            fb.textContent='Account created! You can login now.';
            fb.style.color='green';
            e.target.reset();
            document.querySelector('.auth-tab[data-tab="login"]')?.click();
        });

        // login
        document.getElementById('login-form')?.addEventListener('submit',(e)=>{
            e.preventDefault();
            const email = document.getElementById('lg-email').value.trim().toLowerCase();
            const pass = document.getElementById('lg-pass').value;
            const fb = document.getElementById('lg-feedback');
            const users = loadUsers();
            if(!users[email] || users[email].pass !== pass){
                fb.textContent='Invalid email or password.';
                fb.style.color='red';
                return;
            }
            setSession({ email, name: users[email].name });
            applyAuthUI();
            fb.textContent=`Welcome back, ${users[email].name}!`;
            fb.style.color='green';
            setTimeout(()=>location.href='index.html', 800);
        });
    }

});
