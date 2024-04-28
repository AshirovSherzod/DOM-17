const API_URL = "https://dummyjson.com"
const cards = document.querySelector(".cards")
const select = document.querySelector("#select")
const search = document.querySelector(".search")

// apidan malumot olish 
async function getAPI(url) {
    let data = await fetch(`${url}/products?limit=12`, {
        method: "GET"
    })

    data.json()
        .then(res => mapCards(res))
        .catch(err => console.log(err))
}
getAPI(API_URL)

// olingan malumotni card korinishida yoyish
function mapCards(data) {
    let newData = ""
    data.products.forEach(product => {
        newData += `
            <div class="cards__card" data-id="${product.id}">
                <div class="cards__card__img">
                    <img class="card__img" src="${product.images[0]}" alt="">
                </div>
                <div class="cards__card__desc">
                    <h1>${product.title}</h1>
                    <p>$${product.price}</p>
                </div>
                <i class="fa-regular fa-heart"></i>
            </div>
        `
    });
    cards.innerHTML = newData
}


// apidan categoryni olish
async function getCategoryAPI(url) {
    let data = await fetch(`${url}/products/categories`, {
        method: "GET"
    })
    
    data.json()
        .then(res => mapCategory(res))
        .catch(err => console.log(err))
}
getCategoryAPI(API_URL)

// olingan categoryni select tegiga option sifatida qoshish
function mapCategory(data) {
    let newData = `<option value="all">All</option>`
    data.forEach(e => {
        newData += `
            <option value="${e}">${e}</option>
        `
    })

    select.innerHTML = newData
}


// select change bolganida categoryni filterlash uchun 
select.addEventListener("change", e => {
    filterSelect(API_URL,e.target.value)
})


async function filterSelect(url,selectName,searchValue) {
    let api = ""
    if (selectName === "all") {
        if(searchValue) {
            api = `${url}/products/search?q=${searchValue}`
        }
        else {
            api = `${url}/products?limit=12`
        }
    }
    else {
        api = `${url}/products/category/${selectName}?limit=12`
    }

    let data = await fetch(`${api}`, {
        method: "GET"
    })

    data.json()
        .then(res => mapCards(res))
        .catch(err => console.log(err))
}
filterSelect(API_URL, "all")

cards.addEventListener("click", e => {
    if(e.target.className === "card__img")  {
        let id = e.target.closest(".cards__card").dataset.id
        window.open(`./pages/product.html?id=${id}`, "_self")
    }
    else if (e.target.className.includes("fa-heart")) {

        e.target.className = "fa-regular fa-heart"
        addToWishlist(e.target.closest(".cards__card").dataset.id)
    }
    
})


search.addEventListener("keyup", e=>{
    let value = e.target.value.trim()
    if (value) {
        filterSelect(API_URL, "all", value)
        select.value = "all"
    }
})


const addToWishlist = async(id) => {
    let data = await fetch(`${API_URL}/products/${id}`)

    data.json()
        .then(res => {
            let wishList = JSON.parse(localStorage.getItem("wishlist")) || []
            let index = wishList.findIndex(el => el.id === res.id)
            let updatedWishlist = []

            if(index < 0) {
                updatedWishlist = [...wishList, res]
            }
            else {
                updatedWishlist = wishList.filter(el => el.id !== res.id)
            }
            console.log(updatedWishlist);
            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)) 

        })
        .catch(err => console.log(err))
}
