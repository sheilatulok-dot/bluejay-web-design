(() => {
  const modal = document.getElementById("toolInfoModal");

  if (!modal) return;

  const title = document.getElementById("toolInfoTitle");
  const purpose = document.getElementById("toolInfoPurpose");
  const benefit = document.getElementById("toolInfoBenefit");
  const icon = document.getElementById("toolInfoIcon");

  modal.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;

    if (!(trigger instanceof HTMLElement)) return;

    const name = trigger.dataset.toolName || "Web design tool";

    title.textContent = name;
    purpose.textContent = trigger.dataset.toolPurpose || "";
    benefit.textContent = trigger.dataset.toolBenefit || "";
    icon.src = trigger.dataset.toolIcon || "";
    icon.alt = `${name} logo`;
  });
})();
