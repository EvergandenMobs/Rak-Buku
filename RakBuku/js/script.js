const books = [];
const RENDER_EVENT = "render-books";

let addBuku = document.getElementById("tambahBuku");
let formBuku = document.getElementById("formTambahBuku");

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("input_buku");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahDataBuku();
  });
});

addBuku.addEventListener("click", form_tambah_ubah);

function form_tambah_ubah(bookItem) {
  const overlay = document.getElementById("overlay");
  if (addBuku.checked == true) {
    formBuku.classList.add("reveal");
    overlay.classList.add("active");
  } else {
    formBuku.classList.remove("reveal");
    cleanForm();
  }
}

function cleanForm() {
  let judul = document.getElementById("title");
  judul.value = "";
  let pengarang = document.getElementById("author");
  pengarang.value = "";
  let tahun = document.getElementById("year");
  tahun.value = "";
  let checkbook = document.getElementById("isCompleted");
  checkbook.checked = false;
  const submitForm = document.getElementById("input_buku");
  submitForm.style.display = "block";
  const ubahForm = document.getElementById("form_ubah");
  let form_id = document.getElementById("book_id");
  if (form_id != null) {
    form_id.remove();
  }
  const form_title = document.getElementById("form_title");
  form_title.innerText = "Masukan Buku Baru";
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("active");
}

function generateId() {
  return +new Date();
}

function tambahDataBuku() {
  const book_id = document.getElementById("book_id");
  if (book_id != null) {
    const title = document.getElementById("title").value;
    const year_value = document.getElementById("year").value;
    const year = parseInt(year_value);
    const author = document.getElementById("author").value;
    const check_book = document.getElementById("isCompleted");
    if (check_book.checked == true) {
      isCompleted = check_book.value = true;
    } else {
      isCompleted = check_book.value = false;
    }

    let generatedID = book_id.value;
    let id_to_number = parseInt(generatedID);
    let bookTarget = findBook(id_to_number);

    bookTarget.title = title;
    bookTarget.year = year;
    bookTarget.author = author;
    bookTarget.isCompleted = isCompleted;
    addBuku.checked = false;
    form_tambah_ubah();

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } else {
    const title = document.getElementById("title").value;
    const year_value = document.getElementById("year").value;
    const year = parseInt(year_value);
    const author = document.getElementById("author").value;
    const check_book = document.getElementById("isCompleted");
    if (check_book.checked == true) {
      isCompleted = check_book.value = true;
    } else {
      isCompleted = check_book.value = false;
    }

    const generatedID = generateId();
    const objectBuku = generateBooksObject(
      generatedID,
      title,
      year,
      author,
      isCompleted
    );
    books.push(objectBuku);

    addBuku.checked = false;
    form_tambah_ubah();

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  console.log(books);
}

function generateBooksObject(id, title, year, author, isCompleted) {
  return {
    id,
    title,
    year,
    author,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const bookList = document.getElementById("bookList");
  const bookListCompleted = document.getElementById("bookListCompleted");
  bookList.innerHTML = "";
  bookListCompleted.innerHTML = "";

  for (const bookItem of books) {
    bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      bookList.append(bookElement);
    } else {
      bookListCompleted.append(bookElement);
    }
  }
});

