//  Html Değişkenleri

const btns = document.querySelectorAll("button");
const productWrapper = document.querySelector(".product-wrapper");

// Apiden gelen datayı dışarıda kullanmak için tanımladığımız değişken

let data;

// Apiden gelen verileri çeken fonksiyon

const getApi = async () => {
  // try catch kullanarak apiden gelen verinin doğru olup olmadığına bakıyoruz. Bir sıkıntı yoksa try bloğu, sıkıntı varsa catch bloğu çalışacak.

  try {
    // fetch metodu ile api'ye bağlanıyoruz.

    const res = await fetch(".././file/db.json");

    // apiden gelen veri doğru değilse throw ile bir hata fırlatıyoruz .

    if (!res.ok) {
      throw new Error("not found url");
    }

    // apiden gelen veri doğruysa datayı jsona çevirip return ile dışarı çıkartıyoruz.

    const data = await res.json();
    return data;
  } catch (error) {
    // try bloğu çalışmazsa bu blok çalışacak.
    const menuList = document.querySelector(".menu-list");

    // 404 hatasını ekrana getiren kod.
    menuList.innerHTML = `<img src="./images/notfound.jpg" alt="not-found" class="not-found"/>`;
    console.log(error, "fetch");
  }
};

// Sayfa yüklendiğinde ne yapılması gerektiğine dair fonksiyon

window.addEventListener("DOMContentLoaded", async function (e) {
  // dışarıda tanımladığımız değişken ile apiyi bu değişkene eşitledik.

  data = await getApi();

  // e.target.location.pathname ile sayfanın hangi sayfada olduğunu öğreniyoruz.

  const pathname = e.target.location.pathname;
  // console.log(pathname);
  // eğer sayfa index.html de ise if bloğu, değilse else bloğu çalışacak.

  if (pathname == "/index.html" || "/") {
    // tüm dataları ekrana yazdıran fonksiyon

    setTimeout(() => {
      displayData(data.menu);
    }, 1000);
    const menuList = document.querySelector(".menu-list");

    menuList.innerHTML = `<i class="fa-solid fa-spinner" id="spinner"></i>`;
  } else {
    // eğer sayfa index.html değilse id parametresi ile ürünü ekrana yazdıran fonksiyon. Tabi burada da try catch kullanarak data içindeki menulere ait idlerin dışında bir id girilirse diye kontrol sağlıyoruz.

    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      displayProduct(id, data.menu);
    } catch (error) {
      const productPathTitle = document.querySelector(".path-title");

      // herhangi bir error durumunda sayfanın contentini güncelleyen kod .
      productPathTitle.textContent = "";
      productWrapper.innerHTML = `
          <img src="./images/notfound.jpg" alt="not-found" class="not-found"/>`;
      // Error durumunda sayfanın title'ını değiştiren kod.
      const title = `404- Not Found`;
      document.title = title;
      console.log(error, "bir şeyler ters gitti ..");
    }
  }
});

// butonlar ile filtreleme yapan fonksiyon. Yukarıda tanımlanan btns değişkeni ile buttonları for döngüsüyle dönerek her birine birer click event'ı veriyoruz.

for (const btn of btns) {
  // her birine click eventi verdik.
  btn.addEventListener("click", function () {
    // butonlar içindeki texti alıyoruz . bu text daha sonra filtrelemede bize yardımcı olacak. text ile data verilerinde category keyi eşitse ona bağlı datalar ekrana yazdırılacak.

    const textBtn = btn.textContent.toLowerCase();

    // console.log(textBtn);

    // eğer textbtn all sa tüm data ekrana getirilir.

    if (textBtn == "all") {
      displayData(data.menu);
    } else {
      // eğer textbtn all değilse bir filtreleme yapılır ve textbtn ile categorylerin eşit olup olmadığına bakılır.  Eşitse ilgili datalar ekrana yazdırılır.

      let filteredData = data.menu.filter((item) => item.category === textBtn);

      displayData(filteredData);
    }

    // Buttonların class kodları
    document.querySelector("button.active-btn").classList.remove("active-btn");
    btn.classList.add("active-btn");
  });
}

// Dataları ekrana yazdıran fonksiyon

const displayData = (data) => {
  const menuList = document.querySelector(".menu-list");

  menuList.innerHTML = "";
  for (const item of data) {
    const itemDiv = createItem(
      item.id,
      item.img,
      item.title,
      item.price,
      item.desc
    );

    menuList.insertAdjacentHTML("beforeend", itemDiv);
  }
};

// Her bir data için bir html contenti oluşturan fonksiyon

const createItem = (id, img, name, price, desc) => {
  let item = `
          <a href="info.html?id=${id}" class="menu-item" data-id="${id}">
          <img src="${img}" alt="" />
          <div class="item-info">
            <div class="item-header">
              <p class="item-name">${name}</p>
              <p class="item-price">${(price * 15).toFixed(2)} ₺</p>
            </div>
            <p class="item-desc">${desc}</p>
          </div>
        </a>
  `;

  return item;
};

// info sayfası için id ' ye  bağlı olarak datayı ekrana yazdıran fonksiyon . Burada da id'Ye bağlı olarak datada bir filtreleme yapılır ve ilgili data ekrana yazdırılır.

const displayProduct = (id, data) => {
  const filterProduct = data.find((item) => item.id == id);

  // console.log(filterProduct);

  const product = createProduct(
    filterProduct.id,
    filterProduct.img,
    filterProduct.title,
    filterProduct.price,
    filterProduct.desc,
    filterProduct.category
  );

  // console.log(product);

  // İlgili productın pathini güncelleyen kod
  productPathTitle.textContent = `Anasayfa / ${filterProduct.category} / ${filterProduct.title}`;
  // console.log(productPathTitle);

  // ilgili productın titleınıı güncelleyen kod
  const title = `Qr Menu - ${filterProduct.title}`;
  document.title = title;
  // console.log(title);

  // Productı ekrana yükleyen kod
  productWrapper.insertAdjacentHTML("beforeend", product);
};

// info sayfası için ekrana getirilmek istenen datanın html contentini hazırlayan fonksiyon

const createProduct = (id, img, name, price, desc, category) => {
  const product = `
                <div class="product-item" data-id="${id}">
          <h2 class="product-name">${name}</h2>
          <img src="${img}" alt="" />
          <div class="product-category">
            <p class="product-cat-header">Ürünün Kategorisi :</p>
            <p class="product-cat-name">${category}</p>
          </div>
          <div class="product-price">
            <p class="product-price-header">Fiyat:</p>
            <p class="product-price-name">${(price * 15).toFixed(2)} ₺</p>
          </div>

          <p class="product-description">
          ${desc}
          </p>
        </div>
  `;
  return product;
};
