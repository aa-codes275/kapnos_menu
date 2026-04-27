const SUPABASE_URL = 'https://ipyboqsodseqzkgqxjev.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_xZyMpi5Mfck4k-eQGSfteg_DkyH4jHN'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let menuData = [];

async function loadMenu() {
    const { data, error } = await _supabase.from('products').select('*');
    if (error) console.error("Error:", error);
    else menuData = data;
}

function showCategory(cat, element) {
    

    const container = document.getElementById('products-container');
    const nav = document.querySelector('.category-nav');
    const backBtn = document.getElementById('back-container');
    

    container.innerHTML = "";
    nav.style.display = 'none';
    backBtn.style.display = 'block';

    
    const filtered = menuData.filter(p => p.category.trim().toLowerCase() === cat.toLowerCase() && p.is_hidden !== true);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:50px;">قريباً في كابنوس..</p>`;
    } else {
        displayItems(filtered);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    
}

function displayItems(items) {
    const container = document.getElementById('products-container');
    items.forEach(p => {
        const priceHTML = p.disconunt_price 
            ? `<span class="old-price">${p.price}</span><span>${p.disconunt_price} EGP</span>`
            : `<span>${p.price} EGP</span>`;

        container.innerHTML += `
            <div class="item-row" style="display: flex; align-items: center; gap: 15px;">
                <div class="item-img" style="width: 100px; height: 100px; flex-shrink: 0;">
                    <img src="${p.image_url || 'img/default.jpg'}" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 1px solid #ff0000;">
                </div>
                
                <div class="item-info" style="flex-grow: 1;">
                    <div class="item-name">${p.name}</div>
                    <small style="color:#888">${p.description || ''}</small>
                </div>
                <div class="item-price">${priceHTML}</div>
            </div>`;
    });
}

function goBack() {
    document.querySelector('.category-nav').style.display = 'grid';
    document.getElementById('back-container').style.display = 'none';
    document.getElementById('products-container').innerHTML = "";
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term.trim() !== "") {
        document.querySelector('.category-nav').style.display = 'none';
        document.getElementById('back-container').style.display = 'block';
        const filtered = menuData.filter(p => p.name.toLowerCase().includes(term));
        document.getElementById('products-container').innerHTML = "";
        displayItems(filtered);
    } else {
        goBack();
    }
});
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlRoot = document.documentElement;


const savedTheme = localStorage.getItem('kapnos-theme') || 'red';
if (savedTheme === 'blue') {
    htmlRoot.setAttribute('data-theme', 'blue');
    themeIcon.innerText = '☀️'; 
}


themeToggle.addEventListener('click', () => {
    const isBlue = htmlRoot.getAttribute('data-theme') === 'blue';
    
    if (isBlue) {
        htmlRoot.removeAttribute('data-theme');
        themeIcon.innerText = '🌙';
        localStorage.setItem('kapnos-theme', 'red');
    } else {
        htmlRoot.setAttribute('data-theme', 'blue');
        themeIcon.innerText = '☀️';
        localStorage.setItem('kapnos-theme', 'blue');
    }
    
    
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => themeToggle.style.transform = 'rotate(0deg)', 400);
});
document.addEventListener("DOMContentLoaded", loadMenu);
