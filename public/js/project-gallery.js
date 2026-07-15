import { messageAlert } from "./utils.js";
import { uploadFile, loadStatus } from "./uploader.js";

const uploadForm = document.querySelector("#gallery-upload-form");
const galleryInput = document.querySelector("#galleryImages");
const progressBar = document.querySelector("#progressBar");



/*
|--------------------------------------------------------------------------
| Upload Multiple Images
|--------------------------------------------------------------------------
*/

if (uploadForm) {

    uploadForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (!galleryInput.files.length) {

            return messageAlert(
                "Error",
                "Please select at least one image.",
                false,
                "text-danger",
                "btn-danger"
            );

        }

        loadStatus(true);

        try {

            const formData = new FormData(uploadForm);

            const response = await uploadFile(

                formData,

                progressBar,

                uploadForm.action,

                "POST"

            );

            const result = await response.json();

            if (!response.ok) {

                throw new Error(result.message);

            }

            messageAlert(

                "Success",

                result.message,

                window.location.href,

                "text-success",

                "btn-success"

            );

        } catch (err) {

            messageAlert(

                "Upload Failed",

                err.message,

                false,

                "text-danger",

                "btn-danger"

            );

        }

        loadStatus(false);

    });

}



/*
|--------------------------------------------------------------------------
| Replace Image
|--------------------------------------------------------------------------
*/

document.querySelectorAll(".replaceImage").forEach(button => {

    button.addEventListener("click", () => {

        const id = button.dataset.id;

        document.querySelector(`#replace-${id}`).click();

    });

});



document.querySelectorAll(".replaceInput").forEach(input => {

    input.addEventListener("change", async () => {

        if (!input.files.length) return;

        const id = input.dataset.id;

        const formData = new FormData();

        formData.append("image", input.files[0]);

        loadStatus(true);

        try {

            const response = await uploadFile(

                formData,

                progressBar,

                `/admin/project/image/${id}`,

                "PUT"

            );

            const result = await response.json();

            if (!response.ok) {

                throw new Error(result.message);

            }

            messageAlert(

                "Success",

                result.message,

                window.location.href,

                "text-success",

                "btn-success"

            );

        } catch (err) {

            messageAlert(

                "Replace Failed",

                err.message,

                false,

                "text-danger",

                "btn-danger"

            );

        }

        loadStatus(false);

    });

});



/*
|--------------------------------------------------------------------------
| Delete Image
|--------------------------------------------------------------------------
*/

document.querySelectorAll(".deleteImage").forEach(button => {

    button.addEventListener("click", async () => {

        if (!confirm("Delete this image?")) {

            return;

        }

        const id = button.dataset.id;

        loadStatus(true);

        try {

            const response = await fetch(

                `/admin/project/image/${id}`,

                {

                    method: "DELETE",

                    credentials: "include"

                }

            );

            const result = await response.json();

            if (!response.ok) {

                throw new Error(result.message);

            }

            document
                .querySelector(`#gallery-image-${id}`)
                .remove();

            messageAlert(

                "Deleted",

                result.message,

                false,

                "text-success",

                "btn-success"

            );

        }

        catch (err) {

            messageAlert(

                "Delete Failed",

                err.message,

                false,

                "text-danger",

                "btn-danger"

            );

        }

        loadStatus(false);

    });

});