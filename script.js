let datalist = document.querySelector(".data-list");

document.addEventListener("DOMContentLoaded", async () => {
  let res = await fetch(`https://northwind.vercel.app/api/categories`);
  let data = await res.json();

  data.forEach((element) => {
    datalist.innerHTML += `
        <li class="border border-secondary">
            <p class="cat-name" data-desc=${element.description}>${element.name}</p>
            <div class="button-groups">
                <button data-id=${element.id} class="btn btn-warning edit-btn justify-content-center align-items-center btn-warning ml-2" aria-label="btn">Edit</button>
                <button data-id=${element.id} class="btn btn-danger delete-btn justify-content-center align-items-center btn-danger ml-2" aria-label="btn">Delete</button>
            </div>
        </li>
        `;
  });

  let delbtn = document.querySelectorAll(".delete-btn");

  delbtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      let id = e.target.getAttribute("data-id");

      let confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmed.isConfirmed) {
        await fetch(`https://northwind.vercel.app/api/categories/${id}`, {
          method: "DELETE",
        });
        e.target.parentElement.parentElement.remove();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  });

  let editbtn = document.querySelectorAll(".edit-btn");
  let modal = document.querySelector("#myModal");
  let close = document.querySelector(".close");
  let nameinp = document.querySelector("#name");
  let descinp = document.querySelector("#desc");
  let modaleditbtn = document.querySelector(".modal-edit-btn");
  let openmodalbtn=document.querySelector(".open-modal-btn");
  console.log(openmodalbtn);

  editbtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      let id = e.target.getAttribute("data-id");
      let editname = e.target.parentElement.previousElementSibling.textContent;
      let editdesc = e.target.parentElement.previousElementSibling.getAttribute("data-desc");
      nameinp.value = editname;
      descinp.value = editdesc;
      modaleditbtn.setAttribute("data-id", id);
      modal.style.display = "block";
    });
  });

  modal.addEventListener("submit", async (e) => {
    e.preventDefault();

    let id = modaleditbtn.getAttribute("data-id");
    let updatedName = nameinp.value;
    let updatedDesc = descinp.value;

    let res = await fetch(`https://northwind.vercel.app/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updatedName,
        description: updatedDesc,
      }),
    });

    let editedelement = document.querySelector(`button[data-id="${id}"]`).parentElement.previousElementSibling;
    editedelement.textContent = updatedName;
    editedelement.setAttribute("data-desc", updatedDesc);
    modal.style.display = "none";
  });

  close.addEventListener("click", () => {
    modal.style.display = "none";
  });

  openmodalbtn.addEventListener("click",(e)=>{
    modal.style.display = "block";
     modal.addEventListener("submit",async(e)=>{
        e.preventDefault();
        let categoryname=nameinp.value;
        let categorydesc=descinp.value;
        nameinp.value="";
        descinp.value="";
        let newcategory={
            name: categoryname,
            description: categorydesc,
        }
        if (newcategory.name.trim()==="" || newcategory.description.trim()==="") {
            window.alert("Apiya bos data gondermek olmaz!");
        }
        else{
            await fetch("https://northwind.vercel.app/api/categories",{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(newcategory)
            })
        }
        let res = await fetch(`https://northwind.vercel.app/api/categories`);
        let data = await res.json();
        datalist.innerHTML=`
        <li class="border border-secondary">
                <p class="cat-name" data-desc=${newcategory.description}>${newcategory.name}</p>
                <div class="button-groups">
                    <button data-id=${newcategory.id} class="btn btn-warning edit-btn justify-content-center align-items-center btn-warning ml-2" aria-label="btn">Edit</button>
                    <button data-id=${newcategory.id} class="btn btn-danger delete-btn justify-content-center align-items-center btn-danger ml-2" aria-label="btn">Delete</button>
                </div>
            </li>
        `
     })
  })
});
