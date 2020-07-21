document.addEventListener("DOMContentLoaded", () => {
    getQuotes();
    });


function getQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => renderCards(quotes))
}

function renderCards(quotes){
    quotes.forEach(quote => makeSingleCard(quote))
}


function makeSingleCard(quote){
    const quotesList = document.getElementById("quote-list")
        const cardLi = document.createElement("li")
        cardLi.className = "quote-card"
        cardLi.innerHTML = `
            <blockquote class="blockquote" id=${quote.id}>
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
                <button class='edit-btn'>Edit Quote</button>
            </blockquote>
        `

    cardLi.addEventListener("click", (event) => {
        if (event.target.matches("button.btn-success")){
            quote.likes.length++
            cardLi.querySelector("span").innerText = quote.likes.length
            increaseLikes(quote)
        }
        if (event.target.matches("button.btn-danger")){
            cardLi.remove()
        deleteQuote(quote)
        }
        if (event.target.matches("button.edit-btn")){
        editQuoteForm(quote, cardLi)
        }
    })
    quotesList.appendChild(cardLi);
    }

function editQuoteForm(quote, cardLi){
    const editButton = cardLi.querySelector(".edit-btn")
    editButton.classList.add("hidden")
    const blockquote = cardLi.querySelector("blockquote")
    const editForm = document.createElement("form")
    editForm.innerHTML = `
    <br>    
    <h4>Edit this Quote:</h4>
        <h5> Edit Quote:</h5>
        <input
            type="text"
            name="quote"
            value="${quote.quote}"
            class="input-text"
            />
            <br>
            <br>
            <h5>Edit Author:</h5>
            <input
            type="text"
            name="author"
            value="${quote.author}"
            class="input-text"
            />
            <br>
            <br>
            <button id="submit-changes">Submit Changes!</button>
    `
    blockquote.appendChild(editForm)

    editForm.addEventListener("submit", (event) => {
        event.preventDefault()
        handleEditForm(event, quote, cardLi)
        editButton.classList.remove("hidden")
        blockquote.removeChild(editForm)
      })
}

function handleEditForm(event, quote, cardLi){
    const quoteInput = event.target.quote.value
    const authorInput = event.target.author.value
    const likes = quote.likes.length

    const pTag = cardLi.querySelector("p")
    pTag.innerText = quoteInput

    const footer = cardLi.querySelector("footer")
    footer.innerText = authorInput

    const edits = {
        "quote": quoteInput,
        "author": authorInput,
        "likes": likes
    }
    fetch (`http://localhost:3000/quotes/${quote.id}`, {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(
            edits
        )
    })
        .then(response => response.json())
        .then(edits => {
            makeSingleCard(edits)
    })
    
}

function increaseLikes(quote){
    fetch(`http://localhost:3000/likes`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "quoteId": quote.id
        })
    })
}

const quoteForm = document.getElementById("new-quote-form")
quoteForm.addEventListener("submit", (event) => {
    event.preventDefault()
    handleQuoteForm(event)
})

function deleteQuote(quote){
    fetch(`http://localhost:3000/quotes/${quote.id}`,{
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    })
}

function handleQuoteForm(event){
    const quoteInput = event.target.quote.value
    const authorInput = event.target.author.value
    const myQuote = {
        "quote": quoteInput,
        "author": authorInput,
        "likes": []
    }
    fetch('http://localhost:3000/quotes',{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(myQuote)
    })
    .then(response => response.json())
    .then(quote => {
        makeSingleCard(quote)
    })
}


