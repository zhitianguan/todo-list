import DOMController from "../DOMController"
import tasksManager from "../tasksManager"
import {formatDate} from "../../index"

function makeUpcomingPage () {
    DOMController.clearPage()
    let today = formatDate(new Date())
    const taskList = tasksManager.getAllTasksSorted()

    for (let i=1; i<=7; i++){
        DOMController.addDay(formatDate(new Date(new Date().getTime() + i* 24 * 60 * 60 * 1000)))
    }
    for (let i=0; i<taskList.length; i++){
        if (taskList[i].dueDate && new Date (taskList[i].dueDate.slice(5)) > new Date (today.slice(5))){
            DOMController.addTask(taskList[i])
        }
    }

    DOMController.addEmptyMsg('upcoming')
}

export {makeUpcomingPage}