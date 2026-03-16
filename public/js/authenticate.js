(function () {
  'use strict';

  const roleButtons = document.querySelectorAll('.role-btn');
  const roleHeading = document.getElementById('roleHeading');
  const form = document.getElementById('authForm');
  const btn = document.getElementById('btn');
  const toggleLink = document.getElementById('toggleForm'); // Only exists on login page
  let currentRole = roleButtons?.[0]?.dataset.role || null;

  // Role toggle
  roleButtons?.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentRole = btn.dataset.role;
      roleHeading.textContent = capitalize(currentRole);
      updateFormAction();
    });
  });

  function updateFormAction() {
    if (!form) return;
    const isRegister = form.action.includes('register');
    form.action = `/auth/${currentRole}/${isRegister ? 'register' : 'login'}`;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  updateFormAction();

  // Form submission
  form?.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const status = form.querySelector('#status');
    const displayError = form.querySelector('#error');

    status?.classList.remove('d-none');
    btn?.classList.add('disabled');
    if (displayError) displayError.innerHTML = "";

    const formDataObj = JSON.stringify(Object.fromEntries(new FormData(form)));

    try {
      const response = await sendRequest(formDataObj, form.action);
      const result = await response.json();

      if (response.ok) {
        const redirectTo = result.redirectTo || '/';
        messageAlert("Success", result.message, redirectTo, "text-success", "btn-success");
      } else {
        if (result.errors) {
          result.errors.forEach(err => displayError?.insertAdjacentHTML('beforeend', `<li>${err.msg}</li>`));
        } else {
          displayError?.insertAdjacentHTML('beforeend', `<li>${result.message}</li>`);
        }
      }
    } catch (error) {
      displayError?.insertAdjacentHTML('beforeend', `<li>Network or server error: ${error.message}</li>`);
    } finally {
      status?.classList.add('d-none');
      btn?.classList.remove('disabled');
    }

    form.classList.add('was-validated');
  });

})();

async function sendRequest(data, url) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });

  return {
    ok: response.ok,
    status: response.status,
    json: () => response.json()
  };
}
