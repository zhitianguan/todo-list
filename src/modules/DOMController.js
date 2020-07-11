import tasksManager from "./tasksManager";
import {formatDate} from "../index"
import formController from "./formController"


const DOMcontroller = (()=> {
    const wholePageContainer = document.querySelector('.wholePageContainer')
    
    function createProjectContainer(projectName){
        const projectContainer = document.createElement('div')
        projectContainer.classList.add('projectContainer')
    
        const nameDOM = document.createElement('h2')
        nameDOM.textContent = projectName

        const deleteBtn =  document.createElement ('span')
        deleteBtn.innerHTML = '<i class="fa fa-trash"></i>'
        deleteBtn.addEventListener('click', tasksManager.rmProject)

        const line = document.createElement('hr')
        const taskContainerWrapper = document.createElement('div')
        taskContainerWrapper.classList.add('taskContainerWrapper')
        
        const showFormBtn = document.createElement('button')
        showFormBtn.classList.add('showMiniFormBtn')
        showFormBtn.innerHTML = '<span class="plusIcon">+</span> Add task'
        showFormBtn.addEventListener('click',formController.showMiniForm)

        projectContainer.appendChild(nameDOM)
        projectContainer.appendChild(deleteBtn)
        projectContainer.appendChild(line)
        projectContainer.appendChild(taskContainerWrapper)
        projectContainer.appendChild(createMiniForm(true))        
        projectContainer.appendChild(showFormBtn)
        
        return projectContainer
    }

    function createMiniForm (project){
        const miniForm = document.createElement('form')
        miniForm.classList.add('miniForm')
        const descriptionMini = document.createElement('input')
        descriptionMini.type = 'text'
        descriptionMini.classList.add('descriptionMini')

        const addBtn = document.createElement('button')
        addBtn.type = 'button'
        addBtn.classList.add('addProjectTask')
        addBtn.textContent = 'Add'
        addBtn.addEventListener('click', (e)=>{
            if (!project){
                tasksManager.quickAddTask(e)
            } else {
                tasksManager.addProjectTask(e)
            }
        })
        
        const cancelBtn = document.createElement('button')
        cancelBtn.type = 'button'
        cancelBtn.classList.add('cancel')
        cancelBtn.textContent = 'Cancel'
        cancelBtn.addEventListener('click',formController.closeMiniForm)

        const inputWrapper = document.createElement('div')
        inputWrapper.classList.add('inputWrapper')
        inputWrapper.appendChild(descriptionMini)

        if (project){
            const date = document.createElement('input')
            date.type = 'date'
            date.classList.add('dateMini')
            inputWrapper.appendChild(date)
        } else {
            const label = document.createElement('label')
            label.for = 'priority'
            label.textContent = 'Priority: '
            const select = document.createElement('select')
            select.id = 'priority'
            select.name = 'priority'

            const op2 = document.createElement('option')
            op2.textContent = 'Medium'
            op2.value = 1
            select.appendChild(op2)
            
            const op1 = document.createElement('option')
            op1.textContent = 'Low'
            op1.value = 0
            select.appendChild(op1)
            
            const op3 = document.createElement('option')
            op3.textContent = 'High'
            op3.value = 2
            select.appendChild(op3)

            inputWrapper.appendChild(label)
            inputWrapper.appendChild(select)
        }

        miniForm.appendChild(inputWrapper)
        miniForm.appendChild(addBtn)        
        miniForm.appendChild(cancelBtn)        

        return miniForm;
    }

    function createDayContainer(date){
        let yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        let today = new Date(formatDate(new Date()).slice(5))
        let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        const dayContainer = document.createElement('div')
        dayContainer.classList.add('dayContainer')
        dayContainer.setAttribute('data-date', date);

        const dateDOM = document.createElement('h2')
        if (today>new Date (date.slice(5)))
            dateDOM.textContent = 'Overdue ‧ ' + date.slice(0, -5)
        else if (formatDate(today)===date)
            dateDOM.textContent = 'Today ‧ ' + date.slice(0, -5)
        else if (formatDate(tomorrow)===date)
            dateDOM.textContent = 'Tomorrow ‧ ' + date.slice(0, -5)
        else if (formatDate(yesterday)===date)
            dateDOM.textContelnt = 'Yesterday ‧ '+ date.slice(0, -5)
        else
            dateDOM.textContent = date.slice(0, -5)

        if ((new Date()).getFullYear()!=date.slice(11)){
            dateDOM.textContent += ', ' + date.slice(11)
        }

        const line = document.createElement('hr')
        const taskContainerWrapper = document.createElement('div')
        taskContainerWrapper.classList.add('taskContainerWrapper')

        const showFormBtn = document.createElement('button')
        showFormBtn.classList.add('showMiniFormBtn')
        showFormBtn.innerHTML = '<span class="plusIcon">+</span> Add task'
        showFormBtn.addEventListener('click',formController.showMiniForm)

        dayContainer.appendChild(dateDOM)
        dayContainer.appendChild(line)
        dayContainer.appendChild(taskContainerWrapper)
        dayContainer.appendChild(createMiniForm(false))
        dayContainer.appendChild(showFormBtn)

        if (!dayContainer){
            dayContainer = addDay(task.dueDate)
        }

        return dayContainer
    }

    function createTaskContainer (task, project) {
        const taskContainer = document.createElement('div')
        taskContainer.classList.add('taskContainer')
        taskContainer.setAttribute('data-priority', task.priority);
        taskContainer.setAttribute('data-date', task.dueDate);
    
        const checkBtn =  document.createElement ('div')
        checkBtn.classList.add('fa')
        checkBtn.classList.add('fa-check-circle')
        checkBtn.addEventListener('click', (e)=>{
                tasksManager.toggleCompleteTask(e, project)
        })
        
        const taskDescription =  document.createElement ('div')
        taskDescription.classList.add('taskText')
        taskDescription.textContent = task.description

        if (task.completed){
            checkBtn.classList.add('completed')
            taskDescription.classList.add('completed')
        }

        const removeBtn =  document.createElement ('div')
        removeBtn.classList.add('close')
        removeBtn.innerHTML = '&times;'
        removeBtn.addEventListener('click', (e)=> {
            tasksManager.rmTask(e,project)
        })
        
        taskContainer.appendChild(checkBtn)
        taskContainer.appendChild(taskDescription)

        if (!project) {
            const priority =  document.createElement ('div')
            priority.classList.add('priority')
            switch (parseInt(task.priority)){
                case 0:
                    priority.textContent = 'Low Priority'
                    break
                case 1:
                    priority.textContent = 'Medium Priority'
                    break
                case 2:
                    priority.textContent = 'High Priority'
                    break
            } 
            taskContainer.appendChild(priority)
        } else if (!task.completed) {
            const date =  document.createElement ('div')
            date.classList.add('projectTaskDate')
            date.textContent = `Due: ${task.dueDate.slice(0,-5)}`
            taskContainer.appendChild(date)
        }
        taskContainer.appendChild(removeBtn)

        return taskContainer
    }

    function addProject (projectName){
        const projectContainer = createProjectContainer(projectName)
        wholePageContainer.appendChild(projectContainer)
        return projectContainer
    }

    function addProjectTask (task) {
        const taskContainer = createTaskContainer(task, true)
        const projectContainers = document.querySelectorAll('.projectContainer')
        const projectContainer = projectContainers[projectContainers.length-1]
        if (!task.completed)
            projectContainer.querySelector('.taskContainerWrapper').appendChild(taskContainer)
        else {
            let completedWrapper = projectContainer.querySelector('.completedWrapper')
            if (!completedWrapper){
                completedWrapper = addCompletedWrapper(projectContainer)
            }
            completedWrapper.appendChild(taskContainer)
        }
    }
    
    function addDay (date) {
        const dayContainer = createDayContainer(date)
        wholePageContainer.appendChild(dayContainer)
        return dayContainer
    }

    function addTask (task) {
        const taskContainer = createTaskContainer(task, false)
        let dayContainer = document.querySelector(`[data-date="${task.dueDate}"]`)
        if (!dayContainer){
            dayContainer = addDay(task.dueDate)
        }
        if (!task.completed)
            dayContainer.querySelector('.taskContainerWrapper').appendChild(taskContainer)
        else {
            let completedWrapper = dayContainer.querySelector('.completedWrapper')
            if (!completedWrapper){
                completedWrapper = addCompletedWrapper(dayContainer)
            }
            completedWrapper.appendChild(taskContainer)
        }
    }

    function addCompletedWrapper (container){
        const completedContainer = document.createElement('div')
        completedContainer.classList.add('completedWrapper')
        completedContainer.innerHTML = 'Completed tasks'
        container.appendChild(completedContainer)

        return completedContainer
    }

    function rmTask (taskDOM) {
        taskDOM.parentNode.removeChild(taskDOM)
    }

    function clearPage (){
        wholePageContainer.innerHTML = '';
    }

    function addEmptyMsg (page) {
        const msg = document.createElement('div')
        switch (page){
            case 'today':
                msg.id = 'todayMsg'
                msg.innerHTML = "You have no tasks today"
                wholePageContainer.querySelector('.dayContainer .taskContainerWrapper').appendChild(msg)
                break;
            case 'upcoming':
                msg.id = 'upcomingMsg'
                msg.innerHTML = "<h2>Have tasks further down the line?</h2><br>Click the button at the top right corner to add a task with any date!"
                wholePageContainer.appendChild(msg)
                break;
            case 'project':
                msg.id = 'projectMsg'
                msg.innerHTML = "<h2>You have no projects</h2> <br>Click the new project button on the left to create a new one!"
                wholePageContainer.appendChild(msg)
                break;
        }
    }

    function addErrorMsg (e) {
        const msg = document.createElement('div')
        const btn = e.target
        msg.id = 'errorMsg'
        msg.innerHTML = "Some input fields are empty."
        btn.parentNode.insertBefore(msg, btn)  
    }

    return {
        addDay, 
        addProject,
        addProjectTask, 
        addTask, 
        rmTask, 
        clearPage, 
        addEmptyMsg,
        addErrorMsg
    }
})()

export default DOMcontroller