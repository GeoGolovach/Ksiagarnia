export function booksCard(book, wishlistSet = new Set()) {
  const isInWishlist = wishlistSet.has(book.id);
    return `
    <div class="card position-relative" data-book-id="${book.id}">
      ${book.superprice 
        ? `<div class="card-price"><del>${book.price} usd</del></div>
           <div class="card-superprice">${book.superprice} usd</div>`
        : `<div class="card-price">${book.price} usd</div>`}

      <a href="/book1/${book.id}" class="a_link_ksiezka">
        <img style="width:200px; height:275px" src="${book.imageUrl}" class="card-img-top" alt="${book.name}">
        <div class="card-body d-flex flex-column align-items-center">
          <h5 class="card-title">${book.name}</h5>
          <h6 class="card-author">${book.author}</h6>
          <p class="card-text">${book.description}</p>
        </div>
      </a>
      <div class="wishlist-icon ${isInWishlist ? 'active' : ''}" data-book-id="${book.id}"></div>
    </div>
  `;
    
}