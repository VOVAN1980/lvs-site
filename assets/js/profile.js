// profile.js — общий скрипт для me.html и settings.html

document.addEventListener("DOMContentLoaded", () => {
  initMultiSections();
});

/**
 * Добавление / удаление блоков работы и образования
 */
function initMultiSections() {
  const workList = document.getElementById("workList");
  const eduList = document.getElementById("eduList");

  if (!workList && !eduList) {
    // мы не на settings.html – тихо выходим
    return;
  }

  // Кнопки "Add ..."
  document.querySelectorAll(".lvs-multi-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-add-row");
      if (type === "work" && workList) {
        workList.appendChild(createWorkRow());
      } else if (type === "edu" && eduList) {
        eduList.appendChild(createEduRow());
      }
    });
  });

  // Делегирование на удаление
  document.body.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("lvs-multi-remove")) {
      const row = target.closest(".lvs-multi-row");
      const list = row.parentElement;
      if (list.children.length > 1) {
        row.remove();
      }
    }
  });
}

function createWorkRow() {
  const row = document.createElement("div");
  row.className = "lvs-multi-row";
  row.innerHTML = `
    <div class="lvs-grid lvs-grid--3">
      <input class="lvs-input" type="text" placeholder="Company">
      <input class="lvs-input" type="text" placeholder="Position">
      <input class="lvs-input" type="text" placeholder="Period (YYYY–YYYY / now)">
    </div>
    <textarea class="lvs-input lvs-input--multiline" rows="2"
      placeholder="Responsibilities, key achievements"></textarea>
    <button type="button" class="lvs-multi-remove" title="Remove job">Remove</button>
  `;
  return row;
}

function createEduRow() {
  const row = document.createElement("div");
  row.className = "lvs-multi-row";
  row.innerHTML = `
    <div class="lvs-grid lvs-grid--3">
      <input class="lvs-input" type="text" placeholder="Institution">
      <input class="lvs-input" type="text" placeholder="Degree / program">
      <input class="lvs-input" type="text" placeholder="Year of graduation">
    </div>
    <textarea class="lvs-input lvs-input--multiline" rows="2"
      placeholder="Details: faculty, specialization, etc."></textarea>
    <button type="button" class="lvs-multi-remove" title="Remove education">Remove</button>
  `;
  return row;
}
