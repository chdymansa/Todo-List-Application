
onPageLoad = function () {
    showtask();
}

onPageLoad();

let adddescription = document.getElementById("adddescription");
let addtaskinput = document.getElementById("addtaskinput");
let addtaskbtn = document.getElementById("addtaskbtn");

function GetAllItems() {
    let webtask = localStorage.getItem("local");
    if (webtask == null) {
        taskObj = [];
    }
    else {
        console.log(webtask);
        try {
            taskObj = JSON.parse(webtask);
        } catch (error) {
            taskObj = [];
        }
    }
    return taskObj;
}
function SaveAllItems(data) {
    localStorage.setItem("local", JSON.stringify(data));
}
addtaskbtn.addEventListener("click", function () {
    addtaskinputval = addtaskinput.value;
    adddescriptionval = adddescription.value;
    if (addtaskinputval.trim() != 0) {
        taskObj = GetAllItems();

        let obj = { task: addtaskinputval, description: adddescriptionval };
        taskObj.push(obj);

        SaveAllItems(taskObj);

        addtaskinput.value = "";
        adddescription.value = "";
    }
    showtask();

});
// show task
function showtask() {

    let taskObj = GetAllItems();

    let html = "";
    let addedtasklist = document.getElementById("addedtasklist");
    $('#addedtasklist').empty();
    taskObj.forEach((item, index) => {
        row = `  
    <li class="list-group-item">
            <div class="row">
                <div class="col-2">${index + 1}</div>
                <div class="col-3">${item.task}</div>
                <div class="col-5">${item.description}</div>
                <div class="col-2">
                    <button type="button" onclick="edittask(${index})" class="text-dark btn btn-outline-warning my-1">edit</button>
                    <button type="button" onclick="deleteitem(${index})" class="text-dark btn btn-outline-danger my-1">delete</button>
                </div>
            </div>
    </li>
`;
        $row = $(row);
        $row.data('d', item);
        $('#addedtasklist').append($row);
    });
    //addedtasklist.innerHTML = html;
    applySortable();
}
// edit task
function edittask(index) {
    let saveindex = document.getElementById("saveindex");
    let addtaskbtn = document.getElementById("addtaskbtn");
    let savetaskbtn = document.getElementById("savetaskbtn");
    saveindex.value = index;


    let taskObj = GetAllItems();

    addtaskinput.value = taskObj[index].task;
    adddescription.value = taskObj[index].description;

    addtaskbtn.style.display = "none";
    savetaskbtn.style.display = "block";
}
// save task
let savetaskbtn = document.getElementById("savetaskbtn");
savetaskbtn.addEventListener("click", function () {
    let addtaskbtn = document.getElementById("addtaskbtn");

    let taskObj = GetAllItems();

    let saveindex = document.getElementById("saveindex").value;

    taskObj[saveindex].task = addtaskinput.value;
    taskObj[saveindex].description = adddescription.value;

    savetaskbtn.style.display = "none"
    addtaskbtn.style.display = "block";

    SaveAllItems(taskObj);

    addtaskinput.value = "";
    showtask();
});

// delete item
function deleteitem(index) {
    let taskObj = GetAllItems();

    taskObj.splice(index, 1);

    SaveAllItems(taskObj);

    showtask();
}
//  delete all item
let deleteallbtn = document.getElementById("deleteallbtn");
deleteallbtn.addEventListener("click", function () {
    let savetaskbtn = document.getElementById("savetaskbtn");
    let addtaskbtn = document.getElementById("addtaskbtn");


    savetaskbtn.style.display = "none";
    addtaskbtn.style.display = "block";

    SaveAllItems([]);

    showtask();
})

// serch item
let serchtextbox = document.getElementById("serchtextbox");
serchtextbox.addEventListener("input", function () {
    let trlist = document.querySelectorAll("ul");
    Array.from(trlist).forEach(function (item) {
        let searchtext = item.getElementsByTagName("li")[0].innerText;
        let serchtextboxval = serchtextbox.value;
        let re = new RegExp(serchtextboxval, "gi");
        if (searchtext.match(re)) {
            item.style.display = "table-row";
        }
        else {
            item.style.display = "none";
        }
    })
});

function applySortable() {
    console.log('sortable');
    $('.list-group-sortable').sortable({
        placeholderClass: 'list-group-item'
    });
    $('.list-group-sortable').on('sortstart', function (e, ui) {
        $(this).attr('data-previndex', ui.item.index());
        console.log('start eg ', ui.item.index());
    });

    $('.list-group-sortable').on('sortupdate', function (e, ui) {

        // new_locations = $(this).find('li').map(function(i, el) {
        //     return $(el).data('d')
        //   }).get()
          
        //   console.log(new_locations);

        var newIndex = ui.item.index();
        var oldIndex = $(this).attr('data-previndex');
        console.log('here we are check', oldIndex, newIndex);
        updateIndexItem(oldIndex, newIndex);

    });
}

function updateIndexItem(oldIndex, newIndex) {


    //get all items:
    let allItems = GetAllItems();
    //console.log(allItems);
    var tmp = allItems.splice(oldIndex, 1);
    //console.log(tmp[0]);
    allItems.splice(newIndex, 0, tmp[0]);
    //console.log(allItems);

    SaveAllItems(allItems);

    //showtask();

}
