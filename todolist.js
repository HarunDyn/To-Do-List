// Tüm elementleri Seçme 

const form = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo');
const cardbody1 = document.querySelectorAll('.card-body')[0];
const cardbody2 = document.querySelectorAll('.card-body')[1];
const filter = document.querySelector('#filter');
const todolist = document.querySelector('.list-group');
const clearButton = document.querySelector('#clear-todos');

eventListener();

function eventListener() { // bu fonk görevi tüm eventListener'ları atamak //
    form.addEventListener('submit', addtodo);
    document.addEventListener('DOMContentLoaded', LoadalltodosToUI); // Sayfa yenilendiğinde eklemiş oldugumuz todoların localstoregedan tekrar UI gönderilmesi
    cardbody2.addEventListener('click', deletetodo);
    filter.addEventListener('keyup', filtertodos);
    clearButton.addEventListener('click', clearAlltodos);

};

function clearAlltodos() {
    if (confirm('todoları temizlemek istiyor musunuz?')) {
        // Arayüzden todoları kaldırma//
        // todolist.innerHTML=''; // removechild göre yavaş kalıyor

        //    todolist.removeChild(todolist.firstElementChild);
        //    todolist.removeChild(todolist.firstElementChild);
        //    todolist.removeChild(todolist.firstElementChild);
        //    todolist.removeChild(todolist.firstElementChild);

        // tek seferde yazabiliriz bunu while döngüsüyle;

        while (todolist.firstElementChild != null) {
            todolist.removeChild(todolist.firstElementChild);
        }

        // localStorega'dan silme işlemi / key silinirse değerler silinir
        localStorage.removeItem('keytodo');

    }

};


function filtertodos(e) {
    const filtervalue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll('.list-group-item');

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();

        if (text.indexOf(filtervalue) === -1) {
            //kayıt bulunamadı
            listItem.setAttribute('style', 'display:none !important'); //bootstrapteki d-felx özelliğini çalışamaz hale getirdik
        } else {
            listItem.setAttribute('style', 'display:block');
        }



        // 'harun'.indexOf('ha'); // burada ha ilk geçtiği indeksi bize verecek yani 0.indeks // eğer alaksız bir değer girilirse -1 sonucunu verecek

    });

}

function deletetodo(e) { // e yani event parametresi bize e.target ile cardbody bölgesinde nereye basıldığını göstermektedir.

    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        showAlert('success', 'Todo başarıyla silindi !')
        deletetodofromStorage(e.target.parentElement.parentElement.textContent); // Localstoragedan silme yoksa her yinelemede tekrar gelmekte
    }
};

function deletetodofromStorage(deletetodo) {

    let keytodo = getkeytodofromStorage();

    keytodo.forEach(function (todo, index) {
        if (todo === deletetodo) {

            keytodo.splice(index, 1); // arrayden değer silme-belirtilen indeksten itibaren 1 değer silinecek
        }
    });
    localStorage.setItem('keytodo', JSON.stringify(keytodo));

};


function LoadalltodosToUI() {
    let keytodo = getkeytodofromStorage();
    keytodo.forEach(function (todo) {
        addtodoToUI(todo);
    })
};




function addtodo(e) {

    const newtodo = todoInput.value.trim(); // .split(); methodu input değerini array çeviriyor // .trim(); methodu ise boşluklarını alıyor

    // addtodoToUI(newtodo);  // boş ekleme yaptığımızda listItem oluşmasını engelleme ve uyarı verme // fonksiyonumuz tek sefer çalışacaksa dışarda ayrı bir şekilde tanımlamak daha çok kolaylık sağlayacaktır..newtodo nun UI ya düşmesi

    //<div class="alert alert-danger" role="alert">
    // Ekleme Yapılamadı !
    // </div>

    if (newtodo === '') {
        showAlert('danger', 'Lütfen bir todo ekleyiniz !');
    } else {
        addtodoToUI(newtodo);
        showAlert('success', 'Başarıyla eklendi !');
        addtodotoStorage(newtodo);

    }




    e.preventDefault();
};



// Storage dan todoları alacak
function getkeytodofromStorage() {
    let keytodo;
    if (localStorage.getItem('keytodo') === null) {
        keytodo = [];
    } else {
        keytodo = JSON.parse(localStorage.getItem('keytodo'));
    }
    return keytodo;

};


function addtodotoStorage(newtodo) {
    let keytodo = getkeytodofromStorage();

    keytodo.push(newtodo);

    localStorage.setItem('keytodo', JSON.stringify(keytodo));

};


function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `.alert alert-${type}`;
    alert.textContent = message;

    cardbody1.appendChild(alert);

    // setTimeout metodu // kısa süreliğine görüne  // 1000 mils=1 sn 
    //  alert()=''; - ekranda işi görecek süre kalamadı

    setTimeout(function () {
        alert.remove();
    }, 1000);

}

function addtodoToUI(newtodo) { // String değerini list grup olarak UI eklenmesi / Dinamik li elementinin oluşturulması/

    //     <!-- <li class="list-group-item d-flex justify-content-between">
    //     Todo 1
    //     <a href = "#" class ="delete-item">
    //         <i class = "fa fa-remove"></i>
    //     </a>

    // </li> -->

    // listıtem ve link oluşturma
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.className = 'delete-item';
    link.href = '#';
    link.innerHTML = '<i class = "fa fa-remove"></i>';

    listItem.className = 'list-group-item d-flex justify-content-between';

    // Text Node ekleme
    listItem.appendChild(document.createTextNode(newtodo));
    listItem.appendChild(link);

    //todolist e listitem child olarak ekleme 
    todolist.appendChild(listItem);

    todoInput.value = ''; // newtodo input alanına girilip submit edildikten sonra kendisini silmesi


};