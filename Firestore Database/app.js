const cafelist = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create elememnt and render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafelist.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
}

//getting data
//for searching queries such as show the cafe located in vadodara we can write .where('city','==','Dongol') after d.collection('cafes')

// db.collection('cafes').orderBy('city').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         rendercafe(doc);
//     });
// })


// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafelist.querySelector('[data-id=' + change.doc.id + ']');
            cafelist.removeChild(li);
        }
    });
});