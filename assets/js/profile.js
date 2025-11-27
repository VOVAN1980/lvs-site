// Простой JS для кабинета.
// 1) Выпадающее меню пользователя
// 2) Переключение вкладок (Лента / О профиле)
// 3) Загрузка аватара (через localStorage как прототип)

(function () {
    const userBtn = document.getElementById("profileUserMenuBtn");
    const userMenu = document.getElementById("profileUserMenu");

    if (userBtn && userMenu) {
        userBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            userMenu.classList.toggle("profile-user-menu-open");
        });

        document.addEventListener("click", function () {
            userMenu.classList.remove("profile-user-menu-open");
        });

        userMenu.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        // фейковый "выход"
        const logoutBtn = userMenu.querySelector("[data-action='logout']");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                alert("Здесь позже будет логика выхода из аккаунта.\nПока это просто заглушка.");
            });
        }
    }

    // Вкладки
    const tabs = document.querySelectorAll(".profile-tab");
    const sections = document.querySelectorAll(".profile-columns");

    if (tabs.length && sections.length) {
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const target = tab.getAttribute("data-tab");

                tabs.forEach(t => t.classList.remove("profile-tab-active"));
                tab.classList.add("profile-tab-active");

                sections.forEach(sec => {
                    const secName = sec.getAttribute("data-section");
                    if (secName === target) {
                        sec.classList.remove("profile-columns-hidden");
                    } else {
                        sec.classList.add("profile-columns-hidden");
                    }
                });
            });
        });
    }

    // Аватар (прототип: хранение в localStorage)
    const avatar = document.getElementById("profileAvatar");
    const avatarImg = document.getElementById("profileAvatarImg");
    const avatarEdit = document.getElementById("profileAvatarEdit");
    const avatarInput = document.getElementById("profileAvatarInput");
    const avatarSmall = document.getElementById("profileAvatarSmall");

    const AVATAR_KEY = "lvs_profile_avatar_dataurl";

    function applyAvatarFromStorage() {
        try {
            const data = window.localStorage.getItem(AVATAR_KEY);
            if (!data) return;

            avatarImg.src = data;
            avatarImg.hidden = false;
        } catch (e) {
            // молча игнорируем
        }
    }

    applyAvatarFromStorage();

    if (avatarEdit && avatarInput && avatarImg) {
        avatarEdit.addEventListener("click", function () {
            avatarInput.click();
        });

        avatarInput.addEventListener("change", function () {
            const file = avatarInput.files && avatarInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (ev) {
                const dataUrl = ev.target.result;
                avatarImg.src = dataUrl;
                avatarImg.hidden = false;

                try {
                    window.localStorage.setItem(AVATAR_KEY, dataUrl);
                } catch (e) {
                    console.warn("Cannot store avatar in localStorage", e);
                }
            };
            reader.readAsDataURL(file);
        });
    }

})();
