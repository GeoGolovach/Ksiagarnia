document.getElementById("addBookForm").addEventListener("submit",function(o){console.log("\u0424\u043E\u0440\u043C\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430!"),o.preventDefault();const t=new FormData(this),n={name:t.get("name"),author:t.get("author"),description:t.get("description"),imageUrl:t.get("imageUrl"),link:t.get("link")};console.log(n),fetch("/add-book",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then(e=>e.json()).then(e=>{console.log("\u0423\u0441\u043F\u0435\u0445:",e)}).catch(e=>{console.error("\u041E\u0448\u0438\u0431\u043A\u0430:",e)})}),document.getElementById("deleteBookForm").addEventListener("submit",function(o){o.preventDefault();const t=new FormData(this),n={name:t.get("name"),author:t.get("author")};fetch("/delete-book",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then(e=>e.json()).then(e=>{console.log("\u0423\u0441\u043F\u0435\u0445:",e),this.reset()}).catch(e=>{console.error("\u041E\u0448\u0438\u0431\u043A\u0430:",e)})}),$(document).ready(function(){$("#booksSection").hide(),$("#usersSection").hide(),$("#showBooks").click(function(){$("#usersSection").hide(),$("#booksSection").show(),$.get("/admin/books",function(o){$("#booksList").empty(),o.forEach(t=>{$("#booksList").append(`
                    <tr>
                        <td>${t.id}</td>
                        <td>${t.name}</td>
                        <td>${t.author}</td>
                        <td><button class="btn btn-danger deleteBook" data-name="${t.name}" data-author="${t.author}">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button></td>
                    </tr>
                `)})})}),$("#showUsers").click(function(){$("#booksSection").hide(),$("#usersSection").show(),$.get("/admin/users",function(o){$("#usersList").empty(),o.forEach(t=>{$("#usersList").append(`
                    <tr>
                        <td>${t.id}</td>
                        <td>${t.name} ${t.lastName}</td>
                        <td>${t.email}</td>
                        <td>${t.isAdmin?"\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440":"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C"}</td>
                    </tr>
                `)})})})});
