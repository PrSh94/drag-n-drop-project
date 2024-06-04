document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  const MAX_IMAGES = 5;


  

  // Dropzone functionality
  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragover");
    const files = event.dataTransfer.files;
    handleFiles(files);
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    handleFiles(files);
  });



  // Function to handle file upload
  function handleFiles(files) {
    for (const file of files) {
      if (fileList.children.length >= MAX_IMAGES) {
        alert("You can upload a maximum of 5 images.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload only images.");
        continue;
      }
      if (file.size > 1024 * 1024) {
        alert("File size exceeds 1 MB limit.");
        continue;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        const image = { src: e.target.result, description: "" };
        displayFile(image, file.name);
        saveToLocalStorage(image);
      };
      reader.readAsDataURL(file);
    }
  }



  // Function to display uploaded file
  function displayFile(image, fileName) {
    const div = document.createElement("div");
    div.className = "file-name";

    const img = document.createElement("img");
    img.src = image.src;
    img.className = "thumbnail";
    img.alt = fileName;
    div.appendChild(img);

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Enter description...";
    textarea.addEventListener("input", () => {
      image.description = textarea.value;
      saveToLocalStorage(image);
    });
    div.appendChild(textarea);

    const checkIcon = document.createElement("span");
    checkIcon.classList.add("icons");
    checkIcon.innerHTML = "&#10003;";
    checkIcon.addEventListener("click", () => {
      alert("Description has been added.");
      textarea.disabled = true;
    });
    div.appendChild(checkIcon);

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("icons");
    deleteIcon.innerHTML = "&#10007;";
    deleteIcon.addEventListener("click", () => {
      div.remove();
      removeFromLocalStorage(image);
    });
    div.appendChild(deleteIcon);

    fileList.appendChild(div);
  }

  
  // Function to save data to local storage
  function saveToLocalStorage(image) {
    let storedImagesData = JSON.parse(localStorage.getItem("storedImagesData") || "[]");
    const index = storedImagesData.findIndex(item => item.src === image.src);
    if (index !== -1) {
      storedImagesData[index] = image;
    } else {
      storedImagesData.push(image);
    }
    localStorage.setItem("storedImagesData", JSON.stringify(storedImagesData));
  }

  // Function to remove data from local storage
  function removeFromLocalStorage(image) {
    let storedImagesData = JSON.parse(localStorage.getItem("storedImagesData") || "[]");
    const index = storedImagesData.findIndex(item => item.src === image.src);
    if (index !== -1) {
      storedImagesData.splice(index, 1);
      localStorage.setItem("storedImagesData", JSON.stringify(storedImagesData));
    }
  }

  // Function to load data from local storage
  function loadFromLocalStorage() {
    const storedImagesData = JSON.parse(localStorage.getItem("storedImagesData") || "[]");
    console.log("Loaded from localStorage:", storedImagesData);
    storedImagesData.forEach((data) => {
      displayFile(data, "");
    });
  }

  // Load data from local storage when the page loads
  loadFromLocalStorage();
});
