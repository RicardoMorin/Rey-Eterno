import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getStorage,
ref,
uploadBytes,
getDownloadURL,
deleteObject
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig={

TU_CONFIG

};

const app=initializeApp(firebaseConfig);

const db=getFirestore(app);

const storage=getStorage(app);

const input=document.getElementById("files");

const gallery=document.getElementById("gallery");

input.addEventListener("change",async()=>{

for(const file of input.files){

const storageRef=ref(storage,"galeria/"+Date.now()+"_"+file.name);

await uploadBytes(storageRef,file);

const url=await getDownloadURL(storageRef);

await addDoc(collection(db,"galeria"),{

url:url,
path:storageRef.fullPath,
fecha:Date.now()

});

}

cargar();

});

async function cargar(){

gallery.innerHTML="";

const docs=await getDocs(collection(db,"galeria"));

docs.forEach(d=>{

const data=d.data();

gallery.innerHTML+=`

<div class="card">

<img src="${data.url}">

<button onclick="eliminar('${d.id}','${data.path}')">

Eliminar

</button>

</div>

`;

});

}

window.eliminar=async(id,path)=>{

await deleteObject(ref(storage,path));

await deleteDoc(doc(db,"galeria",id));

cargar();

}

cargar();