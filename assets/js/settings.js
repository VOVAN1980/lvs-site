// Avatar preview + простой дропдаун в шапке
(function () {
    var input = document.getElementById("settings-avatar-input");
    var img = document.getElementById("settings-avatar-image");

    if (input && img) {
        input.addEventListener("change", function () {
            var file = input.files && input.files[0];
            if (!file || !file.type.startsWith("image/")) return;

            var reader = new FileReader();
            reader.onload = function (e) {
                img.src = String(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    // профильный дропдаун
    var menu = document.querySelector(".lvs-profile-menu");
    if (!menu) return;

    var trigger = menu.querySelector(".lvs-profile-menu__trigger");
    trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        menu.classList.toggle("lvs-profile-menu--open");
    });

    document.addEventListener("click", function (e) {
        if (!menu.contains(e.target)) {
            menu.classList.remove("lvs-profile-menu--open");
        }
    });
})();
