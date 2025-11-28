// assets/js/profile.js

(function () {
    const STORAGE_KEY = "lvs_profile_v1";

    function $(selector) {
        return document.querySelector(selector);
    }

    function $all(selector) {
        return Array.from(document.querySelectorAll(selector));
    }

    function loadProfile() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return {};
            return JSON.parse(raw);
        } catch (e) {
            console.warn("LVS profile: cannot parse storage", e);
            return {};
        }
    }

    function saveProfile(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn("LVS profile: cannot save", e);
        }
    }

    const state = loadProfile();

    /* === Аватар на всех страницах === */

    function applyAvatar() {
        const imgs = $all(".js-avatar-img");
        if (!imgs.length) return;

        imgs.forEach((img) => {
            const def = img.getAttribute("data-default");
            if (state.avatar) {
                img.src = state.avatar;
            } else if (def) {
                img.src = def;
            }
        });
    }

    function initAvatarUpload() {
        const input = $(".js-avatar-input");
        if (!input) return;

        input.addEventListener("change", function () {
            const file = this.files && this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const dataUrl = e.target.result;
                state.avatar = dataUrl;
                saveProfile(state);
                applyAvatar();
            };
            reader.readAsDataURL(file);
        });
    }

    /* === Поля настроек (settings.html) === */

    function applySettingsToForm() {
        const name = $(".js-field-name");
        const title = $(".js-field-title");
        const locationInput = $(".js-field-location");
        const about = $(".js-field-about");
        const skills = $(".js-field-skills");
        const focus = $(".js-field-focus");
        const email = $(".js-field-email");
        const language = $(".js-field-language");
        const tz = $(".js-field-timezone");
        const publicProfile = $(".js-field-public");
        const emailNotify = $(".js-field-email-notify");

        if (name && state.name) name.value = state.name;
        if (title && state.title) title.value = state.title;
        if (locationInput && state.location) locationInput.value = state.location;
        if (about && state.about) about.value = state.about;
        if (skills && state.skills) skills.value = state.skills;
        if (focus && state.focus) focus.value = state.focus;
        if (email && state.email) email.value = state.email;
        if (language && state.language) language.value = state.language;
        if (tz && state.timezone) tz.value = state.timezone;
        if (publicProfile && typeof state.publicProfile === "boolean")
            publicProfile.checked = state.publicProfile;
        if (emailNotify && typeof state.emailNotify === "boolean")
            emailNotify.checked = state.emailNotify;
    }

    function collectSettingsFromForm() {
        const name = $(".js-field-name");
        const title = $(".js-field-title");
        const locationInput = $(".js-field-location");
        const about = $(".js-field-about");
        const skills = $(".js-field-skills");
        const focus = $(".js-field-focus");
        const email = $(".js-field-email");
        const language = $(".js-field-language");
        const tz = $(".js-field-timezone");
        const publicProfile = $(".js-field-public");
        const emailNotify = $(".js-field-email-notify");

        if (name) state.name = name.value.trim();
        if (title) state.title = title.value.trim();
        if (locationInput) state.location = locationInput.value.trim();
        if (about) state.about = about.value.trim();
        if (skills) state.skills = skills.value.trim();
        if (focus) state.focus = focus.value.trim();
        if (email) state.email = email.value.trim();
        if (language) state.language = language.value;
        if (tz) state.timezone = tz.value;
        if (publicProfile) state.publicProfile = publicProfile.checked;
        if (emailNotify) state.emailNotify = emailNotify.checked;
    }

    function initSettingsButtons() {
        const saveBtn = $(".js-save-settings");
        const resetBtn = $(".js-reset-settings");
        const status = $(".js-settings-status");

        if (saveBtn) {
            saveBtn.addEventListener("click", function () {
                collectSettingsFromForm();
                saveProfile(state);
                applyAvatar();
                if (status) {
                    status.textContent = "Saved locally";
                    setTimeout(() => (status.textContent = ""), 2000);
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                localStorage.removeItem(STORAGE_KEY);
                Object.keys(state).forEach((k) => delete state[k]);
                window.location.reload();
            });
        }
    }

    /* === Применение данных к странице профиля (me.html) === */

    function applyProfileReadOnly() {
        const name = document.querySelector(".js-profile-name");
        const title = document.querySelector(".js-profile-title");
        const locationEl = document.querySelector(".js-profile-location");
        const about = document.querySelector(".js-profile-about");
        const skillsList = document.querySelector(".js-profile-skills");
        const focusList = document.querySelector(".js-profile-focus");

        if (name && state.name) name.textContent = state.name;
        if (title && state.title) title.textContent = state.title;
        if (locationEl && state.location) locationEl.textContent = state.location;
        if (about && state.about) about.textContent = state.about;

        if (skillsList && state.skills) {
            skillsList.textContent = state.skills;
        }
        if (focusList && state.focus) {
            focusList.textContent = state.focus;
        }
    }

    /* === Профиль-меню в шапке === */

    function initProfileMenu() {
        const wrapper = document.querySelector(".lvs-navtop-profile");
        const btn = wrapper && wrapper.querySelector(".lvs-navtop-profile-btn");
        if (!wrapper || !btn) return;

        btn.addEventListener("click", function () {
            wrapper.classList.toggle("lvs-navtop-profile--open");
        });

        document.addEventListener("click", function (e) {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove("lvs-navtop-profile--open");
            }
        });
    }

    /* === init === */

    document.addEventListener("DOMContentLoaded", function () {
        applyAvatar();
        initAvatarUpload();
        applySettingsToForm();
        initSettingsButtons();
        applyProfileReadOnly();
        initProfileMenu();
    });
})();
