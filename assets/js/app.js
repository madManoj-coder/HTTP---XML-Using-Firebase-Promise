const cl = console.log;

const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const postForm = document.getElementById("postForm");
const postContainer = document.getElementById("postContainer");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
// const card = document.getElementById("card");


let baseUrl = `https://crud1-f000a-default-rtdb.asia-southeast1.firebasedatabase.app/`;

let postUrl = `${baseUrl}/posts.json`;

const objToArr = (obj) => {
    let postArray = []
    for (const key in obj) {
        let object = obj[key];
        object.id = key;
        postArray.push(object)
    }
    return postArray;
}

const onEdit = (ele) => {
    cl(ele)
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId", editId)
    let editUrl = `${baseUrl}/posts/${editId}.json`

    makeApiCall("GET", editUrl)
        .then(res => {
            let jsonObj = JSON.parse(res)

            titleControl.value = jsonObj.title;
            bodyControl.value = jsonObj.body;
            userIdControl.value = jsonObj.userId;

            submitBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")

            function scroll() {                 
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                  timer:100
                });
              }
              scroll()
        })
        .catch(err => {
            cl(err)
        })
}

const onUpdatePost = (ele) => {
    let updateId = localStorage.getItem('editId');
    let updateUrl = `${baseUrl}/posts/${updateId}.json`
    let updateObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(updateObj)

    makeApiCall("PUT", updateUrl, JSON.stringify(updateObj))
        .then(res => {
            // cl(res)
            let update = JSON.parse(res)
            let updatId2 = document.getElementById(updateId);
            let children = [...updatId2.children]
            children[0].innerHTML = `<h2>${update.title}</h2>`
            children[1].innerHTML = `<p>${update.body}</p>`

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
              });
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            updateBtn.classList.add('d-none')
            submitBtn.classList.remove('d-none')
            postForm.reset()
        })
}

const onDelete = (ele) => {
    let delteId = ele.closest(".card").id;
    // cl(delteId)
    let deleteUrl = `${baseUrl}/posts/${delteId}.json`

    makeApiCall("DELETE", deleteUrl)
        .then(res => {
            // cl(res)
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                  });
                  document.getElementById(delteId).remove()
                }
              });
            
        })
        .catch(err => {
            cl(err)
        })
}

const onCreateCard = (ele) => {
    let card = document.createElement('div')
    card.className = "card mb-4 bg2"
    card.id = ele.id;
    card.innerHTML = `<div class="card-header color">
                        <h2>${ele.title}</h2>
                     </div>
                     <div class="card-body color">
                        <p>${ele.body}</p>
                     </div>
                     <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
                     </div>
                      `
                      postContainer.append(card)                  
}

updateBtn.addEventListener("click", onUpdatePost)

const templatingOfPost = (arr) => {
    //  let result = ``;
     arr.forEach(posts => {
        onCreateCard(posts)
        // result += `<div class="card mb-4" id="${posts.id}">
        //              <div class="card-header">
        //                  <h2>${posts.title}</h2>
        //              </div>
        //              <div class="card-body">
        //                  <p>${posts.body}</p>
        //              </div>
        //              <div class="card-footer d-flex justify-content-between">
        //                  <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
        //                  <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
        //              </div>
        //            </div>
        //             `
     });
    //  postContainer.innerHTML = result;
}

const makeApiCall = (methodName, apiUrl, body = null) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        // xhr.setRequestHeader("")
        xhr.open(methodName, apiUrl)
        xhr.send(body)
        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status <= 299){
                resolve(xhr.responseText)
            }else{
                reject(xhr.statusText)
            }
        }
    })
}

makeApiCall("GET", postUrl)
     .then(res => {
        // cl(res)
        let d1 = JSON.parse(res)
        // cl(d1)
        let d2 = objToArr(d1)
        // cl(d2)
        templatingOfPost(d2)
    })
     .catch(err => {
        cl(err)
    })

const onCreatePost = (eve) => {
    eve.preventDefault()
    let createObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    // cl(createObj)

    makeApiCall("POST", postUrl, JSON.stringify(createObj))
        .then(res => {
            let res1  = JSON.parse(res)
            cl(res1)
            createObj.id = res1.name;
            // cl(createObj)
            onCreateCard(createObj)
            Swal.fire({
                title: "Created",
                text: "New post created successfully",
                icon: "success"
              });
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            postForm.reset()
        })
}

postForm.addEventListener("submit", onCreatePost)