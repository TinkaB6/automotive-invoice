document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  document.querySelectorAll('.ribbon-tabs button').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.ribbon-tabs button').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      let group = tabBtn.dataset.tab;
      document.querySelectorAll('.ribbon-actions-group').forEach(g => {
        if(g.dataset.group === group) g.classList.add('active');
        else g.classList.remove('active');
      });
    });
  });

  // Show placeholder workspace on sub-action click
  document.querySelectorAll('.ribbon-btn').forEach(actionBtn => {
    actionBtn.addEventListener('click', () => {
      const action = actionBtn.dataset.action;
      const label = actionBtn.textContent.trim();
      const workspace = document.getElementById('workspace');
      if(workspace) {
        workspace.innerHTML = `
          <h2>${label}</h2>
          <p>Function: <code>${action}</code></p>
          <div style="margin-top:1.5em;color:#777;">
            This is a placeholder for <b>${label}</b>.<br>
            Replace this with the actual form, table, or component.
          </div>
        `;
      }
    });
  });
});
