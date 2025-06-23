export function booksCard(i){return`
    <div class="card position-relative">
    ${i.superprice?`
        <div class="card-price">
            <del id="del">${i.price} usd</del>
        </div>
        <div class="card-superprice">
            ${i.superprice} usd  
        </div>
    `:`
        <div class="card-price">
            ${i.price} usd
        </div>
    `}
                            <a href="/book1/${i.id}" class="a_link_ksiezka">
                                <img style="width: 200px; height: 275px;" src="${i.imageUrl}" class="card-img-top" alt="${i.name}">
                                <div class="card-body d-flex flex-column align-items-center">
                                    <h5 class="card-title
                                    " style="color: rgb(0, 0, 0); font-family: Georgia, 'Times New Roman', Times, serif; font-weight: bold;">${i.name}</h5>
                                    <h6 class="card-author" style="color: rgb(0, 0, 0); font-size: medium; font-family: 'Courier New', Courier, monospace;">${i.author}</h6>
                                    <p class="card-text" style="color: rgb(0, 0, 0); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">${i.description}</p>
                                </div>
                            </a>
                            <div class="wishlist-icon" onclick="bindWishlist(${i.id}, this)"></div>
                        </div>
    `}
