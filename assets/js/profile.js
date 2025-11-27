(function () {
    const root = document.querySelector(".profile-root");
    if (!root) return;

    // ───── Выпадающее меню пользователя ─────
    const trigger = root.querySelector(".profile-user-trigger");
    const dropdown = root.querySelector(".profile-user-dropdown");

    if (trigger && dropdown) {
        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdown.classList.toggle("is-open");
        });

        document.addEventListener("click", function (e) {
            if (!dropdown.classList.contains("is-open")) return;
            if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
                dropdown.classList.remove("is-open");
            }
        });
    }

    // ───── Аватар: загрузка + localStorage ─────
    const avatar = root.querySelector(".profile-avatar-image");
    const editBtn = root.querySelector(".profile-avatar-edit");
    const input = root.querySelector("#profile-avatar-input");

    if (avatar && editBtn && input) {
        // восстановление сохранённого аватара
        const saved = localStorage.getItem("lvsProfileAvatar");
        if (saved) {
            avatar.style.backgroundImage = "url(" + saved + ")";
        }

        editBtn.addEventListener("click", function () {
            input.click();
        });

        input.addEventListener("change", function () {
            const file = this.files && this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (ev) {
                const dataUrl = ev.target.result;
                avatar.style.backgroundImage = "url(" + dataUrl + ")";
                try {
                    localStorage.setItem("lvsProfileAvatar", dataUrl);
                } catch (e) {
                    console.warn("Не удалось сохранить аватар в localStorage", e);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // ───── "Выход" (пока прототип) ─────
    const logoutBtn = root.querySelector('[data-action="logout"]');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            // Здесь потом можно будет повесить реальный logout.
            alert("Здесь будет реальный выход из аккаунта. Пока это прототип интерфейса.");
            window.location.href = "index.html";
        });
    }
})();
