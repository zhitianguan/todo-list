import {project, Task, formatDate} from "../index"
import tabsController from "./tabsController"
import DOMController from "./DOMController"

const tasksManager = (() => {
    let projectList = getProjectListFromStorage()
    let taskList = (window.localStorage.getItem('taskList'))?JSON.parse(window.localStorage.getItem('taskList')):[]

    const description = document.querySelector("form#newTask input#description")
    const dueDate = document.querySelector("form#newTask input#date")
    const priorityInputs = Array.from(document.querySelectorAll("form#newTask input[type=radio]"))

    function addStandaloneTask () {
        let selectedPriority = priorityInputs.find((priorityInput)=>
            priorityInput.checked
        )
        let priority = selectedPriority.id;
        let task = new Task (description.value, formatDate(new Date(dueDate.value)), priority, false)
        taskList.push(task)
        window.localStorage.setItem('taskList', JSON.stringify(taskList));
    }

    function quickAddTask (e){
        const description = e.target.parentNode.querySelector("input.descriptionMini")
        if (description.value){
            let priority = e.target.parentNode.querySelector("select").value
            let date = e.target.parentNode.parentNode.getAttribute('data-date');
            let task = new Task (description.value, date, priority, false)
            
            taskList.push(task)
            tabsController.setTabToActive(document.querySelector('.tab.active')) //update current page
            window.localStorage.setItem('taskList',  JSON.stringify(taskList));
        } else if (!e.target.parentNode.querySelector('#errorMsg')) {
            DOMController.addErrorMsg(e)
        }
    }

    function addProject (projectName) {
        projectList.push(project(projectName))
        window.localStorage.setItem('projectList',  JSON.stringify(projectList));
    }

    function addProjectTask (e) {
        const description = e.target.parentNode.querySelector("input.descriptionMini")
        const dueDate = e.target.parentNode.querySelector("input.dateMini")

        if (description.value && dueDate.value){
            let index = Array.prototype.indexOf.call(e.target.parentNode.parentNode.parentNode.childNodes, e.target.parentNode.parentNode)
            let task = new Task (description.value, formatDate(new Date(dueDate.value)), 0, false)
            projectList[index].addTask(task)
            tabsController.setTabToActive(document.querySelector('.tab.active')) //update current page
            window.localStorage.setItem('projectList',  JSON.stringify(projectList));
        } else {
            DOMController.addErrorMsg(e)
        }
    }
    
    function toggleCompleteTask (e, project) {
        if (project){
            //update task to completed in backend
            let projectIndex = Array.prototype.indexOf.call(e.target.parentNode.parentNode.parentNode.parentNode.childNodes, e.target.parentNode.parentNode.parentNode)
            const taskDOM = e.target.parentNode
            let description = taskDOM.querySelector('.taskText').textContent
            let date = taskDOM.getAttribute('data-date')
            let completed = e.target.className.includes('completed')
            let selectedTask = new Task (description, date, 0, completed)
    
            let taskList = projectList[projectIndex].getSortedTaskList()
            for (let i=0; i<taskList.length; i++){
                if (compareTasks(taskList[i],selectedTask)){
                    projectList[projectIndex].toggleCompleteTask(i)
                    break
                }
            }
        }
        else {
            //update task to completed in backend
            const taskDOM = e.target.parentNode
            let date = taskDOM.parentNode.parentNode.getAttribute('data-date')
            let description = taskDOM.querySelector('.taskText').textContent
            let priority = taskDOM.getAttribute('data-priority')
            let completed = e.target.className.includes('completed')
            let selectedTask = new Task (description, date, priority, completed)
    
            for (let i=0; i<taskList.length; i++){
                if (compareTasks(taskList[i],selectedTask)){
                    taskList[i].completed = !taskList[i].completed
                    break
                }
            }
        }
        tabsController.setTabToActive(document.querySelector('.tab.active')) //update current page
        window.localStorage.setItem('taskList',  JSON.stringify(taskList));
        window.localStorage.setItem('projectList',  JSON.stringify(projectList));
    }

    function rmTask (e, project){
        if (project){
            let projectIndex = Array.prototype.indexOf.call(e.target.parentNode.parentNode.parentNode.parentNode.childNodes, e.target.parentNode.parentNode.parentNode)
            const taskDOM = e.target.parentNode
            let description = taskDOM.querySelector('.taskText').textContent
            let date = taskDOM.getAttribute('data-date')
            let completed = taskDOM.parentNode.className == 'completedWrapper'
            let selectedTask = new Task (description, date, 0, completed)
            let taskList = projectList[projectIndex].getSortedTaskList()
            for (let i=0; i<taskList.length; i++){
                if (compareTasks(taskList[i],selectedTask)){
                    projectList[projectIndex].rmTask(i)
                    break
                }
            }
        } else {
            //update task to completed in backend
            const taskDOM = e.target.parentNode
            let date = taskDOM.parentNode.parentNode.getAttribute('data-date')
            let description = taskDOM.querySelector('.taskText').textContent
            let priority = taskDOM.getAttribute('data-priority')
            let completed = taskDOM.parentNode.className == 'completedWrapper'
            let selectedTask = new Task (description, date, priority, completed)
    
            for (let i=0; i<taskList.length; i++){
                if (compareTasks(taskList[i],selectedTask)){
                    taskList.splice(i,1)
                    break
                }
            }
        }

        tabsController.setTabToActive(document.querySelector('.tab.active')) //update current page
        window.localStorage.setItem('taskList',  JSON.stringify(taskList));
        window.localStorage.setItem('projectList',  JSON.stringify(projectList));
    }
    
    function rmProject (e){
        let projectIndex = Array.prototype.indexOf.call(e.target.parentNode.parentNode.parentNode.childNodes, e.target.parentNode.parentNode)
        projectList.splice(projectIndex,1)
        tabsController.setTabToActive(document.querySelector('.tab.active')) //update current page
        window.localStorage.setItem('projectList',  JSON.stringify(projectList));
    }

    function compareTasks (a,b){
        return a.description==b.description && a.dueDate==b.dueDate && a.priority==b.priority && a.completed==b.completed
    }

    function getAllTasksSorted () {
        taskList.sort((a,b)=>{
            if (a.priority>b.priority)
                return -1
            if (a.priority<b.priority)
                return 1
            return 0
        })
        taskList.sort((a,b)=>{
            if (a.dueDate>b.dueDate)
                return -1
            if (a.dueDate<b.dueDate)
                return 1
            return 0
        })
        
        return taskList
    }

    function getProjectList () {
        return projectList
    }

    function getProjectListFromStorage () {
        if (window.localStorage.getItem('projectList')){
            let obj = JSON.parse(window.localStorage.getItem('projectList'))
            let projectList = []
            for (let i=0; i<obj.length; i++){
                projectList.push(project(obj[i].name, obj[i].taskList))
            }
            return projectList
        } else 
        return []
    }

    function getTasksNumToday () {  //returns the number of uncompleted tasks to do for today
        let today = formatDate(new Date())
        let count = taskList.reduce( (total, task) => {
                    if (task.dueDate && new Date (task.dueDate.slice(5)) <= new Date (today.slice(5)) && !task.completed) {
                        return total + 1
                    }
                    return total
                }, 0)
        return count
    }

    function getTasksNumUpcoming () {   //returns the number of uncompleted tasks for upcoming tab
        let today = formatDate(new Date())
        let count = taskList.reduce( (total, task) => {
                    if (task.dueDate && new Date (task.dueDate.slice(5)) > new Date (today.slice(5)) && !task.completed) {
                        return total + 1
                    }
                    return total
                }, 0)
        return count
    }

    function getProjectsNum () {  //returns the number of projects
        return projectList.length
    }
    
    return {
        addStandaloneTask,
        quickAddTask,
        addProject,
        addProjectTask, 
        toggleCompleteTask,
        rmTask,
        rmProject,
        getAllTasksSorted,
        getProjectList,
        getTasksNumToday,
        getTasksNumUpcoming,
        getProjectsNum
    }
})()

export default tasksManager