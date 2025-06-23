export function ordersCard(e,i){return`
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                ${e.superprice?`
                                    <div class="card-price">
                                        <del id="del">${e.price} usd</del>
                                    </div>
                                    <div class="card-superprice">
                                        ${e.superprice} usd  
                                    </div>
                                `:`
                                    <div class="card-price">
                                        ${e.price} usd
                                    </div>
                                `}
                                    <button class="delete-btn-${i}" data-id="${e.id}" type="button">Delete</button>
                                    <a href="/book1/${e.id}" class="a_link_ksiezka">
                                        <img style="width: 200px; height: 275px;" src="${e.imageUrl}" class="card-img-top" alt="${e.name}">
                                        <div class="card-body d-flex flex-column align-items-center">
                                            <h5 class="card-title" style="color: rgb(0, 0, 0); font-family: Georgia, 'Times New Roman', Times, serif; font-weight: bold;">${e.name}</h5>
                                            <h6 class="card-author" style="color: rgb(0, 0, 0); font-size:medium; font-family: 'Courier New', Courier, monospace;">${e.author}</h6>
                                            <p class="card-text" style="color: rgb(0, 0, 0); font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">${e.description}</p>
                                            </div>
                                    </a>
                                </div>                              
                            </div>
                        `}
