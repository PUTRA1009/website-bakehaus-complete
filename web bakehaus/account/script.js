document.addEventListener('DOMContentLoaded', function () {

    // =======================================
    // Variabel Penting
    // =======================================
    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('.account-section');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    const logoutBtn = document.getElementById('logoutBtn');

    // =======================================
    // Fungsi Bantu
    // =======================================
    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    function clearCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    function showSection(sectionId) {
        sections.forEach(sec => sec.classList.add('hidden'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove('hidden');

        // Update active menu
        menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const target = this.getAttribute('href').substring(1); // contoh: "history", "addresses", "profile"
        const targetId = target + '-section';

        const currentUser = getCurrentUser();

        // Daftar menu yang butuh login
        const needLoginSections = ['profile', 'payment', 'addresses', 'history'];

        // Kalau menu butuh login tapi belum login → paksa ke login
        if (needLoginSections.includes(target) && !currentUser) {
            showSection('login-section');
            alert('Silakan login terlebih dahulu untuk mengakses menu ini.');
            return;
        }

        // Jika lolos pengecekan, tampilkan section yang dipilih
        menuLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        sections.forEach(sec => sec.classList.add('hidden'));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    });
});
    }

    // =======================================
    // Cek status login saat halaman dibuka
    // =======================================
    function checkLoginStatus() {
        const currentUser = getCurrentUser();
        if (currentUser) {
            // Sudah login → tampilkan profil
            document.getElementById('profileName').textContent = currentUser.name || 'Pengguna';
            document.getElementById('profileFullName').textContent = currentUser.name || 'Belum diisi';
            document.getElementById('profileEmail').textContent = currentUser.email;
            document.getElementById('profileEmailDisplay').textContent = currentUser.email;
            document.getElementById('joinDate').textContent = new Date().toLocaleDateString('id-ID');

            showSection('profile-section');
        } else {
            // Belum login → tampilkan form login
            showSection('login-section');
        }
    }

    // Jalankan pengecekan pertama kali
    checkLoginStatus();

    // =======================================
    // Proses Login
    // =======================================
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            loginMessage.classList.remove('success', 'error');
            loginMessage.classList.remove('hidden');

            const users = getUsers();
            const user = users.find(u => u.email === email);

            if (!user) {
                loginMessage.textContent = 'Email belum terdaftar. Silakan buat akun terlebih dahulu.';
                loginMessage.classList.add('error');
                return;
            }

            if (user.password !== password) {
                loginMessage.textContent = 'Kata sandi salah.';
                loginMessage.classList.add('error');
                return;
            }

            // Login berhasil
            loginMessage.textContent = `Selamat datang kembali, ${user.name || 'Pengguna'}!`;
            loginMessage.classList.add('success');

            // Simpan user yang sedang login
            setCurrentUser(user);

            loginForm.reset();

            // Tunggu 1.5 detik lalu tampilkan profil
            setTimeout(() => {
                checkLoginStatus();
            }, 1500);
        });
    }

    // =======================================
    // Proses Daftar
    // =======================================
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const name = document.getElementById('regName').value.trim() || 'Pengguna';

            registerMessage.classList.remove('success', 'error');
            registerMessage.classList.remove('hidden');

            if (password.length < 6) {
                registerMessage.textContent = 'Kata sandi minimal 6 karakter.';
                registerMessage.classList.add('error');
                return;
            }

            const users = getUsers();

            if (users.some(u => u.email === email)) {
                registerMessage.textContent = 'Email ini sudah terdaftar. Silakan masuk.';
                registerMessage.classList.add('error');
                return;
            }

            const newUser = { email, password, name };
            users.push(newUser);
            saveUsers(users);

            registerMessage.textContent = 'Akun berhasil dibuat! Anda akan dialihkan ke login...';
            registerMessage.classList.add('success');

            registerForm.reset();

            setTimeout(() => {
                showSection('login-section');
            }, 2000);
        });
    }

    // =======================================
    // Tombol Logout
    // =======================================
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                clearCurrentUser();
                checkLoginStatus();
                showSection('login-section');
            }
        });
    }

    // =======================================
    // Switch antar form (Daftar ↔ Masuk)
    // =======================================
    document.querySelectorAll('.switch-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            showSection(target.substring(1) + '-section');
        });
    });
});

// =======================================
// Metode Pembayaran - Simpan pilihan
// =======================================
const paymentForm = document.getElementById('paymentMethodForm');
const paymentMessage = document.getElementById('paymentMessage');

if (paymentForm) {
    // Highlight option yang dipilih
    const radioInputs = document.querySelectorAll('input[name="paymentMethod"]');
    radioInputs.forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.option-content').forEach(el => {
                el.classList.remove('selected');
            });
            this.closest('.option-content').classList.add('selected');
        });
    });

    // Saat form disubmit
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
        
        if (!selectedMethod) {
            paymentMessage.textContent = 'Silakan pilih salah satu metode pembayaran.';
            paymentMessage.classList.add('error');
            paymentMessage.classList.remove('hidden');
            return;
        }

        // Simulasi simpan (bisa diganti dengan localStorage atau kirim ke server nanti)
        const methodNames = {
            qris: 'QRIS',
            credit_card: 'Kartu Kredit/Debit',
            mobile_banking: 'Mobile Banking / Virtual Account'
        };

        const chosen = methodNames[selectedMethod.value];
        
        paymentMessage.textContent = `Metode pembayaran berhasil disimpan: ${chosen}`;
        paymentMessage.classList.add('success');
        paymentMessage.classList.remove('hidden');

        // Reset pesan setelah beberapa detik (opsional)
        setTimeout(() => {
            paymentMessage.classList.add('hidden');
        }, 4000);
    });
}