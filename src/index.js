import './styles.css'
//import '../node_modules/@fortawesome/fontawesome-free/js/all'
//import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import formController from "./modules/formController"
import tasksManager from "./modules/tasksManager"
import tabsController from "../src/modules/tabsController"
import DOMController from "./modules/DOMController"

function project (projectName, taskListArg){
    let name = projectName
    let taskList = taskListArg?taskListArg:[]
    const addTask = function (task) {
        taskList.push(task)
    }
    const rmTask = function (index) {
        taskList.splice(index, 1)
    }
    const toggleCompleteTask = function (index){
        taskList[index].completed = !taskList[index].completed;
    }
    const getName = function () {
        return name
    }
    const getSortedTaskList = function () {
        taskList.sort((a,b)=>{
            let d1 = new Date (a.dueDate.slice(5)) 
            let d2 = new Date (b.dueDate.slice(5))
            if (d1>d2)
                return 1
            if (d1<d2)
                return -1
            return 0
        })
        return taskList
    }
    const toJSON = function (a) {
        return {name: name, taskList: taskList}
    }
    return {addTask, rmTask, toggleCompleteTask, getName, getSortedTaskList, toJSON}
}

function Task (description, dueDate, priority, completed){
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
}

function formatDate (dateObj) {
    if (typeof(dateObj)==='object'){
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
        let weekday = weekdayNames[dateObj.getDay()];
        let month = monthNames[dateObj.getMonth()];
        let day = String(dateObj.getDate()).padStart(2, '0');
        let year = dateObj.getFullYear();
        let output = weekday + '. ' + month + ' ' + day + ' ' + year;
        return output
    }
}

const eventBinder = (() => {  
    //cache DOM
    const tabs = document.querySelectorAll('.tab')

    const showProjectFormBtn = document.querySelector('#showNewProjectBtn')
    const closeProjectFormBtn = document.querySelector('form#newProject .close')
    
    const showTaskFormBtn = document.querySelector('#showNewTaskBtn')
    const closeTaskFormBtn = document.querySelector('form#newTask .close')

    const addProjectBtn = document.querySelector('#addProject')
    const addTaskBtn = document.querySelector('#addTask')

    for (let i=0; i<tabs.length; i++) {
        tabs[i].addEventListener("click", (e)=>{
            tabsController.setTabToActive(e.target)
        })
    }
    tabsController.setTabToActive(tabs[0])
    
    showProjectFormBtn.addEventListener("click", formController.showProjectForm)
    closeProjectFormBtn.addEventListener("click", formController.closeProjectForm)
    showTaskFormBtn.addEventListener("click", formController.showTaskForm)
    closeTaskFormBtn.addEventListener("click", formController.closeTaskForm)

    addTaskBtn.addEventListener('click', (e)=>{
        const date = document.querySelector("form#newTask input#date")
        if (description.value && date.value){
            tasksManager.addStandaloneTask()
            tabsController.setTabToActive(document.querySelector('.tab.active')) //update current page
            formController.closeTaskForm()
        } else {
            if (!document.querySelector('#errorMsg')) DOMController.addErrorMsg(e)
        }
    })
    addProjectBtn.addEventListener('click', (e)=>{
        if (projectName.value){
            tasksManager.addProject(projectName.value)
            tabsController.setTabToActive(document.querySelector('.tab.active')) //update current page
            formController.closeProjectForm()
        } else {
            if (!document.querySelector('#errorMsg')) DOMController.addErrorMsg(e)
        }
    })

    
    //window.localStorage.removeItem('taskList')
    //console.log(window.localStorage.getItem('projectList'))

})()


export {Task, project, formatDate}