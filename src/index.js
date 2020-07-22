const quotesURL = 'http://localhost:3000/quotes?_embed=likes';
const likesURL = 'http://localhost:3000/likes';
const onlyQuotesURL = 'http://localhost:3000/quotes'

document.addEventListener('DOMContentLoaded', () => {
    getQuotes();
    formSubmitter();
});

function getQuotes(){
    fetch(quotesURL)
    .then(response => response.json())
    .then(json => {
        for(const quote of json){
            createQuote(quote)
        }
    });
};

function createQuote(quote){
    const quoteList = document.getElementById('quote-list');
    const li = document.createElement('li');

    li.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span id="${quote.id}">0</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
    `;

    li.getElementsByClassName('btn-danger')[0].addEventListener('click', () => {
        quoteDeleter(quote);
        quoteList.removeChild(li);
    });

    quoteList.appendChild(li);

    likesFiller(quote);
}

function quoteDeleter(quote){
    fetch(`${onlyQuotesURL}/${quote.id}`, {
        method: 'DELETE',
    })
};

function likesFiller(quote){
    const likes = document.getElementById(`${quote.id}`);

    likes.parentElement.addEventListener('click', () => {
        likePoster(quote);
    });
    
    likes.innerText = quote.likes.length;
};

function likePoster(quote){

    fetch(`${likesURL}`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            "quoteId": quote.id
        })
    })
    .then(response => response.json())
    .then(json => {
        quote.likes.push(json);
        likesFillerAgain(quote)
    })
}

function likesFillerAgain(quote){
    const likes = document.getElementById(`${quote.id}`);
    
    likes.innerText = quote.likes.length;
};

function formSubmitter(){
    const newQuoteForm = document.getElementById('new-quote-form');

    newQuoteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newQuote = document.getElementById("new-quote");
        const newAuthor = document.getElementById("author");

        quotePoster(newQuote.value, newAuthor.value)

        newQuote.value = "",
        newAuthor.value = ""
    });
};

function quotePoster(quote, author){
    fetch(onlyQuotesURL, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            "quote": quote,
            "author": author,
            "likes": []
        })
    })
    .then(response => response.json())
    .then(json => createQuote(json))
}