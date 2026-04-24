import { messageAlert } from './utils.js';

(function () {
    'use strict';

    console.log('form handler loaded');

    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach((form) => {
        form.addEventListener('submit', handleSubmit, false);
    });

    // Clear field error on input
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('form-control')) {
            e.target.classList.remove('is-invalid');
        }
    });

})();


// ================================
// 🚀 MAIN SUBMIT HANDLER
// ================================
async function handleSubmit(event) {
    const form = event.target;

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    toggleLoading(true);

    try {
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        const method = form.id === "update-form" ? "PUT" : "POST";
        const url = form.action;

        const response = await sendRequest(url, method, payload);
        const result = await response.json();

        if (response.ok) {
            clearValidationErrors(form);

            messageAlert(
                "Success",
                result.message,
                result.redirectTo,
                "text-success",
                "btn-success"
            );
        } else {
            handleErrorResponse(result, form);
        }

    } catch (error) {
        messageAlert(
            "Request Failed",
            error.message,
            false,
            "text-danger",
            "btn-danger"
        );
    } finally {
        toggleLoading(false);
    }
}


// ================================
// 🌐 API REQUEST HANDLER
// ================================
async function sendRequest(url, method, data) {
    return fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}


// ================================
// ❌ ERROR HANDLER
// ================================
function handleErrorResponse(result, form) {

    // Handle validation errors (Zod)
    if (result.errors) {
        displayValidationErrors(result.errors, form);

        messageAlert(
            "Validation Error",
            result.message || "Please fix the highlighted fields",
            false,
            "text-danger",
            "btn-danger"
        );

        return;
    }

    // General error
    messageAlert(
        "Form submission failed",
        result.message || "Something went wrong",
        false,
        "text-danger",
        "btn-danger"
    );
}


// ================================
// 🧼 DISPLAY VALIDATION ERRORS
// ================================
function displayValidationErrors(errors, form) {
    const errorList = form.querySelector('#error');

    // Clear previous UI state
    clearValidationErrors(form);

    if (errorList) errorList.innerHTML = "";

    Object.entries(errors).forEach(([field, message]) => {
        const input = form.querySelector(`[name="${field}"]`);

        // Highlight field
        if (input) {
            input.classList.add('is-invalid');

            const feedback = input.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = message;
            }
        }

        // Append to error list
        if (errorList) {
            const li = document.createElement('li');
            li.textContent = message;
            errorList.appendChild(li);
        }
    });

    // Focus first invalid field
    const firstError = form.querySelector('.is-invalid');
    if (firstError) firstError.focus();
}


// ================================
// 🧹 CLEAR ERRORS
// ================================
function clearValidationErrors(form) {
    form.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-invalid');
    });

    const errorList = form.querySelector('#error');
    if (errorList) errorList.innerHTML = "";
}


// ================================
// ⏳ LOADING STATE
// ================================
function toggleLoading(isLoading) {
    const statusEls = document.getElementsByClassName('status');
    const btn = document.getElementById('btn');
    const deleteBtn = document.getElementById('delete');

    if (isLoading) {
        btn?.classList.add('disabled');
        deleteBtn?.classList.add('disabled');

        for (let el of statusEls) {
            el.classList.remove('d-none');
        }

    } else {
        btn?.classList.remove('disabled');
        deleteBtn?.classList.remove('disabled');

        for (let el of statusEls) {
            el.classList.add('d-none');
        }
    }
}