const toast = document.getElementById('toast');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const searchInput = document.getElementById('searchInput');
const transactionRows = [...document.querySelectorAll('#transactionsBody tr')];
const themeToggle = document.getElementById('themeToggle');
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const adminAccount = { username: 'ENGFT', password: 'ENG2026', role: 'مدير النظام', permissions: 'كامل الصلاحيات' };

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function setTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.setAttribute('aria-label', isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
    themeToggle.title = isDark ? 'الوضع الفاتح' : 'الوضع الداكن';
}

setTheme(localStorage.getItem('idh-theme') === 'dark');

const languageSelect = document.getElementById('languageSelect');
const languageText = {
    ar: { welcome: 'مرحباً، مدير المنظمة', welcomeSub: 'نظرة سريعة على أداء منظمة I D H الخيرية', heroSmall: 'نظرة شاملة وفعالة', heroTitle: 'لوحة المعلومات', heroSub: 'مركز واحد لمتابعة مشاريع ومبادرات وعملاء منظمة I D H الخيرية', nav: ['لوحة المعلومات', 'المشاريع', 'العملاء', 'عروض الأسعار', 'المناقصات', 'التقارير', 'المستخدمون والصلاحيات', 'إعدادات النظام'], search: 'ابحث في النظام' },
    en: { welcome: 'Welcome, Organization Manager', welcomeSub: 'A quick overview of I D H Charity Organization performance', heroSmall: 'A clear and effective overview', heroTitle: 'Information Dashboard', heroSub: 'One place to follow I D H projects, initiatives, and clients', nav: ['Dashboard', 'Projects', 'Clients', 'Price Offers', 'Tenders', 'Reports', 'Users & Permissions', 'System Settings'], search: 'Search the system' }
};

function applyLanguage(language) {
    const text = languageText[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.body.classList.toggle('ltr', language === 'en');
    document.querySelector('.welcome > span').textContent = text.welcome;
    document.querySelector('.welcome small').textContent = text.welcomeSub;
    document.querySelector('.hero-copy small').textContent = text.heroSmall;
    document.querySelector('.hero-copy h1').textContent = text.heroTitle;
    document.querySelector('.hero-copy p').textContent = text.heroSub;
    document.getElementById('searchInput').placeholder = text.search;
    document.querySelectorAll('.main-nav a').forEach((link, index) => {
        const icon = link.querySelector('span')?.outerHTML || '';
        link.innerHTML = `${icon} ${text.nav[index]}`;
    });
    localStorage.setItem('idh-language', language);
}

languageSelect.value = localStorage.getItem('idh-language') || 'ar';
applyLanguage(languageSelect.value);
languageSelect.addEventListener('change', (event) => {
    applyLanguage(event.target.value);
    showToast(event.target.value === 'en' ? 'English language enabled' : 'تم تفعيل اللغة العربية');
});

if (sessionStorage.getItem('idh-admin-session') === 'active') {
    loginScreen.classList.add('hidden');
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (username === adminAccount.username && password === adminAccount.password) {
        sessionStorage.setItem('idh-admin-session', 'active');
        loginScreen.classList.add('hidden');
        loginError.textContent = '';
        showToast(`مرحباً ${adminAccount.username}، تم منحك ${adminAccount.permissions}`);
        return;
    }
    loginError.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
});

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setTheme(isDark);
    localStorage.setItem('idh-theme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'تم تفعيل الوضع الداكن' : 'تم تفعيل الوضع الفاتح');
});

menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
const workspacePanel = document.getElementById('workspacePanel');
const workspaceTitle = document.getElementById('workspaceTitle');
const workspaceContent = document.getElementById('workspaceContent');
const workspaceSections = {
    projects: { title: 'إدارة المشاريع', subtitle: 'إضافة وتعديل وحذف المشاريع', fields: ['اسم المشروع', 'العميل', 'قيمة العقد', 'حالة المشروع'] },
    clients: { title: 'إدارة العملاء', subtitle: 'تحديث بيانات العملاء ووسائل التواصل', fields: ['اسم العميل', 'البريد الإلكتروني', 'رقم الهاتف', 'نوع العميل'] },
    offers: { title: 'إدارة عروض الأسعار', subtitle: 'إنشاء ومراجعة عروض الأسعار', fields: ['رقم العرض', 'اسم العميل', 'قيمة العرض', { label: 'تاريخ الانتهاء', type: 'date' }] },
    tenders: { title: 'إدارة المناقصات', subtitle: 'تعديل ومتابعة المناقصات وطلبات الشراء', fields: ['اسم المناقصة', 'الجهة المالكة', 'المرجع', { label: 'آخر موعد للتقديم', type: 'date' }], dateFilter: true },
    reports: { title: 'التقارير', subtitle: 'إنشاء التقارير وحفظها وتصديرها', fields: ['عنوان التقرير', { label: 'الفترة من', type: 'date' }, { label: 'الفترة إلى', type: 'date' }, 'نوع التقرير'], dateFilter: true },
    users: { title: 'المستخدمون والصلاحيات', subtitle: 'إدارة الحسابات والصلاحيات الكاملة', fields: ['اسم المستخدم', 'البريد الإلكتروني', 'الدور', 'الصلاحية'] },
    settings: { title: 'إعدادات النظام', subtitle: 'إدارة إعدادات المنظمة وقنوات التواصل', fields: ['اسم المنظمة', 'البريد الرئيسي', 'رقم التواصل', 'اللغة'] }
};

function openWorkspace(sectionKey) {
    const section = workspaceSections[sectionKey];
    if (!section) return;
    workspaceTitle.textContent = section.title;
    document.getElementById('workspaceSubtitle').textContent = section.subtitle;
    const filterButton = section.dateFilter ? '<button class="filter-btn" data-workspace-action="filter">⌕ تصفية بالتاريخ</button>' : '';
    workspaceContent.innerHTML = `<div class="workspace-actions"><button class="primary-btn" data-workspace-action="add">＋ إضافة جديد</button><button class="filter-btn" data-workspace-action="edit">✎ تعديل المحدد</button><button class="filter-btn" data-workspace-action="delete">⌫ حذف المحدد</button>${filterButton}<button class="filter-btn" data-workspace-action="export">⇩ تصدير القسم</button></div><form class="workspace-form" id="sectionForm">${section.fields.map((field, index) => { const item = typeof field === 'string' ? { label: field, type: 'text' } : field; return `<label>${item.label}<input type="${item.type}" name="field${index}" placeholder="${item.type === 'date' ? '' : `أدخل ${item.label}`}" /></label>`; }).join('')}<div class="workspace-form-footer"><button class="primary-btn" type="submit">حفظ التغييرات</button><span class="permission-note">ENGFT · مدير النظام · كامل الصلاحيات</span></div></form><div class="workspace-list"><b>آخر السجلات</b><span>لا يوجد سجل محدد، اختر إضافة جديد أو عدّل البيانات أعلاه.</span></div>`;
    workspacePanel.hidden = false;
    workspacePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    workspaceContent.querySelector('#sectionForm').addEventListener('submit', (event) => {
        event.preventDefault();
        showToast(`تم حفظ تغييرات قسم ${section.title}`);
    });
    workspaceContent.querySelectorAll('[data-workspace-action]').forEach((button) => button.addEventListener('click', () => {
        const actionNames = { add: 'إضافة سجل جديد', edit: 'تعديل السجل المحدد', delete: 'حذف السجل المحدد', filter: 'تصفية البيانات بالتاريخ', export: 'تصدير بيانات القسم' };
        if (button.dataset.workspaceAction === 'filter') {
            const dates = [...workspaceContent.querySelectorAll('input[type="date"]')].map((input) => input.value).filter(Boolean);
            workspaceContent.querySelector('.workspace-list span').textContent = dates.length ? `تمت التصفية حسب التاريخ: ${dates.join(' إلى ')}` : 'اختر تاريخًا واحدًا على الأقل لتصفية البيانات.';
        }
        showToast(`${actionNames[button.dataset.workspaceAction]} في ${section.title}`);
    }));
}

document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelectorAll('.main-nav a').forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
        sidebar.classList.remove('open');
        const sectionKey = link.getAttribute('href').slice(1);
        if (sectionKey === 'dashboard') {
            workspacePanel.hidden = true;
            document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        openWorkspace(sectionKey);
    });
});

