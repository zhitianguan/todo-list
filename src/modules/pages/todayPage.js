import DOMController from "../DOMController"
import tasksManager from "../tasksManager"
import {formatDate} from "../../index"

function makeTodayPage () {
    DOMController.clearPage()
    let today = formatDate(new Date())
    let empty = true
    const taskList = tasksManager.getAllTasksSorted()
    for (let i=0; i<taskList.length; i++){
        if (new Date (taskList[i].dueDate.slice(5)) < new Date (today.slice(5))){
            DOMController.addTask(taskList[i])
            empty = false
        }
    }

    DOMController.addDay(today)
    for (let i=0; i<taskList.length; i++){
        if (taskList[i].dueDate===today){
            empty = false
            DOMController.addTask(taskList[i])
        }
    }
    if (empty) {
        DOMController.addEmptyMsg('today')
    }
}

export {makeTodayPage}