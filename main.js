const myLibrary = [];


function populateLibrary() {
    let book;
    book = new Book("The Hobbit", "J.R.R. Tolkien", 300, true);
    myLibrary.push(book);
    book = new Book("Just Mercy", "Bryan Stevenson", 456, true);
    myLibrary.push(book);
    book = new Book("Pride and Prejudice", "Jane Austen", 345, false);
    myLibrary.push(book);
    book = new Book("The Hitchhiker's Guide to the Galaxy", "Douglas Adams", 159, true);
    myLibrary.push(book);
    book = new Book("Miss Peregrine's Home for Peculiar Children", "Ransom Riggs and Jesse Bernstein", 352, false);
    myLibrary.push(book);
}

function Book(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
    this.isReadMessage = function () {
        if (this.haveRead) {
            return "Has been read";
        } else {
            return "Has not been read";
        }
    }
    this.info = function () {
        console.log(`${this.title} by ${this.author}, ${this.pages} pages, ${this.isReadMessage()}\n`);
    };
}

function addBookToLibrary() {
    let title, author, pages, haveRead;
    title = document.querySelector('#title').value;
    author = document.querySelector('#author').value;
    pages = document.querySelector('#pages').value;
    haveRead = document.querySelector('#haveRead').checked;
    book = new Book(title, author, pages, haveRead);
    myLibrary.push(book);
}

function editBookInLibrary(id) {
    console.log(`Editing book #${id}`);
    let title, author, pages, haveRead;
    title = document.querySelector('#title').value;
    author = document.querySelector('#author').value;
    pages = document.querySelector('#pages').value;
    haveRead = document.querySelector('#haveRead').checked;
    myLibrary[id].title = title;
    myLibrary[id].author = author;
    myLibrary[id].pages = pages;
    myLibrary[id].haveRead = haveRead;
}

/**
 * 
 * @param {string} bookID contains a string of the form "book-#", where # is an integer
 * 
 * This function searches the library for the book and removes it from the array.
 */
function deleteBookFromLibrary(id) {
    console.log(`Removing book ID#${id}`);
    myLibrary.splice(id, 1);
}

function refreshBookDisplay() {
    const display = document.querySelector("#bookDisplay");
    display.replaceChildren();  // Clear existing content

    myLibrary.forEach((book, index) => {
        const bookDiv = createBookElement(book, index);
        display.appendChild(bookDiv);
    });
}

function createBookElement(book, index) {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    bookDiv.id = `book-${index}`;

    bookDiv.appendChild(createBookDetail("bookTitle", book.title));
    bookDiv.appendChild(createBookDetail("bookAuthor", book.author));
    bookDiv.appendChild(createBookDetail("bookPages", `${book.pages} pages`));
    bookDiv.appendChild(createReadStatusToggle(book, index));
    bookDiv.appendChild(createActionButtons(index));

    return bookDiv;
}

function createBookDetail(className, textContent) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.textContent = textContent;
    return div;
}

function createReadStatusToggle(book, index) {
    const toggleOnURL = "images/toggle-switch.png";
    const toggleOffURL = "images/toggle-switch-off.png";

    const div = document.createElement("div");
    div.classList.add("bookReadStatus");

    const span = document.createElement("span");
    span.id = `read-${index}`;
    span.textContent = book.haveRead ? "Read" : "Not Read";

    const img = document.createElement("img");
    img.classList.add("toggle");
    img.id = `toggle-${index}`;
    img.src = book.haveRead ? toggleOnURL : toggleOffURL;
    
    img.addEventListener("click", () => toggleReadStatus(index, img, span));

    div.appendChild(span);
    div.appendChild(img);
    return div;
}

function toggleReadStatus(index, img, span) {
    const toggleOnURL = "images/toggle-switch.png";
    const toggleOffURL = "images/toggle-switch-off.png";

    myLibrary[index].haveRead = !myLibrary[index].haveRead;
    img.src = myLibrary[index].haveRead ? toggleOnURL : toggleOffURL;
    span.textContent = myLibrary[index].haveRead ? "Read" : "Not Read";
}

function createActionButtons(index) {
    const div = document.createElement("div");
    div.classList.add("action-images");

    div.appendChild(createActionButton("images/pencil.png", "Edit book", () => openEditDialog(index)));
    div.appendChild(createActionButton("images/trash-can-outline.png", "Delete book", () => deleteBook(index)));

    return div;
}

function createActionButton(imgSrc, title, onClick) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = title;
    img.title = title;
    img.addEventListener("click", onClick);
    return img;
}

function openEditDialog(index) {
    const dialog = document.querySelector("dialog");
    dialog.setAttribute("data-dialog-type", "edit");
    dialog.setAttribute("data-dialog-book-id", index);

    document.querySelector("#title").value = myLibrary[index].title;
    document.querySelector("#author").value = myLibrary[index].author;
    document.querySelector("#pages").value = myLibrary[index].pages;
    document.querySelector("#haveRead").checked = myLibrary[index].haveRead;

    dialog.showModal();
}

function deleteBook(index) {
    deleteBookFromLibrary(index);
    refreshBookDisplay();
}


function clearDialog() {
    document.querySelector('#title').value = "";
    document.querySelector('#author').value = "";
    document.querySelector('#pages').value = "";
    document.querySelector('#haveRead').checked = false;  
    dialog.setAttribute("data-dialog-bookid", "");  
}


const dialog = document.querySelector("dialog");
dialog.setAttribute("data-dialog-type", "add");
const saveButton = document.querySelector("dialog button#save");
const cancelButton = document.querySelector("dialog button#cancel");

const addBookButton = document.querySelector("#addBook");

cancelButton.addEventListener("click", () => {
    dialog.close();
    clearDialog();
    console.log("Closed");
});

saveButton.addEventListener("click", () => {
    dialog.close();
    if (dialog.getAttribute("data-dialog-type") == "add") {
        addBookToLibrary();
    } else if (dialog.getAttribute("data-dialog-type") == "edit") {
        editBookInLibrary(dialog.getAttribute("data-dialog-book-id"));
    }
    refreshBookDisplay();
    clearDialog();
    console.log("Saved\n");
} );

addBookButton.addEventListener("click", () => {
    dialog.setAttribute("data-dialog-type", "add");
    dialog.showModal();
});

populateLibrary();
refreshBookDisplay();