function makeBook(bookItem) {
  const konten = document.createElement("div");
  konten.classList.add("konten");
  konten.classList.add("listBook");

  const konten_child = document.createElement("div");
  konten_child.classList.add("konten_child");

  const judul_buku = document.createElement("h1");
  judul_buku.innerText = bookItem.title;

  const tahun_buku = document.createElement("small");
  tahun_buku.innerText = bookItem.year;

  const pengarang_buku = document.createElement("h2");
  pengarang_buku.innerText = bookItem.author;

  const completed = document.createElement("div");
  const textCompleted = document.createElement("i");
  if (bookItem.isCompleted == true) {
    completed.classList.add("sudah");
    textCompleted.innerText = "Selesai Dibaca";
  } else {
    completed.classList.add("belum");
    textCompleted.innerText = "Belum Dibaca";
  }
  completed.append(textCompleted);

  const option = document.createElement("i");
  option.classList.add("fa-solid", "fa-gear");
  option.addEventListener("click", function () {
    ubahDataBuku(bookItem.id);
  });

  const opsi_hapus = document.createElement("i");
  opsi_hapus.classList.add("fa-solid", "fa-trash-can");
  opsi_hapus.addEventListener("click", function () {
    confirm(bookItem.id);
  });

  const opsi_tanda_baca = document.createElement("div");
  opsi_tanda_baca.classList.add("option_tanda_dibaca");

  if (bookItem.isCompleted == true) {
    opsi_tanda_baca.addEventListener("click", function () {
      belumDibaca(bookItem.id);
    });
    const icon_tanda_dibaca = document.createElement("i");
    icon_tanda_dibaca.classList.add("fa-solid", "fa-rectangle-xmark");
    icon_tanda_dibaca.style.color = "#FFB800";
    const label_tanda_dibaca = document.createElement("i");
    label_tanda_dibaca.innerText = "Tandai belum Dibaca";
    label_tanda_dibaca.style.color = "#FFB800";
    opsi_tanda_baca.append(icon_tanda_dibaca, label_tanda_dibaca);
  } else {
    opsi_tanda_baca.addEventListener("click", function () {
      sudahDibaca(bookItem.id);
    });

    const icon_tanda_dibaca = document.createElement("i");
    icon_tanda_dibaca.classList.add("fa-solid", "fa-square-check");
    icon_tanda_dibaca.style.color = "#70FF00";
    const label_tanda_dibaca = document.createElement("i");
    label_tanda_dibaca.innerText = "Tandai Sudah Dibaca";
    label_tanda_dibaca.style.color = "#70FF00";
    opsi_tanda_baca.append(icon_tanda_dibaca, label_tanda_dibaca);
  }

  konten_child.append(judul_buku, tahun_buku, pengarang_buku, completed);
  konten.append(konten_child, option, opsi_hapus, opsi_tanda_baca);

  return konten;
}

function confirm(bookId) {
  let confirmasi = document.getElementById("confirm");
  confirmasi.classList.add("confirm_ask");
  const bookItem = findBook(bookId);
  const Judul_delete = document.getElementById("Judul_delete");
  Judul_delete.innerText = bookItem.title;
  let hapus = document
    .getElementById("hapus")
    .addEventListener("click", function () {
      deleteBuku(bookItem.id);
    });

  let kembali = document
    .getElementById("kembali")
    .addEventListener("click", function () {
      confirmasi.classList.remove("confirm_ask");
    });
}

function ubahDataBuku(bookId) {
  const booktarget = findBook(bookId);
  formBuku.classList.add("reveal");
  const submitForm = document.getElementById("input_buku");
  addBuku.checked = true;
  let judul = document.getElementById("title");
  judul.value = booktarget.title;
  let pengarang = document.getElementById("author");
  pengarang.value = booktarget.author;
  let tahun = document.getElementById("year");
  tahun.value = booktarget.year;
  let checkbook = document.getElementById("isCompleted");
  checkbook.checked = booktarget.isCompleted;
  const book_id = document.createElement("input");
  book_id.style.color = "white";
  book_id.style.border = "none";
  book_id.setAttribute("id", "book_id");
  book_id.setAttribute("type", "number");
  book_id.value = booktarget.id;
  formBuku.append(book_id);
  const form_title = document.getElementById("form_title");
  form_title.innerText = "Ubah Data Buku";
  const overlay = document.getElementById("overlay");
  overlay.classList.add("active");
}

function deleteBuku(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);

  let confirmasi = document.getElementById("confirm");
  confirmasi.classList.remove("confirm_ask");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function belumDibaca(bookId) {
  console.log("ubah" + bookId + "ke Sudah Dibaca");
  const booktarget = findBook(bookId);
  console.log(booktarget);
  booktarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function sudahDibaca(bookId) {
  console.log("ubah" + bookId + "ke belum Dibaca");
  const booktarget = findBook(bookId);
  booktarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

document.getElementById("searchBar").addEventListener("input", liveSearch);
function liveSearch() {
  const search_input = document.getElementById("searchBar");
  const filter = search_input.value.toLowerCase();
  const book_Item = document.querySelectorAll(".listBook");

  book_Item.forEach((item) => {
    let text = item.textContent;
    if (text.toLowerCase().includes(filter.toLowerCase())) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const bookItem of data) {
      books.push(bookItem);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

if (isStorageExist()) {
  loadDataFromStorage();
}