document.getElementById('closeWorkspace').addEventListener('click', () => {
    workspacePanel.hidden = true;
    showToast('تم إغلاق مساحة الإدارة');
});

document.querySelector('.hero-banner').addEventListener('click', () => showToast('لوحة منظمة I D H جاهزة للمتابعة'));
document.getElementById('notificationBtn').addEventListener('click', () => showToast('لديك 3 إشعارات جديدة'));
document.querySelector('.support-card button').addEventListener('click', () => showToast('سيتواصل معك فريق الدعم قريباً'));

document.getElementById('addRecord').addEventListener('click', () => {
    const name = window.prompt('اكتب اسم السجل الجديد:');
    if (!name) return;
    const row = document.createElement('tr');
    row.innerHTML = `<td><span class="donor-avatar green-bg">${name.charAt(0)}</span><span class="person">${name}<small>#IDH-NEW</small></span></td><td>سجل جديد</td><td>25 سبتمبر 2026</td><td><span class="payment">إدخال يدوي</span></td><td class="amount">غير محدد</td><td><span class="status pending">قيد المراجعة</span></td>`;
    document.getElementById('transactionsBody').prepend(row);
    showToast(`تمت إضافة السجل: ${name}`);
});

document.getElementById('deleteRecord').addEventListener('click', () => {
    const lastRow = document.querySelector('#transactionsBody tr:last-child');
    if (!lastRow) return showToast('لا توجد سجلات لمسحها');
    const recordName = lastRow.querySelector('.person')?.firstChild?.textContent?.trim() || 'السجل';
    lastRow.remove();
    showToast(`تم مسح ${recordName}`);
});

document.getElementById('sendMessage').addEventListener('click', () => {
    const message = window.prompt('اكتب الرسالة المراد إرسالها:');
    if (message) showToast('تم إرسال الرسالة إلى أعضاء النظام');
});

document.getElementById('inboxButton').addEventListener('click', () => {
    const inbox = document.getElementById('inboxPreview');
    inbox.hidden = !inbox.hidden;
    showToast(inbox.hidden ? 'تم إخفاء الوارد' : 'لديك رسالتان واردتان');
});

document.getElementById('exportData').addEventListener('click', () => {
    const data = { organization: 'I D H الخيرية', exportedBy: 'ENGFT', exportedAt: new Date().toISOString(), transactions: [...document.querySelectorAll('#transactionsBody tr')].map((row) => row.innerText) };
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    link.download = 'idh-system-export.json';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('تم تصدير بيانات النظام');
});

document.getElementById('clearData').addEventListener('click', () => {
    if (!window.confirm('هل أنت متأكد من إفراغ كل البيانات المحلية؟')) return;
    document.getElementById('transactionsBody').innerHTML = '';
    localStorage.removeItem('idh-system-data');
    showToast('تم إفراغ البيانات المحلية بالكامل');
});

document.getElementById('editChannels').addEventListener('click', () => {
    const channel = window.prompt('اكتب اسم القناة التي تريد تحديثها:');
    if (channel) showToast(`تم فتح إعدادات قناة ${channel}`);
});

document.getElementById('composeEmail').addEventListener('click', () => {
    const recipient = window.prompt('اكتب البريد الإلكتروني للمستلم:');
    if (!recipient) return;
    window.location.href = `mailto:${recipient}`;
});

document.getElementById('openEmail').addEventListener('click', () => {
    window.location.href = 'mailto:contact@idh.org';
});

document.getElementById('filterBtn').addEventListener('click', () => {
    const status = window.prompt('اكتب الحالة للتصفية: مكتمل أو قيد المراجعة');
    if (!status) return;
    transactionRows.forEach((row) => {
        row.hidden = !row.textContent.includes(status);
    });
    showToast(`تمت تصفية السجلات حسب: ${status}`);
});

searchInput.addEventListener('input', (event) => {
    const term = event.target.value.trim().toLowerCase();
    transactionRows.forEach((row) => {
        row.hidden = term && !row.textContent.toLowerCase().includes(term);
    });
});

document.querySelectorAll('.date-button').forEach((button) => button.addEventListener('click', () => showToast('التاريخ الحالي: 25 سبتمبر 2026')));
