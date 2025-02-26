export function booksCard(book) {
    return `
    <div class="card position-relative">
    ${book.superprice ? `
        <div class="card-price">
            <del id="del">${book.price} usd</del>
        </div>
        <div class="card-superprice">
            ${book.superprice} usd  
        </div>
    ` : `
        <div class="card-price">
            ${book.price} usd
        </div>
    `}
                            <a href="/book1/${book.id}" class="a_link_ksiezka">
                                <img style="width: 200px; height: 275px;" src="${book.imageUrl}" class="card-img-top" alt="${book.name}">
                                <div class="card-body d-flex flex-column align-items-center">
                                    <h5 class="card-title
                                    " style="color: rgb(0, 0, 0); font-family: Georgia, 'Times New Roman', Times, serif; font-weight: bold;">${book.name}</h5>
                                    <h6 class="card-author" style="color: rgb(0, 0, 0); font-size: medium; font-family: 'Courier New', Courier, monospace;">${book.author}</h6>
                                    <p class="card-text" style="color: rgb(0, 0, 0); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">${book.description}</p>
                                </div>
                            </a>
                            <div class="wishlist-icon" onclick="addToWishlist(${book.id}, this)"></div>
                        </div>
    `;
}