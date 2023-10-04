const tag = (tag) => document.querySelector(tag);
const tags = (tag) => document.querySelectorAll(tag);

const btnAddTodo = tag('.btn-add');
const elTodo = tag('.todo');
const btnSave  =  tag('.btn-save');
const btnCancel  =  tag('.btn-cancel');
const inputTodo = tag('.input-todo');
const inputSearch = tag('.search');
const formTodo = tag('.form-todo');
let listsTodo = tag('.lists-todo');
const btnDelete = tag('.btn.delete');
const btnEdit = tag('.btn.edit');
const btnConfirm = tag('.btn.confirm');
let arrListsTodo, editItem, inputEdit;
let dataJsonServer, idEdit;
let url = 'https://25zf44-6700.csb.app/users';

window.addEventListener('load',async ()=>{
    await Fetch();
    if(Array.isArray(dataJsonServer) && dataJsonServer.length != 0){
        dataJsonServer.forEach(({value})=>{
            createItem(value)
        })
    }
})

// Xử lý nhấn thêm Todo mở form
btnAddTodo.onclick = ()=>{
    elTodo.classList.add('active');
}
// Xử lý khi đóng form
btnCancel.onclick = ()=>{
    elTodo.classList.remove('active');
}
//Xử lý form
formTodo.addEventListener('submit', async function(e){
    e.preventDefault();
    let value = inputTodo.value;
    if(value && !editItem){
        createItem(value);
        await Fetch('POST', {value: value})
    }else if(value && editItem){
        inputEdit.value = value;
        editItem = false;
        elTodo.classList.remove('active');
        await Fetch('PATCH', {value}, idEdit)
    }
})
// Xử lý khi Edit input


function createItem(value){
    const childParent = document.createElement('div');
    childParent.className = 'item-todo';
    const childItem = document.createElement('div');
    childItem.className = 'item';
    const childInput = document.createElement('input');
    childInput.className = 'item-input';
    childInput.value = value;
    childInput.disabled = true;
    childItem.appendChild(childInput);
    childParent.appendChild(childItem);
    const childBtn = document.createElement('div');
    childBtn.className = 'btn-todo';
    const chilDelete = document.createElement('button');
    chilDelete.className = 'delete btn';
    chilDelete.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    childBtn.appendChild(chilDelete);
    const chilEdit = document.createElement('button');
    chilEdit.className = 'edit btn';
    chilEdit.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    childBtn.appendChild(chilEdit);
    const chilConfim = document.createElement('button');
    chilConfim.className = 'confirm btn';
    chilConfim.innerHTML = `<i class="fa-regular fa-square-check"></i>`;
    childBtn.appendChild(chilConfim);
    childParent.appendChild(childBtn);
    listsTodo.appendChild(childParent)
}
function getElItem(){
    listsTodo = tag('.lists-todo');
    arrListsTodo = Array.from(listsTodo.children);
}

document.addEventListener('mousedown',async function(e){
    let parentNode
    if(e.target.className === 'delete btn' || e.target.parentNode.className === 'delete btn'){
        parentNode = findElParent(e.target, 'item-todo', 10);
        inputEdit = parentNode.querySelector('.item-input');
        fnDelete(inputEdit.value)
        parentNode.remove();
    } else if(e.target.className === 'edit btn' || e.target.parentNode.className === 'edit btn'){
        editItem = true;
        parentNode = findElParent(e.target, 'item-todo', 10);
        inputEdit = parentNode.querySelector('.item-input');
        inputTodo.value = inputEdit.value;
        elTodo.classList.add('active');
        idEdit = await findId(inputEdit.value);
    }else if(e.target.className === 'confirm btn' || e.target.parentNode.className === 'confirm btn'){
        console.log('Xác nhận')
        parentNode = findElParent(e.target, 'item-todo', 10)
    }
})

function findElParent(elChild, elParent, counts){
    let classChild = elChild;
    let count = counts;
    while(classChild.className != elParent && count > 0){
        classChild = classChild.parentNode;
        --count;
    }
    return classChild
}
async function Fetch(method = 'GET', dataJson= {}, id){
    var header = new Headers();
    header.append("Content-Type", "application/json");
    var raw = JSON.stringify(dataJson);
    var options = {
    method: method,
    headers: header,
    body: method === 'GET' ? undefined:  raw,
    redirect: 'follow'
    };
    try{
        const data = await fetch(id? url+ `/${id}`: url, options);
        if(data.status === 201 || data.status === 200 && method !== "DELETE"){
            const result = await data.json();
            dataJsonServer = result;
    }else {
        return undefined;
    }
    }catch(ex){
        console.log(ex)
    }
    
}
async function findId(value){
    await Fetch();
    let index;
    index = dataJsonServer.find(({value: _value, id})=>{
        if(value === _value){
            return id
        }
    });
    let id = index.id;
    return id;
}
async function fnDelete(value){
    let id = await findId(value);
    await Fetch('DELETE',{}, id);
    
}